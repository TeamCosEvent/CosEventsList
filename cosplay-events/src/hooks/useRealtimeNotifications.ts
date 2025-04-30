import { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

type NotificationItem = {
  id: string;
  type: "newsletter" | "commission" | "collaboration" | "form" | "event";
  name?: string;
  email?: string;
  title?: string;
  location?: string;
  timestamp?: Timestamp;
};

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const oneWeekAgo = Timestamp.fromDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const newsletterQuery = query(
      collection(db, "newsletterSubscribers"),
      where("timestamp", ">=", oneWeekAgo),
      orderBy("timestamp", "desc")
    );

    const formsQuery = query(
      collection(db, "forms"),
      where("timestamp", ">=", oneWeekAgo),
      orderBy("timestamp", "desc")
    );

    const newEventsQuery = query(
      collection(db, "conventions"),
      where("isNew", "==", true),
      orderBy("createdAt", "desc")
    );

    let newsletterData: NotificationItem[] = [];
    let formsData: NotificationItem[] = [];
    let eventsData: NotificationItem[] = [];

    const updateCombined = () => {
      const combined = [...newsletterData, ...formsData, ...eventsData];
      combined.sort((a, b) => {
        const timeA = a.timestamp?.toMillis?.() ?? 0;
        const timeB = b.timestamp?.toMillis?.() ?? 0;
        return timeB - timeA;
      });
      setNotifications(combined);
    };

    const unsubNewsletter = onSnapshot(newsletterQuery, (snapshot) => {
      newsletterData = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          type: "newsletter",
          id: doc.id,
          email: data.email,
          timestamp: data.timestamp,
        };
      });
      updateCombined();
    });

    const unsubForms = onSnapshot(formsQuery, (snapshot) => {
      formsData = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          type: data.type || "form",
          id: doc.id,
          name: data.name,
          email: data.email,
          timestamp: data.timestamp,
        };
      });
      updateCombined();
    });

    const unsubEvents = onSnapshot(newEventsQuery, (snapshot) => {
      eventsData = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          type: "event",
          id: doc.id,
          title: data.title,
          location: data.location,
          timestamp: data.createdAt,
        };
      });
      updateCombined();
    });

    return () => {
      unsubNewsletter();
      unsubForms();
      unsubEvents();
    };
  }, []);

  return notifications;
};
