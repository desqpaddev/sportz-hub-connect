import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      throw new Error("Cashfree credentials not configured");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const { registrationId, customerName, customerEmail, customerPhone, returnUrl } = body;
    const purpose = body.purpose === "pat" ? "pat" : "registration";
    let amount = body.amount;

    if (purpose === "pat") {
      const { data: reg } = await supabase.from("registrations").select("id, pat_slot_id, user_id").eq("id", registrationId).single();
      if (!reg || reg.user_id !== user.id || !reg.pat_slot_id) throw new Error("Select a PAT slot first");
      const { data: slot } = await supabase.from("pat_slots").select("fee").eq("id", reg.pat_slot_id).single();
      if (!slot) throw new Error("PAT slot not found");
      amount = slot.fee;
    }

    if (!registrationId || !amount || !customerEmail || !customerPhone) {
      throw new Error("Missing required fields");
    }

    const orderId = `${purpose === "pat" ? "pat" : "order"}_${registrationId.substring(0, 8)}_${Date.now()}`;

    // Create order via Cashfree API (Production)
    const cfResponse = await fetch("https://api.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: user.id.substring(0, 30),
          customer_name: customerName || "Customer",
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${returnUrl}&order_id={order_id}`,
        },
        order_note: `${purpose === "pat" ? "PAT" : "Registration"}: ${registrationId}`,
      }),
    });

    const cfData = await cfResponse.json();

    if (!cfResponse.ok) {
      console.error("Cashfree error:", JSON.stringify(cfData));
      throw new Error(cfData.message || "Failed to create Cashfree order");
    }

    // Update registration with order info
    if (purpose !== "pat") await supabase.from("registrations").update({
      payment_status: "pending",
    } as any).eq("id", registrationId);

    return new Response(JSON.stringify({
      orderId: cfData.order_id,
      paymentSessionId: cfData.payment_session_id,
      orderStatus: cfData.order_status,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
