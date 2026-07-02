import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";

const initialForm = {
  full_name: "", phone: "", email: "", date_of_birth: "", gender: "",
  address: "", city: "", state: "", pincode: "",
  emergency_contact_name: "", emergency_contact_phone: "", emergency_contact_relation: "",
  blood_group: "", medical_conditions: "", tshirt_size: "", occupation: "",
  id_document_type: "aadhaar", id_document_number: "",
};

const CompleteProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (data) {
        setProfile(data);
        setForm((f) => ({
          ...f,
          full_name: data.full_name || "",
          phone: data.phone || "",
          email: data.email || user.email || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
          emergency_contact_relation: data.emergency_contact_relation || "",
          blood_group: data.blood_group || "",
          medical_conditions: data.medical_conditions || "",
          tshirt_size: data.tshirt_size || "",
          occupation: data.occupation || "",
          id_document_type: data.id_document_type || "aadhaar",
          id_document_number: data.id_document_number || "",
        }));
      }
      setLoading(false);
    })();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch (err: any) {
      toast({ title: "Camera error", description: err.message, variant: "destructive" });
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  const captureSelfie = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        setSelfieBlob(blob);
        setSelfiePreview(URL.createObjectURL(blob));
        stopCamera();
      }
    }, "image/jpeg", 0.9);
  };

  const uploadTo = async (path: string, file: Blob, contentType: string) => {
    const { error } = await supabase.storage
      .from("kyc-documents")
      .upload(path, file, { upsert: true, contentType });
    if (error) throw error;
    return path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Save profile fields first (allowed regardless of verification)
      const updates: any = { ...form, profile_completed: true };
      // date_of_birth empty string → null
      if (!updates.date_of_birth) delete updates.date_of_birth;

      // Handle uploads
      let id_document_url = profile?.id_document_url;
      let selfie_url = profile?.selfie_url;
      if (idFile) {
        const ext = idFile.name.split(".").pop() || "jpg";
        id_document_url = await uploadTo(`${user.id}/id.${ext}`, idFile, idFile.type);
        updates.id_document_url = id_document_url;
      }
      if (selfieBlob) {
        selfie_url = await uploadTo(`${user.id}/selfie.jpg`, selfieBlob, "image/jpeg");
        updates.selfie_url = selfie_url;
      }

      const { error: upErr } = await supabase.from("profiles").update(updates).eq("user_id", user.id);
      if (upErr) throw upErr;

      // If both docs are present, kick off KYC
      if (id_document_url && selfie_url) {
        setVerifying(true);
        const { data, error } = await supabase.functions.invoke("kyc-verify", {
          body: {
            id_document_type: form.id_document_type,
            id_document_number: form.id_document_number,
            id_document_path: id_document_url,
            selfie_path: selfie_url,
          },
        });
        if (error) {
          toast({ title: "Verification submitted", description: "We'll review your documents shortly." });
        } else {
          toast({ title: "Verification " + (data?.status || "pending"), description: data?.message || "You can register for events; verified badge will appear once approved." });
        }
        setVerifying(false);
      } else {
        toast({ title: "Profile saved", description: "Upload your ID and a selfie to complete verification." });
      }

      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
      setVerifying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-secondary pt-24 flex items-center justify-center"><p>Loading...</p></div>;

  const statusBadge = () => {
    const s = profile?.verification_status || "unverified";
    if (s === "verified") return <Badge className="bg-green-600 text-white"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge>;
    if (s === "rejected") return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
    if (s === "pending") return <Badge className="bg-yellow-500 text-white"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Pending</Badge>;
    return <Badge variant="outline">Unverified</Badge>;
  };

  return (
    <div className="min-h-screen bg-secondary pt-24 pb-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold uppercase text-foreground">Complete Your Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">Required once. Includes ID + face verification.</p>
          </div>
          {statusBadge()}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display font-bold uppercase text-lg">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name" required value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
              <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Phone" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="Date of Birth" type="date" required value={form.date_of_birth} onChange={(v) => setForm({ ...form, date_of_birth: v })} />
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="Occupation" value={form.occupation} onChange={(v) => setForm({ ...form, occupation: v })} />
            </div>
          </section>

          {/* Address */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display font-bold uppercase text-lg">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} /></div>
              <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
              <Field label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} />
            </div>
          </section>

          {/* Emergency */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display font-bold uppercase text-lg">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Name" value={form.emergency_contact_name} onChange={(v) => setForm({ ...form, emergency_contact_name: v })} />
              <Field label="Phone" value={form.emergency_contact_phone} onChange={(v) => setForm({ ...form, emergency_contact_phone: v })} />
              <Field label="Relation" value={form.emergency_contact_relation} onChange={(v) => setForm({ ...form, emergency_contact_relation: v })} />
            </div>
          </section>

          {/* Health */}
          <section className="rounded-lg border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display font-bold uppercase text-lg">Health & Kit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Blood Group</Label>
                <Select value={form.blood_group} onValueChange={(v) => setForm({ ...form, blood_group: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">T-Shirt Size</Label>
                <Select value={form.tshirt_size} onValueChange={(v) => setForm({ ...form, tshirt_size: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["XS","S","M","L","XL","XXL"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Label className="text-xs font-semibold uppercase tracking-wider">Medical Conditions / Allergies</Label>
                <Textarea rows={2} value={form.medical_conditions} onChange={(e) => setForm({ ...form, medical_conditions: e.target.value })} placeholder="None, or specify..." />
              </div>
            </div>
          </section>

          {/* ID + Face Verification */}
          <section className="rounded-lg border-2 border-primary/40 bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-display font-bold uppercase text-lg">ID & Face Verification</h2>
            </div>
            <p className="text-sm text-muted-foreground">Powered by HyperVerge. We match the photo on your ID with a live selfie.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider">Document Type</Label>
                <Select value={form.id_document_type} onValueChange={(v) => setForm({ ...form, id_document_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aadhaar">Aadhaar</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="Document Number" value={form.id_document_number} onChange={(v) => setForm({ ...form, id_document_number: v })} />
              <div className="md:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider">Upload ID (image/PDF)</Label>
                <Input type="file" accept="image/*,application/pdf" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
                {idFile && <p className="text-xs text-muted-foreground mt-1">Selected: {idFile.name}</p>}
                {!idFile && profile?.id_document_url && <p className="text-xs text-green-600 mt-1">Existing document on file</p>}
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider">Live Selfie</Label>
                <div className="mt-2 space-y-3">
                  {!cameraOn && !selfiePreview && !profile?.selfie_url && (
                    <Button type="button" variant="outline" onClick={startCamera}><Camera className="h-4 w-4 mr-2" /> Open Camera</Button>
                  )}
                  {cameraOn && (
                    <div className="space-y-2">
                      <video ref={videoRef} className="w-full max-w-sm rounded-lg border border-border" playsInline muted />
                      <div className="flex gap-2">
                        <Button type="button" onClick={captureSelfie}><Camera className="h-4 w-4 mr-2" /> Capture</Button>
                        <Button type="button" variant="ghost" onClick={stopCamera}>Cancel</Button>
                      </div>
                    </div>
                  )}
                  {selfiePreview && (
                    <div className="space-y-2">
                      <img src={selfiePreview} alt="selfie preview" className="w-40 h-40 object-cover rounded-lg border border-border" />
                      <Button type="button" variant="outline" size="sm" onClick={() => { setSelfieBlob(null); setSelfiePreview(null); startCamera(); }}>Retake</Button>
                    </div>
                  )}
                  {!selfiePreview && !cameraOn && profile?.selfie_url && (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-green-600">Selfie on file</p>
                      <Button type="button" variant="outline" size="sm" onClick={startCamera}><Camera className="h-3 w-3 mr-1" /> Retake</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <Button type="submit" disabled={saving || verifying} size="lg" className="w-full bg-primary text-primary-foreground uppercase tracking-wider font-bold">
            {verifying ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying...</> : saving ? "Saving..." : <><Upload className="h-4 w-4 mr-2" /> Save & Verify</>}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) => (
  <div>
    <Label className="text-xs font-semibold uppercase tracking-wider">{label}{required && " *"}</Label>
    <Input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default CompleteProfile;
