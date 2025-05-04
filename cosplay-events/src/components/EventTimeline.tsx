'use client';

import { useMemo, useState } from 'react';
import cityDataRaw from '@/utils/city-lookup.json';

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  link: string;
  source?: string;
  isVisible?: boolean;
  isNew?: boolean;
  createdAt?: import("firebase/firestore").Timestamp;
};

// Typesikring av JSON
type CityInfo = { city: string; country: string; continent: string };
const cityData = cityDataRaw as Record<string, CityInfo>;

function normalizeCity(location: string): CityInfo | null {
  const match = location.match(/where:\s*(.*)/i);
  const rawCity = match?.[1]?.trim().toLowerCase();
  if (!rawCity) return null;
  return cityData[rawCity] || null;
}

export default function EventTimeline({ events = [] }: { events?: Event[] }) {
  const [continentFilter, setContinentFilter] = useState('Alle');
  const [countryFilter, setCountryFilter] = useState('Alle');
  const [cityFilter, setCityFilter] = useState('Alle');

  const enrichedEvents = useMemo(() => {
    return events.map((e) => {
      const cityInfo = normalizeCity(e.location);
      return {
        ...e,
        city: cityInfo?.city || 'Ukjent',
        country: cityInfo?.country || 'Ukjent',
        continent: cityInfo?.continent || 'Ukjent',
      };
    });
  }, [events]);

  // Hent unike verdier
  const continents = useMemo(() => {
    const all = enrichedEvents.map((e) => e.continent);
    return ['Alle', ...Array.from(new Set(all))];
  }, [enrichedEvents]);

  const countries = useMemo(() => {
    const filtered = continentFilter === 'Alle'
      ? enrichedEvents
      : enrichedEvents.filter((e) => e.continent === continentFilter);
    const all = filtered.map((e) => e.country);
    return ['Alle', ...Array.from(new Set(all))];
  }, [enrichedEvents, continentFilter]);

  const cities = useMemo(() => {
    const filtered = enrichedEvents.filter((e) => {
      const matchContinent = continentFilter === 'Alle' || e.continent === continentFilter;
      const matchCountry = countryFilter === 'Alle' || e.country === countryFilter;
      return matchContinent && matchCountry;
    });
    const all = filtered.map((e) => e.city);
    return ['Alle', ...Array.from(new Set(all))];
  }, [enrichedEvents, continentFilter, countryFilter]);

  const filteredEvents = useMemo(() => {
    return enrichedEvents.filter((e) => {
      const matchContinent = continentFilter === 'Alle' || e.continent === continentFilter;
      const matchCountry = countryFilter === 'Alle' || e.country === countryFilter;
      const matchCity = cityFilter === 'Alle' || e.city === cityFilter;
      return matchContinent && matchCountry && matchCity;
    });
  }, [enrichedEvents, continentFilter, countryFilter, cityFilter]);

  return (
    <div>
      {/* Filtre */}
      <div className="gap-4 mb-6 space-y-2 md:space-y-0 md:flex">
        <select
          className="bg-black border border-[var(--cosevent-yellow)] text-white px-2 py-1 rounded"
          value={continentFilter}
          onChange={(e) => {
            setContinentFilter(e.target.value);
            setCountryFilter('Alle');
            setCityFilter('Alle');
          }}
        >
          {continents.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select
          className="bg-black border border-[var(--cosevent-yellow)] text-white px-2 py-1 rounded"
          value={countryFilter}
          onChange={(e) => {
            setCountryFilter(e.target.value);
            setCityFilter('Alle');
          }}
        >
          {countries.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select
          className="bg-black border border-[var(--cosevent-yellow)] text-white px-2 py-1 rounded"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-[var(--cosevent-white)] pl-6 space-y-10">
        {filteredEvents.length === 0 ? (
          <p className="text-white/60">Ingen eventer funnet for valgt filter.</p>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="relative group">
              <span className="absolute -left-3 top-1 w-4 h-4 bg-white rounded-full border-2 border-[var(--cosevent-white)] shadow-md"></span>
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
