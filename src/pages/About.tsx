import { motion } from "framer-motion";
import { Trophy, Waves, Leaf, Users, Shield, Sparkles, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const values = [
  { icon: <Waves size={24} />, title: "River-First Endurance", desc: "We turn the Periyar into a world-class open water arena — India's largest river swimathon runs here." },
  { icon: <Leaf size={24} />, title: "Rivers & Beaches, Protected", desc: "Every event is paired with cleanups and awareness drives. We race for nature, not against it." },
  { icon: <Shield size={24} />, title: "Safety by Design", desc: "Kayak escorts, on-water medics, Aster Medcity partnership and Coast Guard-grade protocols." },
  { icon: <Users size={24} />, title: "Community Powered", desc: "Backed by Periyar Adventure Club, DARC and hundreds of local volunteers each edition." },
  { icon: <Trophy size={24} />, title: "Certified Timing", desc: "RFID chip timing, e-certificates and published results via Alpha Racing Solution." },
  { icon: <Sparkles size={24} />, title: "Tourism Catalysts", desc: "In association with Kerala Tourism & DTPC Ernakulam — putting Kochi on the global adventure map." },
];

const milestones = [
  { year: "2014", cities: "Tour de Kerala", goal: "AICA 90 KM Cyclothon on the Sabarimala road, powered by FUJI Bikes.", icon: "🚴" },
  { year: "2018", cities: "Kochi Duskathon — Inaugural", goal: "India's first sunset barefoot beach run at Kuzhupilly Cherai. 1,200 runners.", icon: "🌅" },
  { year: "2019", cities: "Kochi Duskathon 2019", goal: "Guinness World Record attempt — largest barefoot beach race.", icon: "👣" },
  { year: "2021", cities: "Paddlers Meetup", goal: "World Tourism Day paddler meet & River Periyar cleanup.", icon: "🛶" },
  { year: "2022–2024", cities: "Kochi Swimathon Ultra", goal: "The Periyar becomes home to India's largest river swimathon — 610+ swimmers.", icon: "🏊" },
  { year: "2025", cities: "Federal Bank Kochi Swimathon Ultra", goal: "727 swimmers, 10M Ultra. A record-setting edition on the Periyar.", icon: "🥇" },
  { year: "2026", cities: "Swimathon Ultra — 5th Edition", goal: "12 April 2026. 20K Ultra+, 10 Mile Ultra, 10K Marathon and Kids' distances.", icon: "🚀" },
];

const numbers = [
  { value: "12+", label: "Years Organising" },
  { value: "10+", label: "Editions Delivered" },
  { value: "727", label: "Swimmers, 2025" },
  { value: "5,000+", label: "Athletes Hosted" },
];

const partners = [
  { label: "Title Sponsor", name: "Federal Bank", src: "https://tdksports.in/img/Federal_Bank_logo.png" },
  { label: "Supported by", name: "Periyar Adventure Club", src: "https://tdksports.in/img/periyarclublogo.png" },
  { label: "Initiative by", name: "Santos.Travel", src: "https://tdksports.in/img/santos.travel_logo.png" },
  { label: "In Association with", name: "DTPC Ernakulam", src: "https://tdksports.in/img/dtpc_logo_new.jpg" },
  { label: "In Association with", name: "Kerala Tourism", src: "https://tdksports.in/img/Kerala_Tourism_large.png" },
  { label: "Sports Partner", name: "Decathlon", src: "https://tdksports.in/img/decathlon_logo.png" },
  { label: "NGO", name: "DARC", src: "https://tdksports.in/img/darc_logo.jpg" },
  { label: "Medical Partner", name: "Aster Medcity", src: "https://tdksports.in/img/Aster_logo.png" },
];

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    {/* Hero Banner */}
    <section className="relative pt-20 overflow-hidden section-dark">
      <div className="absolute inset-0 opacity-30" style={{
        background: "radial-gradient(ellipse at top left, hsl(var(--primary) / 0.4), transparent 55%), radial-gradient(ellipse at bottom right, hsl(var(--accent) / 0.25), transparent 55%)"
      }} />
      <div className="relative container mx-auto px-4 py-20 md:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-block h-1 w-10 rounded-full bg-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">Who We Are</span>
            <span className="inline-block h-1 w-10 rounded-full bg-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white uppercase mb-6">
            About <span className="text-primary">TDK Sports</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            A Kochi-based sports events company turning Kerala's rivers, beaches and hills into world-class endurance arenas — organisers of India's largest river swimathon.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-8 rounded-2xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-primary/40" />
              <span className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">Mission</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground uppercase mb-4">
              Endurance events with <span className="text-primary">purpose</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We design large-scale endurance sports — river swimathons, sunset beach runs, paddler meetups and cyclothons — that celebrate Kerala's landscape while raising the bar on safety, timing and athlete experience.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-accent/40" />
              <span className="text-sm font-semibold text-accent uppercase tracking-[0.25em]">Vision</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground uppercase mb-4">
              Put Kerala on the global <span className="text-accent">adventure map</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To make the Periyar, Cherai and the Western Ghats destinations that global endurance athletes travel to — while protecting the very rivers and beaches that host us, together with Kerala Tourism and DTPC Ernakulam.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Numbers Strip */}
    <section className="py-14 section-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {numbers.map((n, i) => (
            <motion.div key={n.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="text-4xl md:text-5xl font-bold font-display text-white">{n.value}</p>
              <p className="text-sm text-gray-400 mt-2 uppercase tracking-wider">{n.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Values Grid */}
    <section className="py-20 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-8 bg-primary/40" />
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">What Drives Us</span>
            <span className="h-px w-8 bg-primary/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground uppercase">Our Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-glow transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {v.icon}
              </div>
              <h3 className="text-lg font-bold font-display text-foreground mb-2 uppercase tracking-wide">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Milestones */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-8 bg-primary/40" />
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">The Journey</span>
            <span className="h-px w-8 bg-primary/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground uppercase">Milestones</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {milestones.map((t, i) => (
            <motion.div key={t.year} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex gap-6 items-start relative">
              {i < milestones.length - 1 && (
                <div className="absolute left-7 top-16 w-0.5 h-16 bg-gradient-to-b from-primary/40 to-border" />
              )}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-glow">
                  <span className="text-xl">{t.icon}</span>
                </div>
              </div>
              <div className="pb-10">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-2xl font-bold font-display text-foreground">{t.year}</span>
                  {i === milestones.length - 1 && (
                    <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20">Upcoming</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <p className="text-sm font-semibold text-foreground">{t.cities}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t.goal}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Partners */}
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">Powered By</span>
          <h2 className="text-2xl md:text-4xl font-bold font-display text-foreground uppercase mt-2">Partners & Supporters</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {partners.map((s) => (
            <div key={s.name} className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center hover:border-primary/30 hover:shadow-card transition-all">
              <div className="h-16 flex items-center justify-center mb-3">
                <img src={s.src} alt={s.name} className="max-h-14 max-w-full object-contain" loading="lazy" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{s.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA + Contact */}
    <section className="py-24 section-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-6xl font-bold font-display uppercase mb-6 text-white leading-[1.05]">
            Race with <span className="text-primary">Us</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
            Sponsor an edition, volunteer on the water, or line up on race day. Let's build the next one together.
          </p>

          <Link to="/events">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow gap-3 uppercase tracking-wider font-bold text-base px-10 py-7">
              Explore Events <ArrowRight size={20} />
            </Button>
          </Link>

          <div className="mt-16 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Call</p>
                <a href="tel:8089084088" className="text-white font-semibold hover:text-primary transition-colors">8089084088</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Email</p>
                <a href="mailto:info@tdksports.in" className="text-white font-semibold hover:text-primary transition-colors">info@tdksports.in</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Based In</p>
                <p className="text-white font-semibold">Kochi, Kerala</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </div>
);

export default AboutPage;
