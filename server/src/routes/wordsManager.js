const express = require("express");
const router = express.Router();
const { wordsProcessAndSave } = require("../controllers/wordsManagerController");
const { admin, db } = require("../db/firebase");

// Firestoreに単語を保存
router.post("/words", wordsProcessAndSave);

// Firestoreから単語リストを取得
router.get("/words", async (req, res) => {
    try {
      const { public: isPublic } = req.query; // クエリパラメータを取得

      if (isPublic === "true") {
        // パブリックデータを取得して返す
        const publicWordsSnapshot = await db.collection("words").get();
        const publicWords = publicWordsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return res.json(publicWords); // パブリック単語を返す
      }

      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
      }
  
      const idToken = authHeader.split(" ")[1];
  
      // トークンを検証してユーザーIDを取得
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
  
      // Firestore から単語リストを取得
      const wordsSnapshot = await db.collection("users").doc(userId).collection("words").get();
  
      const words = wordsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(words); // JSON形式でクライアントに返す
    } catch (error) {
      console.error("Error fetching words:", error);
      res.status(500).json({ error: "Failed to fetch words" });
    }
  });
  

module.exports = router;