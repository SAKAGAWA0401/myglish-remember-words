require("dotenv").config();

const express = require("express");
const cors = require("cors");

const wordsMangerRoutes = require("./routes/wordsManager");

const app = express();

// ミドルウェア設定
app.use(cors()); // CORSを許可
app.use(express.json()); // JSONをパース

// ルート設定
// indexからのルーティングは/apiに統一したルート管理とする
app.use("/api", wordsMangerRoutes);

const toolsRoutes = require("./routes/tools");
app.use("/api/tools", toolsRoutes);


// サーバーの起動
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
