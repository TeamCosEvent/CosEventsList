import puppeteer from 'puppeteer';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export async function crawlMagiconEvents() {
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto('https://www.magicon.no/community/', { waitUntil: 'networkidle2' });
  await page.waitForSelector('li.av-milestone', { timeout: 5000 });

  const events = await page.evaluate(() => {
    const eventList = Array.from(document.querySelectorAll("li.av-milestone")) as HTMLElement[];

    return eventList.map((event) => {
      const el = event as HTMLElement;

      const h2 = el.querySelector("h2.av-milestone-date");
      const h4 = el.querySelector("h4.av-milestone-title");
      const titleTag = h2 || h4;

      const linkTag = titleTag?.querySelector("a");
      const title = titleTag?.textContent?.trim() || "Unknown Event";
      const link = linkTag?.getAttribute("href") || "No Link";
      const date = linkTag?.getAttribute("title") || "Unknown Date";

      const contentDiv = el.querySelector("div.av-milestone-content");
      const location = contentDiv?.querySelector("p")?.textContent?.trim() || "Unknown Location";

      return {
        id: title.replace(/\s+/g, "-").toLowerCase(),
        title,
        date,
        location,
        link,
        source: "magicon",
        isNew: true,
        isVisible: true,
      };
    });
  });

  for (const event of events) {
    const ref = db.collection('conventions').doc(event.id);
    const doc = await ref.get();

    if (!doc.exists) {
      await ref.set({
        ...event,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await ref.set({
        ...event,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }
  }

  await browser.close();
  return events.length;
}
