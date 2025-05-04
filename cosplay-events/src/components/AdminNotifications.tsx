"use client";
import Link from "next/link";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export default function AdminNotifications() {
  const notifications = useRealtimeNotifications();

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      <h3 className="mb-4 text-lg font-bold">📢 Convention Updates</h3>
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-600">No recent notifications.</p>
      ) : (
        <ul className="space-y-2 overflow-auto max-h-96">
          {notifications.map((note, index) => (
            <li key={`${note.id}-${note.timestamp?.seconds}-${index}`}>
              <Link
                href="/admin/conventionlist"
                className="block p-3 transition rounded hover:bg-gray-100"
              >
                <div
                  className="py-2 pl-3 border-l-4 rounded shadow-sm bg-gray-50"
                  style={{ borderColor: "#f97316" }} // oransje farge
                >
                  <p className="text-sm font-semibold">{note.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(note.timestamp?.toDate?.() ?? Date.now()).toLocaleString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
