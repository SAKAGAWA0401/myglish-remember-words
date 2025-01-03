const admin = require("firebase-admin");
const db = require("../db/firebase");

exports.verifyUser = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Check if user is approved
    const userDoc = await db.collection("approved_users").doc(uid).get();
    if (userDoc.exists) {
      res.status(200).json({ approved: true });
    } else {
      res.status(403).json({ approved: false });
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ error: "Token verification failed" });
  }
};

exports.approveUser = async (req, res) => {
  const { uid, email } = req.body;

  try {
    await db.collection("approved_users").doc(uid).set({ email, approvedAt: new Date().toISOString() });
    res.status(200).json({ message: "User approved" });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ error: "Failed to approve user" });
  }
};

exports.denyUser = async (req, res) => {
  const { uid } = req.body;

  try {
    await db.collection("approval_requests").doc(uid).delete();
    res.status(200).json({ message: "User denied" });
  } catch (error) {
    console.error("Error denying user:", error);
    res.status(500).json({ error: "Failed to deny user" });
  }
};
