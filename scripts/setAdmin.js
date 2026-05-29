/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" });
const admin = require("firebase-admin");

// Initialize Firebase Admin with production credentials
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
    process.exit(1);
  }
}

async function setAdminRole(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: "SUPER_ADMIN" });
    console.log(`Successfully elevated ${email} to SUPER_ADMIN.`);
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`Error: No user found with the email ${email}. They must log in or sign up first.`);
    } else {
      console.error("Error setting custom claims:", error);
    }
    process.exit(1);
  }
}

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.log("Usage: node scripts/setAdmin.js <user-email>");
  process.exit(1);
}

setAdminRole(targetEmail);
