import { onRequest } from "firebase-functions/v2/https";
import { crawlMagiconEvents } from "./crawlers/magiconCrawler";

export const magiconCrawl = onRequest(async (req, res) => {
  try {
    const addedCount = await crawlMagiconEvents();
    res.status(200).send(`Crawler ferdig. ${addedCount} nye events lagt til.`);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Crawler-feil:", err.stack || err.message);
    res.status(500).send(`Feil under crawling: ${err.message}`);
  }
});
