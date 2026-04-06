import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const isEmulator =
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    process.env.FIRESTORE_EMULATOR_HOST;

  if (isEmulator) {
    // Emulator mode — no real credentials needed for demo project
    admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "demo-jude-nii" });
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    } catch (error) {
      console.error("Firebase admin initialization error", error);
    }
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
