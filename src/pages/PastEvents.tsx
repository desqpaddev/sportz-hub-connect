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
                    <Link to={`/past-events/${event.id}`}>
                      <h2 className="text-3xl md:text-4xl font-bold font-display uppercase text-foreground mb-4 leading-tight hover:text-primary transition-colors cursor-pointer">
                        {event.title}
                      </h2>
                    </Link>

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

                    <div className="pt-5">
                      <Link to={`/past-events/${event.id}`}>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 uppercase tracking-wider font-semibold">
                          View Full Details <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
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
