import puppeteer from 'puppeteer';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { firebaseConfig } from '../firebase/firebaseConfig';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.magicon.no/community/', { waitUntil: 'networkidle2' });

  await page.waitForSelector('li.av-milestone', { timeout: 5000 });

  const events = await page.evaluate(() => {
    const eventList = Array.from(document.querySelectorAll("li.av-milestone"));

    return eventList.map((event) => {
      const h2 = event.querySelector("h2.av-milestone-date");
      const h4 = event.querySelector("h4.av-milestone-title");
      const titleTag = h2 || h4;

      const linkTag = titleTag?.querySelector("a");
      const title = titleTag?.textContent?.trim() || "Unknown Event";
      const link = linkTag?.getAttribute("href") || "No Link";
      const date = linkTag?.getAttribute("title") || "Unknown Date";

      const contentDiv = event.querySelector("div.av-milestone-content");
      const location = contentDiv?.querySelector("p")?.textContent?.trim() || "Unknown Location";

      return {
        id: title.replace(/\s+/g, "-").toLowerCase(),
        title,
        date,
        location,
        link,
      };
    });
  });

  console.log('📦 Events funnet:', events.length);

  for (const event of events) {
    await setDoc(doc(db, 'conventions', event.id), event);
  }

  console.log('✅ Crawler fullført og data lagret.');
  await browser.close();
})();
