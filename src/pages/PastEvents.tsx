import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Play, ExternalLink, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PAST_EVENTS_EXTRAS as EXTRAS } from "@/lib/pastEventsExtras";

type Event = Tables<"events">;

// Map events to their YouTube video + press links (from tdksports.in)
const EXTRAS: Record<string, { youtubeId?: string; press?: { label: string; url: string }[]; highlights?: string[] }> = {
  "Federal Bank Kochi Swimathon Ultra 2025": {
    youtubeId: "WBL8GARfsVA",
    highlights: [
      "727 swimmers — the largest edition to date",
      "10M Ultra category on River Periyar",
      "Title sponsored by Federal Bank",
    ],
  },
  "Florid Kochi Swimathon Ultra 2024": {
    youtubeId: "NSbJ3ildWgI",
    highlights: [
      "610 swimmers across the 10M Ultra",
      "India's Largest River Swimathon",
      "Presented by Florid",
    ],
  },
  "Florid Kochi Swimathon 2023": {
    youtubeId: "GjXYrYR-k4M",
    press: [
      { label: "Mathrubhumi News", url: "https://www.youtube.com/watch?v=-fuKy-qiTfI" },
      { label: "Manorama News", url: "https://www.youtube.com/watch?v=WV6a-F2cLE8" },
    ],
    highlights: [
      "South India's first 10 km river swimathon",
      "Held on the Periyar River, Aluva",
      "Featured on Mathrubhumi & Manorama News",
    ],
  },
  "Kochi Swimathon 2022": {
    youtubeId: "Z9noe2ql_7g",
    highlights: [
      "The inaugural edition of the Kochi Swimathon",
      "Set the stage for India's largest river swim",
    ],
  },
  "Paddlers Meetup 2021": {
    youtubeId: "FnBdAaNv0O4",
    press: [
      { label: "Manorama Online", url: "https://www.manoramaonline.com/district-news/ernakulam/2021/09/27/ernakulam-adventure-eco-tourism-project-in-aluva.html" },
    ],
    highlights: [
      "World Tourism Day celebration",
      "Kayakers united for a River Periyar cleanup",
      "Boost for adventure & eco-tourism in Aluva",
    ],
  },
  "Kochi Duskathon 2019": {
    youtubeId: "y4um_W7ef-I",
    press: [
      { label: "Times of India", url: "https://timesofindia.indiatimes.com/entertainment/events/kochi/kochi-duskathon-held-in-kuzhupilly-beach/articleshow/68918001.cms" },
      { label: "The Hindu", url: "https://www.thehindu.com/news/cities/Kochi/kochi-duskathon-beach-run-today/article26831091.ece" },
      { label: "New Indian Express", url: "http://www.newindianexpress.com/cities/kochi/2019/apr/11/kochi-duskathon-aims-for-a-guinness-record-1962821.html" },
    ],
    highlights: [
      "10 km beach run from Kuzhuppilly to Cherai",
      "Aimed for a Guinness World Record",
      "In association with DTPC & Kerala Tourism",
    ],
  },
  "Kochi Duskathon 2018": {
    youtubeId: "SstpAwBCOMY",
    press: [
      { label: "Indian Express", url: "http://www.newindianexpress.com/cities/kochi/2017/dec/31/kochi-duskathon-registrations-begin-1741302.html" },
      { label: "Times of India", url: "https://timesofindia.indiatimes.com/city/kochi/sunset-marathon-to-promote-beach-tourism-in-kochi/articleshow/61525578.cms" },
    ],
    highlights: [
      "The inaugural Kochi Duskathon",
      "1,200 barefoot runners on the sunset coast",
      "Launched to promote beach tourism in Kerala",
    ],
  },
  "Tour de Kerala 2014": {
    youtubeId: "P0RMl5264No",
    press: [
      { label: "The Hindu", url: "https://www.thehindu.com/news/national/kerala/cycle-marathon-held-on-sabarimala-road/article6456888.ece" },
    ],
    highlights: [
      "90 km cyclothon on the Sabarimala trunk road",
      "Winner: Ramesh Nagarajan, 2h 58min",
      "Powered by Fuji Bikes & AICA Group",
    ],
  },
};

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const PastEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("status", "completed")
        .order("event_date", { ascending: false });
      if (data) setEvents(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-tdk-navy overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary))_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block h-1 w-10 rounded-full bg-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">A Decade of Endurance</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-display text-white uppercase mb-4">
              Past <span className="text-primary">Events</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              From India's largest river swimathon to Kerala's biggest barefoot beach run — a journey of endurance events by TDK Sports since 2014.
            </p>
          </div>
        </div>
      </section>

      {/* Events list */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 rounded-xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">No past events yet.</p>
        ) : (
          <div className="space-y-16">
            {events.map((event, i) => {
              const extras = EXTRAS[event.title] || {};
              const isReverse = i % 2 === 1;
              return (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className={`grid md:grid-cols-2 gap-8 items-center ${isReverse ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  {/* Media */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-tdk-navy shadow-card group">
                    {extras.youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${extras.youtubeId}`}
                        title={event.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : event.image_url ? (
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/40">
                        <Play size={64} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-wider text-xs font-semibold">
                        {event.sport}
                      </Badge>
                      <Badge variant="outline" className="text-xs uppercase tracking-wider">
                        Completed
                      </Badge>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-display uppercase text-foreground mb-4 leading-tight">
                      {event.title}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} className="text-primary shrink-0" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={14} className="text-primary shrink-0" />
                        <span>{event.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users size={14} className="text-primary shrink-0" />
                        <span>{event.total_spots}+ participants</span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-muted-foreground leading-relaxed mb-5">{event.description}</p>
                    )}

                    {extras.highlights && (
                      <ul className="space-y-2 mb-5">
                        {extras.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {extras.press && extras.press.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                          Press Coverage
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {extras.press.map((p) => (
                            <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                                <ExternalLink size={12} /> {p.label}
                              </Button>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEvents;
