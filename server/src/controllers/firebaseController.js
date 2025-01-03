const { db } = require("../db/firebase");

// firebaseController.js内のsaveToFirebase関数
exports.saveToFirebase = async ({ userId, english, japanese, audioEnglish, audioJapanese, pronunciation }) => {
  const wordRef = db.collection("users").doc(userId).collection("words").doc();
  const id = wordRef.id;
  const data = {
    id,
    english,
    japanese,
    audioEnglish,
    audioJapanese,
    pronunciation,
    createdAt: new Date().toISOString(),
  };

  await wordRef.set(data); // Firestoreにデータを保存
  return { id, ...data }; // 保存したデータを返す
};
