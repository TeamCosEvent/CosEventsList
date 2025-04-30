'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { getFunctions, httpsCallable } from 'firebase/functions'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [crawlerStatus, setCrawlerStatus] = useState('idle')

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'conventions'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setEvents(data)
    })
    return () => unsubscribe()
  }, [])

  const toggleVisibility = async (eventId: string, current: boolean) => {
    await updateDoc(doc(db, 'conventions', eventId), {
      isVisible: !current,
      isNew: false,
    })
  }

  const deleteEvent = async (eventId: string) => {
    await deleteDoc(doc(db, 'conventions', eventId))
  }

  const runCrawlers = async () => {
    setCrawlerStatus('running')
    try {
      const functions = getFunctions()
      const run = httpsCallable(functions, 'runCrawlers')
      const result = await run()
      console.log(result.data)
      setCrawlerStatus('success')
    } catch (error) {
      console.error('Feil ved crawler:', error)
      setCrawlerStatus('error')
    } finally {
      setTimeout(() => setCrawlerStatus('idle'), 3000)
    }
  }

  return (
    <main className="max-w-6xl p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">🗂 Admin - Eventoversikt</h1>

      <button
        onClick={runCrawlers}
        className="px-4 py-2 mb-6 text-white bg-blue-600 rounded hover:bg-blue-700"
        disabled={crawlerStatus === 'running'}
      >
        {crawlerStatus === 'running' ? 'Crawler kjører...' : 'Kjør crawler manuelt'}
      </button>

      <table className="w-full text-sm border">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-2">Tittel</th>
            <th className="p-2">Dato</th>
            <th className="p-2">Sted</th>
            <th className="p-2">Synlig</th>
            <th className="p-2">Ny</th>
            <th className="p-2">Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t">
              <td className="p-2">{event.title}</td>
              <td className="p-2">{event.date}</td>
              <td className="p-2">{event.location}</td>
              <td className="p-2">{event.isVisible ? '✅' : '❌'}</td>
              <td className="p-2">{event.isNew ? '🆕' : ''}</td>
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
  )
}
