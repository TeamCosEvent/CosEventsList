'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import EventTimeline, { Event } from '@/components/EventTimeline';

// Parser for dato (brukes til sortering)
function parseDate(dateStr: string): number {
  if (!dateStr) return Infinity;
  if (dateStr.toLowerCase().includes('tba') || dateStr.toLowerCase().includes('ukjent')) {
    return Infinity;
  }

  const parts = dateStr.match(/(\d{1,2})(?:[-–]\d{1,2})?\s+([A-Za-z]+)\s+(\d{4})/);
  if (!parts) return Infinity;

  const [, day, month, year] = parts;
  return new Date(`${month} ${day}, ${year}`).getTime();
}

export default function ConventionsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchConventions() {
      try {
        const snapshot = await getDocs(collection(db, 'conventions'));
        const docs = snapshot.docs.map(doc => doc.data() as Event);
        const sorted = docs.sort((a, b) => parseDate(a.date) - parseDate(b.date));
        setEvents(sorted);
      } catch (err) {
        console.error("Kunne ikke hente eventer:", err);
        setError("Kunne ikke hente eventer");
      }
    }

    fetchConventions();
  }, []);

  return (
    <main className="flex flex-col items-center px-4 md:px-16 py-16 bg-[var(--cosevent-bg)] text-[var(--cosevent-text-light)] font-sans">
      <div className="w-full max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--cosevent-white)] mb-4">
          Kommende cosplay conventions
        </h2>

        <h3 className="mb-8 text-lg text-[var(--cosevent-text-muted)]">
          Her finner du en oversikt over planlagte conventions i Norge og Norden. Listen oppdateres automatisk. Klikk på lenkene for mer info.
        </h3>

        {error && (
          <p className="mb-4 text-red-400">{error}</p>
        )}

        {events.length > 0 ? (
          <div className="space-y-6">
            <EventTimeline events={events} />
          </div>
        ) : !error ? (
          <p className="text-[var(--cosevent-text-muted)]">Ingen conventions funnet.</p>
        ) : null}
      </div>
    </main>
  );
}
