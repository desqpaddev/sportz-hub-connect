import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { ELIGIBILITY_LABELS } from "@/pages/Eligibility";

const AdminPAT = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [eventId, setEventId] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [regs, setRegs] = useState<any[]>([]);
  const [form, setForm] = useState({ slot_date: "", slot_time: "", venue: "", fee: "500", capacity: "20" });

  const loadEvents = async () => {
    const { data } = await supabase.from("events").select("id, title, requires_eligibility").order("event_date", { ascending: false });
    setEvents(data || []);
    const first = (data || []).find((e) => e.requires_eligibility);
    if (first && !eventId) setEventId(first.id);
  };
  const load = async () => {
    if (!eventId) return;
    const [{ data: s }, { data: r }] = await Promise.all([
      supabase.from("pat_slots").select("*").eq("event_id", eventId).order("slot_date"),
      supabase.from("registrations").select("id, registration_number, first_name, last_name, eligibility_status, eligibility_certificate_url, pat_slot_id, pat_payment_status").eq("event_id", eventId).neq("eligibility_status", "not_required"),
    ]);
    setSlots(s || []); setRegs(r || []);
  };
  useEffect(() => { loadEvents(); }, []);
  useEffect(() => { load(); }, [eventId]);

  const swimEvents = events.filter((e) => e.requires_eligibility);

  const toggleEvent = async (id: string, val: boolean) => {
    const { error } = await supabase.from("events").update({ requires_eligibility: val }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    loadEvents();
  };

  const addSlot = async () => {
    if (!eventId || !form.slot_date || !form.slot_time) return toast({ title: "Date and time are required", variant: "destructive" });
    const { error } = await supabase.from("pat_slots").insert({ event_id: eventId, slot_date: form.slot_date, slot_time: form.slot_time, venue: form.venue, fee: Number(form.fee) || 0, capacity: Number(form.capacity) || 1 });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setForm({ ...form, slot_date: "", slot_time: "" }); load();
  };
  const delSlot = async (id: string) => { await supabase.from("pat_slots").delete().eq("id", id); load(); };

  const decide = async (regId: string, status: "approved" | "rejected") => {
    const notes = status === "rejected" ? window.prompt("Reason (shown to participant)") || "" : null;
    const { error } = await supabase.from("registrations").update({ eligibility_status: status, eligibility_notes: notes }).eq("id", regId);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    load();
  };
  const viewCert = async (path: string) => {
    const { data } = await supabase.storage.from("eligibility-certificates").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-lg border border-border bg-card">
        <h3 className="font-display font-bold uppercase text-foreground mb-2">Events needing eligibility (Swimathon)</h3>
        <div className="flex flex-wrap gap-2">
          {events.map((e) => (
            <label key={e.id} className="flex items-center gap-2 text-sm border border-border rounded px-2 py-1">
              <input type="checkbox" checked={e.requires_eligibility} onChange={(ev) => toggleEvent(e.id, ev.target.checked)} />{e.title}
            </label>
          ))}
        </div>
      </div>

      {swimEvents.length > 0 && (
        <Select value={eventId} onValueChange={setEventId}>
          <SelectTrigger className="max-w-md"><SelectValue placeholder="Select swimathon event" /></SelectTrigger>
          <SelectContent>{swimEvents.map((e) => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}</SelectContent>
        </Select>
      )}

      {eventId && swimEvents.some((e) => e.id === eventId) && (
        <>
          <div className="p-5 rounded-lg border border-border bg-card space-y-3">
            <h3 className="font-display font-bold uppercase text-foreground">Add PAT Slot</h3>
            <div className="grid sm:grid-cols-5 gap-2">
              <Input type="date" value={form.slot_date} onChange={(e) => setForm({ ...form, slot_date: e.target.value })} />
              <Input placeholder="Time e.g. 7:00 AM" value={form.slot_time} onChange={(e) => setForm({ ...form, slot_time: e.target.value })} />
              <Input placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
              <Input type="number" placeholder="Fee ₹" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
              <Input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            </div>
            <Button onClick={addSlot}>Add Slot</Button>
            <div className="space-y-2">
              {slots.map((s) => (
                <div key={s.id} className="flex items-center justify-between border border-border rounded p-2 text-sm">
                  <span>{s.slot_date} · {s.slot_time} · {s.venue} · ₹{s.fee} · {regs.filter((r) => r.pat_slot_id === s.id && r.pat_payment_status === "paid").length}/{s.capacity} booked</span>
                  <Button size="sm" variant="ghost" onClick={() => delSlot(s.id)}><Trash2 size={14} /></Button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-lg border border-border bg-card space-y-2">
            <h3 className="font-display font-bold uppercase text-foreground">Participant Eligibility</h3>
            {regs.length === 0 && <p className="text-sm text-muted-foreground">No registrations yet.</p>}
            {regs.map((r) => {
              const slot = slots.find((s) => s.id === r.pat_slot_id);
              return (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 border border-border rounded p-2 text-sm">
                  <div>
                    <b>{r.registration_number}</b> {r.first_name} {r.last_name}
                    <Badge className="ml-2 bg-primary/10 text-primary">{ELIGIBILITY_LABELS[r.eligibility_status] || r.eligibility_status}</Badge>
                    {slot && r.pat_payment_status === "paid" && <span className="ml-2 text-muted-foreground">PAT: {slot.slot_date} {slot.slot_time}</span>}
                  </div>
                  <div className="flex gap-2">
                    {r.eligibility_certificate_url && <Button size="sm" variant="outline" onClick={() => viewCert(r.eligibility_certificate_url)}>View Certificate</Button>}
                    <Button size="sm" onClick={() => decide(r.id, "approved")}>Eligible</Button>
                    <Button size="sm" variant="destructive" onClick={() => decide(r.id, "rejected")}>Not Eligible</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPAT;
