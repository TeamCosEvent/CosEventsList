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

// Define a strict NotificationItem type
type NotificationItem = {
  id: string;
  type: "newsletter" | "commission" | "collaboration" | "form";
  name?: string;
  email?: string;
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

    let newsletterData: NotificationItem[] = [];
    let formsData: NotificationItem[] = [];

    const updateCombined = () => {
      const combined = [...newsletterData, ...formsData];
      combined.sort((a, b) => {
        const timeA = a.timestamp?.toMillis?.() ?? 0;
        const timeB = b.timestamp?.toMillis?.() ?? 0;
        return timeB - timeA; // Newest first
      });
      setNotifications(combined);
    };

    const unsubscribeNewsletter = onSnapshot(newsletterQuery, (snapshot) => {
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

    const unsubscribeForms = onSnapshot(formsQuery, (snapshot) => {
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

    return () => {
      unsubscribeNewsletter();
      unsubscribeForms();
    };
  }, []);

  return notifications;
};
