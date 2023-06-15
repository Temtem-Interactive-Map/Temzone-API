import { config } from "dotenv";
import admin from "firebase-admin";
import { t } from "../../locales/index.js";

config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const messaging = admin.messaging(admin.app());

export async function sendMessage(message) {
  await messaging.send({
    topic: "en",
    notification: {
      title: t(message.title),
      body: t(message.body),
    },
    data: {
      id: message.id,
    },
  });
}
