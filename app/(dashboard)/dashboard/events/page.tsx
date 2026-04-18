import { EventsList } from "@/components/events/events-list";

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Events</h1>
        <p className="mt-1 text-muted-foreground">
          Club socials, regattas, training camps — book your place.
        </p>
      </div>
      <EventsList />
    </div>
  );
}
