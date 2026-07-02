import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronRight, Waves, Footprints, Bike, Users, Phone, Mail, MapPin, Newspaper } from "lucide-react";

const editions = [
  {
    title: "Federal Bank Kochi Swimathon Ultra",
    year: "2026",
    tag: "Flagship • 12 Apr 2026",
    blurb: "India's Largest Open Water Swimathon. Fresh water, River Periyar, Kerala. 5th Edition.",
    image: "https://tdksports.in/img/swimathon2026.webp",
    icon: <Waves className="w-5 h-5" />,
    href: "/events",
    highlight: true,
  },
  {
    title: "Kochi Swimathon Ultra",
    year: "2025",
    tag: "727 Swimmers",
    blurb: "Powered by Federal Bank — India's largest river swimathon on the Periyar.",
    icon: <Waves className="w-5 h-5" />,
    video: "https://www.youtube.com/watch?v=WBL8GARfsVA",
  },
  {
    title: "Florid Kochi Swimathon",
    year: "2024",
    tag: "610 Swimmers • 10M Ultra",
    blurb: "The definitive open water endurance event on the river Periyar.",
    icon: <Waves className="w-5 h-5" />,
    video: "https://www.youtube.com/watch?v=NSbJ3ildWgI",
  },
  {
    title: "Florid Kochi Swimathon",
    year: "2023",
    tag: "10 KM • River Periyar",
    blurb: "South India's first river swimathon — a landmark edition.",
    icon: <Waves className="w-5 h-5" />,
    video: "https://www.youtube.com/watch?v=GjXYrYR-k4M",
  },
  {
    title: "Kochi Swimathon",
    year: "2022",
    tag: "Return Edition",
    blurb: "Where it all rebuilt — swimmers returned to the Periyar.",
    icon: <Waves className="w-5 h-5" />,
    video: "https://www.youtube.com/watch?v=Z9noe2ql_7g",
  },
  {
    title: "Paddlers Meetup",
    year: "2021",
    tag: "World Tourism Day",
    blurb: "Paddlers meet & River Periyar cleanup at Aluva Manappuram.",
    icon: <Users className="w-5 h-5" />,
    video: "https://www.youtube.com/watch?v=FnBdAaNv0O4",
  },
  {
    title: "Kochi Duskathon",
    year: "2019",
    tag: "Barefoot Beach Run",
    blurb: "The largest barefoot race — Kuzhupilly to Cherai, sunset run.",
    icon: <Footprints className="w-5 h-5" />,
    video: "https://www.youtube.com/watch?v=y4um_W7ef-I",
  },
  {
    title: "Kochi Duskathon",
    year: "2018",
    tag: "Inaugural Edition",
    blurb: "The debut sunset marathon promoting beach tourism in Kochi.",
    icon: <Footprints className="w-5 h-5" />,
    video: "https://www.youtube.com/watch?v=SstpAwBCOMY",
  },
  {
    title: "Tour de Kerala",
    year: "2014",
    tag: "90 KM Cyclothon",
    blurb: "AICA Tour de Kerala, powered by FUJI Bikes — Pampa stretch.",
    icon: <Bike className="w-5 h-5" />,
    video: "https://www.youtube.com/watch?v=P0RMl5264No",
  },
];

const sponsors = [
  { label: "Title Sponsor", name: "Federal Bank", src: "https://tdksports.in/img/Federal_Bank_logo.png" },
  { label: "Supported by", name: "Periyar Adventure Club", src: "https://tdksports.in/img/periyarclublogo.png" },
  { label: "An Initiative By", name: "Santos.Travel", src: "https://tdksports.in/img/santos.travel_logo.png" },
  { label: "In Association with", name: "DTPC Ernakulam", src: "https://tdksports.in/img/dtpc_logo_new.jpg" },
  { label: "In Association with", name: "Kerala Tourism", src: "https://tdksports.in/img/Kerala_Tourism_large.png" },
  { label: "Sports Partner", name: "Decathlon", src: "https://tdksports.in/img/decathlon_logo.png" },
  { label: "NGO", name: "DARC", src: "https://tdksports.in/img/darc_logo.jpg" },
  { label: "Medical Partner", name: "Aster Medcity", src: "https://tdksports.in/img/Aster_logo.png" },
];

const press = [
  { outlet: "Times of India", date: "Apr 2019", title: "'Kochi Duskathon' held in Kuzhupilly beach", href: "https://timesofindia.indiatimes.com/entertainment/events/kochi/kochi-duskathon-held-in-kuzhupilly-beach/articleshow/68918001.cms" },
  { outlet: "The Hindu", date: "Apr 2019", title: "Kochi Duskathon beach run today", href: "https://www.thehindu.com/news/cities/Kochi/kochi-duskathon-beach-run-today/article26831091.ece" },
  { outlet: "New Indian Express", date: "Apr 2019", title: "Kochi Duskathon aims for a Guinness Record", href: "http://www.newindianexpress.com/cities/kochi/2019/apr/11/kochi-duskathon-aims-for-a-guinness-record-1962821.html" },
  { outlet: "Deccan Chronicle", date: "Mar 2019", title: "Kochi Duskathon in April", href: "https://www.deccanchronicle.com/lifestyle/travel/140319/kochi-duskathon-in-april.html" },
  { outlet: "The Hindu", date: "Sep 2014", title: "Cycle marathon held on Sabarimala road", href: "https://www.thehindu.com/news/national/kerala/cycle-marathon-held-on-sabarimala-road/article6456888.ece" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* HERO — Flagship Swimathon 2026 */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 section-dark">
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(ellipse at top left, hsl(var(--primary) / 0.35), transparent 55%), radial-gradient(ellipse at bottom right, hsl(var(--accent) / 0.25), transparent 55%)"
        }} />
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }} />

        <div className="container relative mx-auto px-4 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-[0.25em]">Registrations Open</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display uppercase leading-[1.02] text-foreground">
              Endurance Events.<br />
              <span className="text-primary">Kerala's Wildest</span> Playground.
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              TDK Sports organises India's largest river swimathon, barefoot beach runs, paddler meetups and cyclothons — turning the Periyar, Cherai and Sabarimala trails into arenas of grit.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/events">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow gap-3 uppercase tracking-wider font-bold px-8">
                  Register for Swimathon 2026 <Trophy size={18} />
                </Button>
              </Link>
              <Link to="/results">
                <Button size="lg" variant="outline" className="uppercase tracking-wider font-bold gap-2 border-border">
                  Timing & E-Certificates <ChevronRight size={16} />
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { v: "727", l: "Swimmers 2025" },
                { v: "10+", l: "Editions" },
                { v: "12", l: "Years Running" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-3xl md:text-4xl font-bold font-display text-foreground">{s.v}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-glow">
              <img
                src="https://tdksports.in/img/swimathon2026.webp"
                alt="Federal Bank Kochi Swimathon Ultra 2026 — 12 April 2026"
                className="w-full h-auto"
                loading="eager"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">5th Edition • 12 Apr 2026</p>
                <p className="text-white font-bold font-display text-lg md:text-xl mt-1">Federal Bank Kochi Swimathon Ultra</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EVENT EDITIONS — TIMELINE */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-8 bg-primary/40" />
              <span className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">Editions</span>
              <span className="h-px w-8 bg-primary/40" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground uppercase">A Decade of Endurance</h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
              From cyclothons on the Sabarimala road to river swims on the Periyar — every edition, one legacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {editions.map((e, i) => (
              <motion.div
                key={`${e.title}-${e.year}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className={`group relative rounded-xl border ${
                  e.highlight ? "border-primary/50 bg-card shadow-glow" : "border-border bg-card shadow-card hover:shadow-glow hover:border-primary/30"
                } p-6 transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${e.highlight ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                    {e.icon}
                  </div>
                  <span className="text-2xl font-bold font-display text-muted-foreground/60 group-hover:text-primary transition-colors">
                    {e.year}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display uppercase text-foreground leading-tight">
                  {e.title}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mt-1">{e.tag}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{e.blurb}</p>

                {e.highlight ? (
                  <Link to="/events" className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-4 uppercase tracking-wider">
                    Register Now <ChevronRight size={14} />
                  </Link>
                ) : e.video ? (
                  <a href={e.video} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary mt-4 uppercase tracking-wider transition-colors">
                    Watch Recap <ChevronRight size={14} />
                  </a>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">Powered By</span>
            <h2 className="text-2xl md:text-4xl font-bold font-display text-foreground uppercase mt-2">Partners & Supporters</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sponsors.map((s) => (
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

      {/* PRESS COVERAGE */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Newspaper className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">In the Press</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground uppercase">As Featured In</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {press.map((p) => (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group block p-6 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{p.outlet}</span>
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                </div>
                <p className="text-foreground font-semibold leading-snug group-hover:text-primary transition-colors">
                  {p.title}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground mt-3 uppercase tracking-wider">
                  Read Article <ChevronRight size={12} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Contact */}
      <section className="relative py-24 md:py-28 overflow-hidden section-dark">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display uppercase mb-6 leading-[1.05]">
              Push The Limit.<br />
              <span className="text-primary">Protect The River.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Swim for glory. Swim for nature. Swim for safety. Register for the Federal Bank Kochi Swimathon Ultra 2026.
            </p>
            <Link to="/events">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow gap-3 uppercase tracking-wider font-bold text-base px-10 py-7">
                Register Now <Trophy size={20} />
              </Button>
            </Link>

            <div className="mt-14 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
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
};

export default Index;
