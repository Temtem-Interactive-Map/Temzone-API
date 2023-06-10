import { config } from "dotenv";
import admin from "firebase-admin";

config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

const messaging = admin.messaging(admin.app());

export async function sendMessage(message) {
  await messaging.send({
    topic: "general",
    notification: {
      title: message.title,
      body: message.body,
    },
    data: {
      id: message.id,
    },
  });
}
