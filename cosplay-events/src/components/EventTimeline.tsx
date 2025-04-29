'use client';

import { useMemo, useState } from 'react';

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  link: string;
};

export default function EventTimeline({ events = [] }: { events?: Event[] }) {
  const [selectedLocation, setSelectedLocation] = useState('Alle');

  // Hent unike lokasjoner
  const locations = useMemo(() => {
    const all = events.map((e) => e.location);
    return ['Alle', ...Array.from(new Set(all))];
  }, [events]);

  // Filtrer basert på valgt sted
  const filteredEvents = useMemo(() => {
    if (selectedLocation === 'Alle') return events;
    return events.filter((e) => e.location === selectedLocation);
  }, [events, selectedLocation]);

  if (!Array.isArray(events) || events.length === 0) {
    return <p>Ingen arrangementer funnet.</p>;
  }

  return (
    <div>
      {/* Filterkontroll */}
      <div className="mb-6">
      <label className="mr-2 font-medium" style={{ color: 'var(--cosevent-white)' }}>
  Filtrer etter sted:
</label>

        <select
          className="bg-black border border-[var(--cosevent-yellow)] text-white px-2 py-1 rounded"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-[var(--cosevent-white)] pl-6 space-y-10">
        {filteredEvents.length === 0 ? (
          <p className="text-white/60">Ingen eventer funnet for valgt sted.</p>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline Dot */}
              <span className="absolute -left-3 top-1 w-4 h-4 bg-white rounded-full border-2 border-[var(--cosevent-white)] shadow-md"></span>

              {/* Event Card */}
              <div className="box has-link group-hover:scale-[1.01] transition-transform">
                <h2 className="text-xl font-bold text-[var(--cosevent-yellow)] mb-1">{event.title}</h2>
                <p className="mb-2 text-sm text-white/80">
                  {event.date} <br />
                  {event.location}
                </p>
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--cosevent-white)] underline text-sm hover:text-white transition"
                >
                  ➜ Mer info
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
