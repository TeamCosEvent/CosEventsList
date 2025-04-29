import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { db } from '../../../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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

    console.log('📦 EVENTS:', events);

    for (const event of events) {
      await setDoc(doc(db, 'conventions', event.id), event);
    }

    await browser.close();

    return NextResponse.json({ message: 'Crawler kjørt og data lagret', events });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('❌ Crawler-feil:', err.stack || err.message);
    return NextResponse.json(
      {
        message: 'Feil under crawling',
        error: err.message,
      },
      { status: 500 }
    );
  }
}
