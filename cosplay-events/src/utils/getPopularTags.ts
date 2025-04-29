import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export async function getPopularTags(minCount = 3): Promise<string[]> {
  const snapshot = await getDocs(collection(db, "posts"));
  const tagCount: Record<string, number> = {};

  snapshot.forEach((doc) => {
    const tags: string[] = doc.data().tags || [];
    tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .filter(([, count]) => count >= minCount)
    .map(([tag]) => tag)
    .sort();
}
