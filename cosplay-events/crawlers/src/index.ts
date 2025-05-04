import * as functions from 'firebase-functions/v1';  // Bruk v1 i stedet for v2
import * as admin from 'firebase-admin';
import { crawlMagiconEvents } from './magiconCrawler';

admin.initializeApp();

// Bruk riktig syntaks for å definere tidsplanen i v1
export const magicon = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const count = await crawlMagiconEvents();
  console.log(`Crawled ${count} Magicon events`);
  return null;
});
