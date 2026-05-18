const fs = require('fs');
if (fs.existsSync('.env.local')) {
  fs.readFileSync('.env.local', 'utf-8').split('\n').forEach(line => {
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...val] = line.split('=');
      process.env[key.trim()] = val.join('=').trim().replace(/^"|"$/g, '');
    }
  });
}

const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

async function setup() {
  const email = "admin.live@edu.gh";
  const password = "password123";

  try {
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
      console.log("User already exists, resetting password...");
      await admin.auth().updateUser(user.uid, { password });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        user = await admin.auth().createUser({ email, password });
      } else {
        throw err;
      }
    }

    await admin.auth().setCustomUserClaims(user.uid, { role: "SUPER_ADMIN" });
    console.log("Live test admin created: admin.live@edu.gh / password123");
    process.exit(0);
  } catch (error) {
    console.error("Failed to create live admin:", error);
    process.exit(1);
  }
}

setup();
