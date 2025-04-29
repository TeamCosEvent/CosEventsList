'use client';
import { useState } from 'react';

export default function ManualCrawler() {
  const [status, setStatus] = useState('');

  const triggerCrawler = async () => {
    setStatus(' Kjører crawler...');
    try {
      const res = await fetch('/api/crawl');
      const json = await res.json();
      setStatus(` ${json.message || 'Crawler ferdig!'}`);
    } catch {
      setStatus(' Feil ved kjøring av crawler.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--cosevent-bg)] text-white px-4 py-16 font-sans">
      <div className="w-full max-w-3xl">
        <h2 className="text-4xl font-bold text-[var(--cosevent-yellow)] mb-6">
          Manuell crawler 
        </h2>

        <p className="mb-8 text-white/80">
          Trykk på knappen under for å manuelt trigge crawleren som henter inn nye conventions fra eksterne nettsider.
        </p>

        <button
          onClick={triggerCrawler}
          className="btn-primary"
        >
           Kjør crawler nå
        </button>

        {status && (
          <p className="mt-6 text-white font-mono bg-black/20 p-4 rounded whitespace-pre-wrap">
            {status}
          </p>
        )}
      </div>
    </main>
  );
}
