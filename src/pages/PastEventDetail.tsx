import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PAST_EVENTS_EXTRAS } from "@/lib/pastEventsExtras";

type Event = Tables<"events">;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const PastEventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const { data } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
      setEvent(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 container mx-auto px-4">
        <div className="h-96 rounded-xl bg-secondary animate-pulse" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-32 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Event not found</h1>
        <Link to="/past-events">
          <Button variant="outline">Back to Past Events</Button>
        </Link>
      </div>
    );
  }

  const extras = PAST_EVENTS_EXTRAS[event.title] || {};

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-24 pb-12 bg-tdk-navy overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary))_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <Link to="/past-events" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 text-sm">
            <ArrowLeft size={16} /> Back to Past Events
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-wider">
              {event.sport}
            </Badge>
            <Badge variant="outline" className="text-gray-200 border-gray-500 uppercase tracking-wider">
              Completed
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-white uppercase leading-tight mb-6">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-gray-200 text-sm">
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> {formatDate(event.event_date)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> {event.city}
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} className="text-primary" /> {event.total_spots}+ participants
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-10"
        >
          {/* Media */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-tdk-navy shadow-card">
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

          {/* Description */}
          {event.description && (
            <section>
              <h2 className="text-2xl font-bold font-display uppercase mb-3">About the Event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </section>
          )}

          {/* Highlights */}
          {extras.highlights && extras.highlights.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold font-display uppercase mb-4">Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {extras.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <span className="text-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Quick facts */}
          <section className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg bg-card border border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Date</p>
              <p className="text-lg font-semibold">{formatDate(event.event_date)}</p>
            </div>
            <div className="p-5 rounded-lg bg-card border border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Location</p>
              <p className="text-lg font-semibold">{event.city}</p>
            </div>
            <div className="p-5 rounded-lg bg-card border border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Participants</p>
              <p className="text-lg font-semibold">{event.total_spots}+</p>
            </div>
          </section>

          {/* Press */}
          {extras.press && extras.press.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold font-display uppercase mb-4">Press Coverage</h2>
              <div className="flex flex-wrap gap-3">
                {extras.press.map((p) => (
                  <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <ExternalLink size={14} /> {p.label}
                    </Button>
                  </a>
                ))}
              </div>
            </section>
          )}

          <div className="pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
            <Link to="/past-events">
              <Button variant="outline" className="gap-2">
                <ArrowLeft size={16} /> All Past Events
              </Button>
            </Link>
            <Link to="/events">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                See Upcoming Events
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PastEventDetail;
