// HyperVerge ID + Face verification edge function
// Requires HYPERVERGE_APP_ID and HYPERVERGE_APP_KEY secrets to run automated checks.
// If keys are missing, the function marks the profile as 'pending' for manual admin review.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HV_BASE = "https://ind.idv.hyperverge.co/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user
    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = userData.user.id;

    const { id_document_type, id_document_number, id_document_path, selfie_path } = await req.json();
    if (!id_document_path || !selfie_path) {
      return new Response(JSON.stringify({ error: "Missing document or selfie" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Signed URLs so HyperVerge can fetch the files
    const [{ data: idSigned }, { data: selfieSigned }] = await Promise.all([
      admin.storage.from("kyc-documents").createSignedUrl(id_document_path, 60 * 10),
      admin.storage.from("kyc-documents").createSignedUrl(selfie_path, 60 * 10),
    ]);
    const idUrl = idSigned?.signedUrl;
    const selfieUrl = selfieSigned?.signedUrl;

    const appId = Deno.env.get("HYPERVERGE_APP_ID");
    const appKey = Deno.env.get("HYPERVERGE_APP_KEY");

    // If keys are not configured yet, fall back to pending (admin review)
    if (!appId || !appKey) {
      await admin.from("profiles").update({
        verification_status: "pending",
        verification_provider: "manual",
        verification_notes: "HyperVerge keys not configured; awaiting manual review.",
      }).eq("user_id", userId);
      return new Response(JSON.stringify({ status: "pending", message: "Submitted for manual review." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }

    const hvHeaders = {
      "appId": appId,
      "appKey": appKey,
      "transactionId": crypto.randomUUID(),
      "Content-Type": "application/json",
    };

    // 1. OCR/Read the ID document
    const ocrEndpoint = id_document_type === "passport" ? `${HV_BASE}/readPassport` : `${HV_BASE}/readAadhaar`;
    const ocrRes = await fetch(ocrEndpoint, {
      method: "POST",
      headers: hvHeaders,
      body: JSON.stringify({ image: idUrl }),
    });
    const ocrData = await ocrRes.json();

    // 2. Face match between ID photo and selfie
    const faceRes = await fetch(`${HV_BASE}/photo/faceMatch`, {
      method: "POST",
      headers: hvHeaders,
      body: JSON.stringify({ selfie: selfieUrl, idImage: idUrl }),
    });
    const faceData = await faceRes.json();

    // 3. Face liveness on selfie
    const liveRes = await fetch(`${HV_BASE}/checkLiveness`, {
      method: "POST",
      headers: hvHeaders,
      body: JSON.stringify({ image: selfieUrl }),
    });
    const liveData = await liveRes.json();

    const matchScore = faceData?.result?.details?.match?.value ?? faceData?.result?.match?.value ?? 0;
    const liveness = liveData?.result?.details?.liveness?.value ?? liveData?.result?.liveness?.value;
    const ocrOk = ocrData?.status === "success";
    const passed = ocrOk && Number(matchScore) >= 0.7 && (liveness === "yes" || liveness === true);

    const status = passed ? "verified" : "rejected";
    await admin.from("profiles").update({
      verification_status: status,
      verification_provider: "hyperverge",
      verification_transaction_id: hvHeaders.transactionId,
      verification_result: { ocr: ocrData, face: faceData, liveness: liveData },
      verified_at: passed ? new Date().toISOString() : null,
      verification_notes: passed ? null : "Face match or liveness check failed.",
    }).eq("user_id", userId);

    return new Response(JSON.stringify({
      status,
      message: passed ? "Identity verified successfully." : "Verification failed. Please retry with clearer photos.",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (err: any) {
    console.error("kyc-verify error", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
