import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const empty = {
  title: "", sport: "", category: "", city: "", venue: "", event_date: "", event_time: "",
  price: 0, total_spots: 100, description: "", organizer_name: "", organizer_phone: "", organizer_email: "",
};

const statusStyle: Record<string, string> = {
  pending: "bg-accent/15 text-accent-foreground",
  approved: "bg-primary/10 text-primary",
  rejected: "bg-destructive/10 text-destructive",
};

const HostEvent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ ...empty, organizer_email: user?.email ?? "" });
  const [mine, setMine] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("events").select("*").eq("created_by", user.id).order("created_at", { ascending: false });
    setMine(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const submit = async () => {
    const required = ["title", "sport", "city", "venue", "event_date", "event_time", "organizer_name", "organizer_phone"];
    if (required.some((k) => !(form as any)[k])) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("events").insert({
      ...form, category: form.category || form.sport, created_by: user!.id, status: "upcoming", approval_status: "pending",
    } as any);
    setSaving(false);
    if (error) { toast({ title: "Could not submit", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Event submitted", description: "Our team will review and approve it shortly." });
    setForm({ ...empty, organizer_email: user?.email ?? "" });
    load();
  };

  const field = (k: string, label: string, type = "text", req = false) => (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-wider">{label}{req && " *"}</Label>
      <Input type={type} value={(form as any)[k]} onChange={(e) => set(k, type === "number" ? parseInt(e.target.value) || 0 : e.target.value)} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold font-display uppercase text-foreground">Host an Event</h1>
        <p className="text-muted-foreground mt-2 mb-8">Submit your event details. Once approved by TDK Sports, it goes live on the Events page.</p>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display uppercase font-bold text-foreground">Organiser details</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {field("organizer_name", "Name / Organisation", "text", true)}
            {field("organizer_phone", "Phone", "tel", true)}
            {field("organizer_email", "Email", "email")}
          </div>
          <h2 className="font-display uppercase font-bold text-foreground pt-2">Event details</h2>
          {field("title", "Event title", "text", true)}
          <div className="grid sm:grid-cols-2 gap-3">
            {field("sport", "Sport", "text", true)}
            {field("category", "Category")}
            {field("city", "City", "text", true)}
            {field("venue", "Venue", "text", true)}
            {field("event_date", "Date", "date", true)}
            {field("event_time", "Time (e.g. 6:00 AM)", "text", true)}
            {field("price", "Entry fee (₹)", "number")}
            {field("total_spots", "Total spots", "number")}
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider">Description</Label>
            <Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <Button onClick={submit} disabled={saving} className="w-full uppercase font-bold tracking-wider">
            {saving ? "Submitting..." : "Submit for approval"}
          </Button>
        </div>

        <h2 className="text-2xl font-bold font-display uppercase text-foreground mt-12 mb-4">My submitted events</h2>
        <div className="space-y-3">
          {mine.map((ev) => (
            <div key={ev.id} className="p-4 rounded-lg border border-border bg-card flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-bold font-display uppercase text-foreground truncate">{ev.title}</h3>
                <p className="text-sm text-muted-foreground">{ev.sport} · {ev.city} · {ev.event_date}</p>
                {ev.approval_status === "rejected" && ev.rejection_reason && (
                  <p className="text-sm text-destructive mt-1">Reason: {ev.rejection_reason}</p>
                )}
              </div>
              <Badge className={`${statusStyle[ev.approval_status] || ""} capitalize shrink-0`}>{ev.approval_status}</Badge>
            </div>
          ))}
          {mine.length === 0 && <p className="text-muted-foreground">You haven't submitted any events yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default HostEvent;
