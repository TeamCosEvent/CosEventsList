import { useEffect, useState, useRef } from "react";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

type NotificationItem = {
  id: string;
  type: "event";
  title?: string;
  location?: string;
  timestamp?: Timestamp;
  message: string;
};

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const previousStates = useRef<Record<string, boolean>>({});
  const hasInitialized = useRef(false); // 🔑

  useEffect(() => {
    const q = query(collection(db, "conventions"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const newNotifications: NotificationItem[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as DocumentData;
        const id = doc.id;
        const title = data.title ?? "Uten tittel";
        const location = data.location;
        const timestamp = data.createdAt ?? Timestamp.now();
        const isVisible = data.isVisible;

        const previous = previousStates.current[id];

        // Første gang: bare lagre tilstand
        if (!hasInitialized.current) {
          previousStates.current[id] = isVisible;
        } else {
          // Ny convention
          if (previous === undefined) {
            previousStates.current[id] = isVisible;

            newNotifications.push({
              id,
              type: "event",
              title,
              location,
              timestamp,
              message: `Ny convention lagt til: ${title}`,
            });
          }

          // Synlighetsendring
          if (previous !== undefined && previous !== isVisible) {
            previousStates.current[id] = isVisible;

            newNotifications.push({
              id: `${id}-${Date.now()}`,
              type: "event",
              title,
              location,
              timestamp,
              message: isVisible
                ? `Convention gjort synlig: ${title}`
                : `Convention skjult: ${title}`,
            });
          }
        }
      });

      // Marker at init er ferdig etter første kjøring
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        return; // Ikke sett notifikasjoner på init
      }

      if (newNotifications.length > 0) {
        console.log("🔔 Nye notifikasjoner:", newNotifications);
      }

      setNotifications((prev) =>
        [...newNotifications, ...prev].sort(
          (a, b) => (b.timestamp?.toMillis?.() ?? 0) - (a.timestamp?.toMillis?.() ?? 0)
        )
      );
    });

    return () => unsub();
  }, []);

  return notifications;
};
