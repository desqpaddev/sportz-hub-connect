import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Trophy, User, LogOut, Download, Clock, Flame, History, ArrowRight, Camera, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { downloadCertificate } from "@/lib/certificate";

type Event = Tables<"events">;
type Registration = Tables<"registrations"> & { events?: Event | null };
type Result = Tables<"results"> & { events?: Event | null };
type Profile = Tables<"profiles">;

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [latestReg, setLatestReg] = useState<Registration | null>(null);

  const [editProfile, setEditProfile] = useState({
    full_name: "", phone: "", school: "", city: "",
  });

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [profileRes, regRes, resultsRes, eventsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user!.id).single(),
      supabase.from("registrations").select("*, events(*)").eq("user_id", user!.id).order("created_at", { ascending: false }),
      supabase.from("results").select("*, events(*)").order("created_at", { ascending: false }),
      supabase.from("events").select("*").eq("approval_status", "approved").order("event_date", { ascending: true }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setEditProfile({
        full_name: profileRes.data.full_name || "", phone: profileRes.data.phone || "",
        school: profileRes.data.school || "", city: profileRes.data.city || "",
      });
    }
    if (regRes.data) {
      setRegistrations(regRes.data as Registration[]);
      setLatestReg((regRes.data as Registration[])[0] || null);
    }
    if (resultsRes.data) setResults(resultsRes.data as Result[]);
    if (eventsRes.data) setAllEvents(eventsRes.data);
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    const filePath = `${user.id}/avatar.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploadingAvatar(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
    toast({ title: "Photo updated! 📸" });
    fetchData();
    setUploadingAvatar(false);
  };

  const today = new Date().toISOString().split("T")[0];
  const registeredEventIds = new Set(registrations.map(r => r.event_id));

  const categorizedEvents = useMemo(() => {
    const upcoming: Event[] = [];
    const ongoing: Event[] = [];
    const past: Event[] = [];
    for (const ev of allEvents) {
      if (ev.status === "ongoing") ongoing.push(ev);
      else if (ev.event_date > today || ev.status === "upcoming") upcoming.push(ev);
      else past.push(ev);
    }
    return { upcoming, ongoing, past };
  }, [allEvents, today]);

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update(editProfile).eq("user_id", user!.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated! ✅" });
      fetchData();
    }
    setSaving(false);
  };

  const medalColor: Record<string, string> = {
    gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
    silver: "bg-gray-100 text-gray-700 border-gray-300",
    bronze: "bg-orange-100 text-orange-800 border-orange-300",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const EventGrid = ({ events, emptyMsg }: { events: Event[]; emptyMsg: string }) => (
    <div>
      {events.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">{emptyMsg}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => {
            const isRegistered = registeredEventIds.has(ev.id);
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border bg-card overflow-hidden shadow-card"
              >
                <div className="h-1 w-full bg-primary" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className="text-xs bg-primary/10 text-primary border-primary/20 font-semibold uppercase">{ev.sport}</Badge>
                    {isRegistered && <Badge className="text-xs bg-green-100 text-green-700 border-green-300">Registered</Badge>}
                  </div>
                  <h3 className="font-bold font-display text-foreground mb-2 text-sm uppercase">{ev.title}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {ev.event_date} · {ev.event_time}</div>
                    <div className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {ev.venue}, {ev.city}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">₹{ev.price}</span>
                    <Link to={`/events/${ev.id}`}>
                      <Button size="sm" className={isRegistered ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground uppercase text-xs font-semibold"}>
                        {isRegistered ? "View" : "Book Now"} <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary pt-20">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground uppercase">My Dashboard</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut size={16} /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {profile && (profile as any).verification_status !== "verified" && (
          <div className="mb-6 rounded-lg border-2 border-yellow-500/50 bg-yellow-500/10 p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-bold text-foreground uppercase text-sm font-display">
                {(profile as any).verification_status === "pending" ? "Verification pending" : (profile as any).verification_status === "rejected" ? "Verification failed" : "Complete your profile"}
              </p>
              <p className="text-xs text-muted-foreground">
                Finish ID + face verification to unlock the "Verified" badge on your registrations.
              </p>
            </div>
            <Link to="/complete-profile">
              <Button size="sm" className="bg-primary text-primary-foreground uppercase font-bold">
                {(profile as any).verification_status === "unverified" ? "Complete Profile" : "Retry Verification"}
              </Button>
            </Link>
          </div>
        )}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="bg-card border border-border flex-wrap">
            <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase text-xs font-semibold tracking-wider">
              <Flame size={14} className="mr-2" /> Events
            </TabsTrigger>
            <TabsTrigger value="registrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase text-xs font-semibold tracking-wider">
              <Calendar size={14} className="mr-2" /> Registrations
            </TabsTrigger>
            {/* Results tab hidden */}
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground uppercase text-xs font-semibold tracking-wider">
              <User size={14} className="mr-2" /> Profile
            </TabsTrigger>
          </TabsList>

          {/* Events */}
          <TabsContent value="events" className="space-y-8">
            {categorizedEvents.ongoing.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <h2 className="text-lg font-bold font-display text-foreground uppercase">Ongoing Events</h2>
                  <Badge className="bg-green-100 text-green-700 text-xs">{categorizedEvents.ongoing.length}</Badge>
                </div>
                <EventGrid events={categorizedEvents.ongoing} emptyMsg="" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-primary" />
                <h2 className="text-lg font-bold font-display text-foreground uppercase">Upcoming Events</h2>
                <Badge className="bg-primary/10 text-primary text-xs">{categorizedEvents.upcoming.length}</Badge>
              </div>
              <EventGrid events={categorizedEvents.upcoming} emptyMsg="No upcoming events at the moment" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <History size={18} className="text-muted-foreground" />
                <h2 className="text-lg font-bold font-display text-foreground uppercase">Past Events</h2>
                <Badge className="bg-secondary text-secondary-foreground text-xs">{categorizedEvents.past.length}</Badge>
              </div>
              <EventGrid events={categorizedEvents.past} emptyMsg="No past events yet" />
            </div>
          </TabsContent>

          {/* Registrations */}
          <TabsContent value="registrations">
            {registrations.length === 0 ? (
              <div className="text-center py-16 border border-border rounded-lg bg-card">
                <p className="text-2xl mb-2">🏟️</p>
                <p className="text-muted-foreground mb-4">No registrations yet</p>
                <Link to="/events">
                  <Button className="bg-primary text-primary-foreground uppercase font-semibold">Browse Events</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {registrations.map((reg) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                     className="p-5 rounded-lg border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`/events/${reg.event_id}`} className="font-bold font-display text-foreground hover:text-primary transition-colors uppercase">{reg.events?.title || "Event"}</Link>
                        {(reg as any).registration_number && (
                          <Badge className="bg-primary/10 text-primary font-mono font-bold text-xs">{(reg as any).registration_number}</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {reg.events?.event_date}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {reg.events?.city}</span>
                        <span>Child: {reg.child_name}</span>
                        <span>Age: {reg.age_group}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {(reg as any).eligibility_status && (reg as any).eligibility_status !== "not_required" && (
                        <Link to={`/eligibility/${reg.id}`}>
                          <Button variant={(reg as any).eligibility_status === "approved" ? "outline" : "default"} size="sm" className="text-xs font-semibold uppercase tracking-wider">
                            {(reg as any).eligibility_status === "approved" ? "Eligible ✓" : "Eligibility Test"}
                          </Button>
                        </Link>
                      )}
                      {(reg as any).registration_number && (
                        <Link to={`/ticket/${reg.id}`}>
                          <Button variant="outline" size="sm" className="gap-1 text-xs font-semibold uppercase tracking-wider">
                            <Ticket size={14} /> View Ticket
                          </Button>
                        </Link>
                      )}
                      {reg.bib_number && (
                        <Badge className="bg-secondary text-secondary-foreground font-semibold">BIB #{reg.bib_number}</Badge>
                      )}
                      <Badge className={reg.status === "confirmed" ? "bg-green-100 text-green-700 border-green-300" : "bg-secondary text-secondary-foreground"}>
                        {reg.status}
                      </Badge>
                      <Badge className={reg.payment_status === "paid" ? "bg-primary/10 text-primary" : "bg-yellow-100 text-yellow-800"}>
                        {reg.payment_status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Results */}
          <TabsContent value="results">
            {results.length === 0 ? (
              <div className="text-center py-16 border border-border rounded-lg bg-card">
                <p className="text-2xl mb-2">🏆</p>
                <p className="text-muted-foreground">No results published yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {results.map((result) => (
                  <div key={result.id} className="p-5 rounded-lg border border-border bg-card shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold font-display text-foreground uppercase">{result.events?.title}</h3>
                      {result.medal && (
                        <Badge className={medalColor[result.medal] || "bg-secondary text-secondary-foreground"}>
                          🏅 {result.medal.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {result.position && (
                        <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Position</span><p className="font-bold text-foreground">#{result.position}</p></div>
                      )}
                      {result.time_recorded && (
                        <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Time</span><p className="font-bold text-foreground">{result.time_recorded}</p></div>
                      )}
                      {result.distance_recorded && (
                        <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Distance</span><p className="font-bold text-foreground">{result.distance_recorded}</p></div>
                      )}
                      {result.score !== null && (
                        <div><span className="text-muted-foreground text-xs uppercase tracking-wider">Score</span><p className="font-bold text-foreground">{result.score}</p></div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 text-primary gap-2 font-semibold"
                      onClick={() => {
                        const reg = registrations.find(r => r.id === result.registration_id);
                        downloadCertificate({
                          childName: reg?.child_name || "Participant",
                          eventTitle: result.events?.title || "Event",
                          eventDate: result.events?.event_date || "",
                          venue: result.events?.venue || "",
                          city: result.events?.city || "",
                          position: result.position,
                          medal: result.medal,
                          timeRecorded: result.time_recorded,
                          distanceRecorded: result.distance_recorded,
                          score: result.score ? Number(result.score) : null,
                          ageGroup: reg?.age_group,
                          bibNumber: reg?.bib_number,
                        });
                      }}
                    >
                      <Download size={14} /> Download Certificate
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Avatar & Basic Info Card */}
              <div className="rounded-lg border border-border bg-card p-6 shadow-card text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-28 h-28 border-4 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || ""} alt="Profile" />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {editProfile.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <h3 className="font-bold font-display text-foreground text-lg uppercase">{editProfile.full_name || "Your Name"}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {latestReg?.registration_number && (
                  <Badge className="mt-2 bg-primary/10 text-primary font-mono font-bold">{latestReg.registration_number}</Badge>
                )}
                {uploadingAvatar && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
              </div>

              {/* Verified Profile Details (from HyperVerge KYC) */}
              <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6 shadow-card">
                <h2 className="text-xl font-bold font-display text-foreground mb-1 uppercase">Verified Profile</h2>
                <p className="text-xs text-muted-foreground mb-4">Details fetched from your verified ID document</p>
                {(() => {
                  const vr: any = (profile as any)?.verification_result || {};
                  const ocr = vr.ocr || vr.details || vr;
                  const rows: { label: string; value: any }[] = [
                    { label: "Name on ID", value: ocr.name || ocr.fullName || ocr.full_name || (profile as any)?.full_name },
                    { label: "Date of Birth", value: ocr.dob || ocr.date_of_birth || (profile as any)?.date_of_birth },
                    { label: "Gender", value: ocr.gender || (profile as any)?.gender },
                    { label: "ID Type", value: (profile as any)?.id_document_type },
                    { label: "ID Number", value: ocr.idNumber || ocr.id_number || (profile as any)?.id_document_number },
                    { label: "Father's Name", value: ocr.fatherName || ocr.father_name },
                    { label: "Address", value: ocr.address || (profile as any)?.address },
                    { label: "Phone", value: (profile as any)?.phone },
                    { label: "Email", value: user?.email },
                  ];
                  const hasAny = rows.some(r => r.value);
                  if (!hasAny) {
                    return (
                      <div className="text-sm text-muted-foreground p-4 border border-dashed border-border rounded-md text-center">
                        No verified details yet. Complete your identity verification to auto-fill these fields.
                      </div>
                    );
                  }
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rows.map((r) => (
                        <div key={r.label}>
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.label}</Label>
                          <div className="mt-1 text-sm font-medium text-foreground border border-border bg-muted/30 rounded-md px-3 py-2 min-h-[38px]">
                            {r.value || <span className="text-muted-foreground">—</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Verification Details Card (HyperVerge) */}
              {profile && (
                <div className="lg:col-span-3 rounded-lg border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <h2 className="text-xl font-bold font-display text-foreground uppercase">
                      Identity Verification
                    </h2>
                    <Badge
                      className={
                        (profile as any).verification_status === "verified"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : (profile as any).verification_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : (profile as any).verification_status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {((profile as any).verification_status || "unverified").toUpperCase()}
                    </Badge>
                  </div>

                  {(() => {
                    const p: any = profile;
                    const vr = p.verification_result || {};
                    const ocr = vr.ocr || vr.idDetails || vr.id || {};
                    const face = vr.face || vr.faceMatch || {};
                    const liveness = vr.liveness || {};
                    const items = [
                      { label: "ID Type", value: p.id_document_type },
                      { label: "ID Number", value: p.id_document_number || ocr.idNumber || ocr.number },
                      { label: "Name on ID", value: ocr.name || ocr.fullName },
                      { label: "Date of Birth", value: ocr.dob || ocr.dateOfBirth || p.date_of_birth },
                      { label: "Gender", value: ocr.gender || p.gender },
                      { label: "Address (ID)", value: ocr.address },
                      { label: "Father's Name", value: ocr.fatherName },
                      { label: "Face Match Score", value: face.matchScore ?? face.score },
                      { label: "Face Match Result", value: face.match ?? face.result },
                      { label: "Liveness", value: liveness.result ?? liveness.status },
                      { label: "Provider", value: p.verification_provider },
                      { label: "Transaction ID", value: p.verification_transaction_id },
                      { label: "Verified At", value: p.verified_at ? new Date(p.verified_at).toLocaleString() : null },
                    ].filter((i) => i.value !== null && i.value !== undefined && i.value !== "");

                    return (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {items.length === 0 && (
                            <p className="col-span-full text-sm text-muted-foreground">
                              No verification data yet. Complete your KYC to see details here.
                            </p>
                          )}
                          {items.map((item) => (
                            <div key={item.label}>
                              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {item.label}
                              </span>
                              <p className="text-sm font-medium text-foreground mt-0.5 break-words">
                                {String(item.value)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {(p.id_document_url || p.selfie_url) && (
                          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {p.id_document_url && (
                              <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  ID Document
                                </span>
                                <img
                                  src={p.id_document_url}
                                  alt="ID document"
                                  className="mt-2 rounded-lg border border-border max-h-56 object-contain bg-muted"
                                />
                              </div>
                            )}
                            {p.selfie_url && (
                              <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  Selfie
                                </span>
                                <img
                                  src={p.selfie_url}
                                  alt="Selfie"
                                  className="mt-2 rounded-lg border border-border max-h-56 object-contain bg-muted"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {(profile as any).verification_status !== "verified" && (
                          <Link to="/complete-profile">
                            <Button size="sm" className="mt-4 bg-primary text-primary-foreground uppercase font-bold">
                              {(profile as any).verification_status === "unverified"
                                ? "Complete Verification"
                                : "Retry Verification"}
                            </Button>
                          </Link>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}



              {/* Registration Details Card */}
              {latestReg && (
                <div className="lg:col-span-3 rounded-lg border border-border bg-card p-6 shadow-card">
                  <h2 className="text-xl font-bold font-display text-foreground mb-4 uppercase">Registration Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                      { label: "First Name", value: latestReg.first_name },
                      { label: "Last Name", value: latestReg.last_name },
                      { label: "Email", value: latestReg.email },
                      { label: "Phone", value: latestReg.phone },
                      { label: "Date of Birth", value: latestReg.date_of_birth },
                      { label: "Gender", value: latestReg.gender },
                      { label: "Address", value: latestReg.address },
                      { label: "City", value: latestReg.city },
                      { label: "State / Country", value: latestReg.state_country },
                      { label: "Pin Code", value: latestReg.pincode },
                      { label: "Photo ID Type", value: latestReg.photo_id_type },
                      { label: "ID Number", value: latestReg.id_number },
                      { label: "Emergency Contact", value: latestReg.emergency_contact_name },
                      { label: "Emergency Phone", value: latestReg.emergency_contact_phone },
                      { label: "First Time?", value: latestReg.first_time_participation },
                      { label: "Blood Group", value: latestReg.blood_group },
                      { label: "Swimming Expertise", value: latestReg.swimming_expertise },
                      { label: "Club / Organization", value: latestReg.club_organization },
                      { label: "Airport Transfer", value: latestReg.airport_transfer },
                      { label: "Hotel Accommodation", value: latestReg.hotel_accommodation },
                      { label: "Event T-Shirt", value: latestReg.event_tshirt },
                      { label: "Breakfast", value: latestReg.breakfast_preference },
                      { label: "BIB Number", value: latestReg.bib_number },
                      { label: "Reg ID", value: latestReg.registration_number },
                    ].filter(item => item.value).map((item) => (
                      <div key={item.label}>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                        <p className="text-sm font-medium text-foreground mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
