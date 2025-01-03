const express = require("express");
const router = express.Router();
const db = require("../db/firebase");

// ドキュメントサイズを取得するエンドポイント
router.get("/docsize/:collection/:docId", async (req, res) => {
  const { collection, docId } = req.params;

  try {
    const docRef = db.collection(collection).doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Document not found" });
    }

    const data = doc.data();
    const jsonData = JSON.stringify(data);
    const sizeInBytes = Buffer.byteLength(jsonData, "utf8");

    res.json({ docId, sizeInBytes });
  } catch (error) {
    console.error("Error calculating document size:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
