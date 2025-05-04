'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '@/firebase/firebaseConfig';
import AdminNavbar from '@/components/AdminNavbar';

type ConventionEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  link?: string;
  source?: string;
  isVisible?: boolean;
  isNew?: boolean;
  createdAt?: Timestamp;
};

export default function ConventionListPage() {
  const [events, setEvents] = useState<ConventionEvent[]>([]);
  const [search, setSearch] = useState('');
  const [crawlerStatus, setCrawlerStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  useEffect(() => {
    const q = collection(db, 'conventions');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ConventionEvent[];
      setEvents(data);
    });
    return () => unsubscribe();
  }, []);

  const toggleVisibility = async (id: string, current: boolean | undefined) => {
    await updateDoc(doc(db, 'conventions', id), {
      isVisible: !current,
      isNew: false,
    });
  };

  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, 'conventions', id));
  };

  const triggerCrawler = async () => {
    setCrawlerStatus('running');
    try {
      const functions = getFunctions();
      const run = httpsCallable(functions, 'runCrawlers');
      const result = await run();
      console.log(result.data);
      setCrawlerStatus('success');
    } catch (error) {
      console.error('Feil ved crawler:', error);
      setCrawlerStatus('error');
    } finally {
      setTimeout(() => setCrawlerStatus('idle'), 3000);
    }
  };

  const filtered = events.filter((event) => {
    const term = search.toLowerCase();
    return (
      event.title?.toLowerCase().includes(term) ||
      event.location?.toLowerCase().includes(term) ||
      event.source?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <AdminNavbar />
      <main className="max-w-6xl px-6 pb-12 mx-auto pt-28">
        <h1 className="text-2xl font-bold mb-4 text-[var(--cosevent-yellow)]">
          Alle lagrede events
        </h1>

        <button
          onClick={triggerCrawler}
          className="mb-6 btn-primary"
          disabled={crawlerStatus === 'running'}
        >
          {crawlerStatus === 'running' ? 'Kjører crawler...' : 'Kjør crawler manuelt'}
        </button>

        <input
          type="text"
          placeholder="Søk etter tittel, sted eller kilde..."
          className="w-full px-4 py-2 mb-6 text-white border border-gray-300 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="w-full overflow-hidden text-sm border rounded">
          <thead>
            <tr className="text-left" style={{ backgroundColor: 'var(--cosevent-yellow)' }}>
              <th className="p-2">Tittel</th>
              <th className="p-2">Dato</th>
              <th className="p-2">Sted</th>
              <th className="p-2">Kilde</th>
              <th className="p-2">Synlig</th>
              <th className="p-2">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="p-2">{event.title}</td>
                <td className="p-2">{event.date}</td>
                <td className="p-2">{event.location}</td>
                <td className="p-2">{event.source}</td>
                <td className="p-2">{event.isVisible ? '✅' : '❌'}</td>
                <td className="flex gap-2 p-2">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => toggleVisibility(event.id, event.isVisible)}
                  >
                    {event.isVisible ? 'Skjul' : 'Vis'}
                  </button>
                  <button
                    className="text-red-600 underline"
                    onClick={() => deleteEvent(event.id)}
                  >
                    Slett
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
