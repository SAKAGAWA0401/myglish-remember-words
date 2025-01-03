const admin = require("firebase-admin");
const path = require("path");
let serviceAccount;

if (process.env.FIREBASE_KEY) {
  // デプロイ環境用: 環境変数から直接初期化
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
} else if (process.env.FIREBASE_KEY_FILE) {
  // 開発環境用: JSON ファイルから初期化
  const serviceAccountKeyFile = path.resolve(process.env.FIREBASE_KEY_FILE);
  serviceAccount = require(serviceAccountKeyFile);
} else {
  throw new Error("FIREBASE_KEY or FIREBASE_KEY_FILE must be defined");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { admin, db };
