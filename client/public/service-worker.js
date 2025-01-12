// サービスワーカーのインストールイベント
self.addEventListener("install", () => {
    console.log("Service Worker installed");
    self.skipWaiting(); // 即時にアクティブ化
  });
  
  // サービスワーカーのアクティブ化イベント
  self.addEventListener("activate", () => {
    console.log("Service Worker activated");
  });
  