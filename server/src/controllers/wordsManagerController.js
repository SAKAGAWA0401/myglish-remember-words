const { generateAudio } = require("./googleTTSController");
const { generateIPA } = require("./openAIController");
const { saveToFirebase } = require("./firebaseController");
const { admin, db } = require("../db/firebase"); // Firebase Admin SDK の初期化済みインスタンスをインポート
// const fs = require("fs");

exports.wordsProcessAndSave = async (req, res) => {
  const { english, japanese } = req.body;

  // リクエストデータのバリデーション
  if (!english || !japanese) {
    return res.status(400).json({ error: "English and Japanese fields are required." });
  }

  try {
    // Step 0: Firebase Auth トークンからユーザ ID を取得
    // Authorization ヘッダーからトークンを取得
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // "Bearer <idToken>" の形式からトークン部分を切り出し
    const idToken = authHeader.split(" ")[1];

    // Firebase Authentication でトークンを検証
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const wordsSnapshot = await db.collection("users").doc(userId).collection("words").get();
    const registeredCount = wordsSnapshot.size;

    if (userId === process.env.FIREBASE_ADMIN_UID) {
      console.log("Admin user - no limit.");
    } else if (registeredCount >= 5) {
      return res.status(403).json({ error: "Word limit reached. Upgrade your account to add more words." });
    }    

    // Step 1: Google TTS APIで音声データを生成
    const audioEnglish = await generateAudio({ text: english, lang: "en-US" });
    const audioJapanese = await generateAudio({ text: japanese, lang: "ja-JP" });

    // 音声データをファイルに保存
    // fs.writeFileSync("audioEnglish.mp3", Buffer.from(audioEnglish, "base64"));
    // fs.writeFileSync("audioJapanese.mp3", Buffer.from(audioJapanese, "base64"));

    // Step 2: OpenAI APIで発音記号を生成
    const ipaPronunciation = await generateIPA({ text: english });

    // Step 3: Firebaseに保存
    const saveResult = await saveToFirebase({
      userId,
      english,
      japanese,
      audioEnglish,
      audioJapanese,
      pronunciation: ipaPronunciation,
    });

    // 成功レスポンスを返す
    res.status(201).json({
      message: "Word saved successfully!",
      saveResult,
    });
  } catch (error) {
    console.error("Error in processAndSaveWord:", error);
    res.status(500).json({ error: "Failed to process and save word." });
  }
};
