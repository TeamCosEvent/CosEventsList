"use client";
import Link from "next/link";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export default function AdminNotifications() {
  const notifications = useRealtimeNotifications();

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-bold mb-4">📢 New This Week</h3>
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-600">No recent notifications.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-auto">
          {notifications.map((note) => {
            const isNewsletter = note.type === "newsletter";
            const href = isNewsletter
              ? "/admin/subscribers"
              : "/admin/forms";

            return (
              <li key={note.id}>
                <Link href={href} className="block hover:bg-gray-100 rounded p-3 transition">
                  <div
                    className="border-l-4 pl-3 py-2 bg-gray-50 rounded shadow-sm"
                    style={{
                      borderColor: isNewsletter ? "#0ea5e9" : "#22c55e",
                    }}
                  >
                    <p className="text-sm font-semibold">
                      {isNewsletter
                        ? `New subscriber: ${note.email}`
                        : `New ${note.type} from ${note.name}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(note.timestamp?.toDate?.() ?? Date.now()).toLocaleString()}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
