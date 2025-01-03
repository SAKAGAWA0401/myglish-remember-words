const admin = require("firebase-admin");
const path = require("path");
const serviceAccountKeyFile = path.resolve(process.env.FIREBASE_KEY_FILE);

if (!serviceAccountKeyFile) {
  throw new Error("FIREBASE_KEY_FILE is not defined in environment variables");
}
const serviceAccount = require(serviceAccountKeyFile);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { admin, db };
