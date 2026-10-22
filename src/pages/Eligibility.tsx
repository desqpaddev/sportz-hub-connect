import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileCheck, CalendarClock, Loader2, CheckCircle2 } from "lucide-react";

export const ELIGIBILITY_LABELS: Record<string, string> = {
  not_required: "Not required",
  pending: "Eligibility pending",
  certificate_submitted: "Certificate under review",
  pat_booked: "PAT booked",
  approved: "Eligible",
  rejected: "Not eligible — action needed",
};

const Eligibility = () => {
  const { regId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [reg, setReg] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [booked, setBooked] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<"cert" | "pat" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("registrations").select("*, events(title, event_date)").eq("id", regId!).single();
    setReg(data);
    if (data) {
      const { data: s } = await supabase.from("pat_slots").select("*").eq("event_id", data.event_id).eq("is_active", true).order("slot_date");
      setSlots(s || []);
      const counts: Record<string, number> = {};
      await Promise.all((s || []).map(async (sl) => {
        const { data: c } = await supabase.rpc("get_pat_slot_booked", { _slot_id: sl.id });
        counts[sl.id] = (c as number) || 0;
      }));
      setBooked(counts);
    }
  };
  useEffect(() => { load(); }, [regId]);

  const uploadCert = async () => {
    if (!file || !user) return;
    setBusy(true);
    const path = `${user.id}/${regId}-${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("eligibility-certificates").upload(path, file);
    if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); setBusy(false); return; }
    const { error } = await supabase.rpc("submit_eligibility_certificate", { _reg_id: regId!, _url: path });
    setBusy(false);
    if (error) return toast({ title: "Could not submit", description: error.message, variant: "destructive" });
    toast({ title: "Certificate submitted", description: "Our team will review it shortly." });
    load();
  };

  const bookAndPay = async (slot: any) => {
    setBusy(true);
    try {
      const { error } = await supabase.rpc("select_pat_slot", { _reg_id: regId!, _slot_id: slot.id });
      if (error) throw error;
      const returnUrl = `${window.location.origin}/payment-status?reg_id=${regId}&purpose=pat`;
      const { data, error: oErr } = await supabase.functions.invoke("create-cashfree-order", {
        body: { purpose: "pat", registrationId: regId, customerName: `${reg.first_name} ${reg.last_name}`, customerEmail: reg.email, customerPhone: reg.phone, returnUrl },
      });
      if (oErr || !data?.paymentSessionId) throw new Error(oErr?.message || data?.error || "Payment could not start");
      const { load: loadCf } = await import("@cashfreepayments/cashfree-js");
      const cf = await loadCf({ mode: "production" });
      await cf.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: "_self" });
    } catch (e: any) {
      toast({ title: "Booking failed", description: e.message, variant: "destructive" });
    }
    setBusy(false);
  };

  if (!reg) return <div className="min-h-screen pt-24 flex items-center justify-center text-muted-foreground"><Loader2 className="animate-spin" /></div>;

  const status = reg.eligibility_status;
  const canAct = ["pending", "rejected"].includes(status);
  const bookedSlot = slots.find((s) => s.id === reg.pat_slot_id);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold">Eligibility Test</p>
          <h1 className="font-display text-3xl font-bold uppercase text-foreground">{reg.events?.title}</h1>
          <p className="text-muted-foreground mt-1">Registration {reg.registration_number} · {reg.first_name} {reg.last_name}</p>
          <Badge className="mt-3 bg-primary/10 text-primary">{ELIGIBILITY_LABELS[status] || status}</Badge>
          {reg.eligibility_notes && <p className="mt-2 text-sm text-destructive">Note from organisers: {reg.eligibility_notes}</p>}
        </div>

        {status === "not_required" && <p className="text-muted-foreground">This event does not need an eligibility test.</p>}

        {status === "approved" && (
          <div className="p-6 rounded-lg border border-border bg-card flex items-center gap-3">
            <CheckCircle2 className="text-primary" /> <p className="text-foreground">You are eligible to participate. See you at the event!</p>
          </div>
        )}
        {status === "certificate_submitted" && <div className="p-6 rounded-lg border border-border bg-card text-foreground">Your certificate is being reviewed. We'll update your status here.</div>}
        {status === "pat_booked" && bookedSlot && (
          <div className="p-6 rounded-lg border border-border bg-card text-foreground">
            Your Pre-Assessment Test is booked for <b>{bookedSlot.slot_date}</b> at <b>{bookedSlot.slot_time}</b>{bookedSlot.venue && <> · {bookedSlot.venue}</>}. Your result will be updated here after the test.
          </div>
        )}

        {canAct && (
          <>
            <p className="text-foreground">To take part in this swim, show you are eligible. Do you have an eligibility certificate?</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <button onClick={() => setMode("cert")} className={`p-5 rounded-lg border text-left bg-card ${mode === "cert" ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                <FileCheck className="text-primary mb-2" /><p className="font-bold text-foreground">Yes, upload certificate</p>
                <p className="text-sm text-muted-foreground">Upload your swimming eligibility certificate.</p>
              </button>
              <button onClick={() => setMode("pat")} className={`p-5 rounded-lg border text-left bg-card ${mode === "pat" ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                <CalendarClock className="text-primary mb-2" /><p className="font-bold text-foreground">No, book a PAT</p>
                <p className="text-sm text-muted-foreground">Pick a Pre-Assessment Test slot and pay the fee.</p>
              </button>
            </div>

            {mode === "cert" && (
              <div className="p-5 rounded-lg border border-border bg-card space-y-3">
                <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <Button disabled={!file || busy} onClick={uploadCert} className="w-full">{busy ? "Uploading..." : "Submit Certificate"}</Button>
              </div>
            )}

            {mode === "pat" && (
              <div className="space-y-3">
                {slots.length === 0 && <p className="text-muted-foreground">No PAT slots are open yet. Please check back soon.</p>}
                {slots.map((s) => {
                  const left = s.capacity - (booked[s.id] || 0);
                  return (
                    <div key={s.id} className="p-4 rounded-lg border border-border bg-card flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-foreground">{s.slot_date} · {s.slot_time}</p>
                        <p className="text-sm text-muted-foreground">{s.venue} · {left} spots left</p>
                      </div>
                      <Button disabled={busy || left <= 0} onClick={() => bookAndPay(s)}>{left <= 0 ? "Full" : `Book & Pay ₹${s.fee}`}</Button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <Link to="/dashboard" className="text-sm text-primary">← Back to dashboard</Link>
      </div>
    </div>
  );
};

export default Eligibility;
