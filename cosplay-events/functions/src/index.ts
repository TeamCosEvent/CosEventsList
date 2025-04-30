import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { crawlMagiconEvents } from './crawlers/magiconCrawler';

admin.initializeApp();

// Manuell trigger fra admin
export const runCrawlers = functions.https.onCall(async () => {
  const count = await crawlMagiconEvents();
  return { message: `Fant ${count} nye events.` };
});

// Automatisk cron-kjøring
export const scheduledCrawlers = functions.pubsub
  .schedule('every 12 hours')
  .onRun(async () => {
    return await crawlMagiconEvents();
  });
