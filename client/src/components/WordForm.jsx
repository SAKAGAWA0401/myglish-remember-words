import { useState } from 'react';
import { sendWordsToServer, fetchWordsFromServer } from '@/services/apiService';
import { useWordList } from "@/hooks/useWordList";

export default function WordForm() {
  const [english, setEnglish] = useState('');
  const [japanese, setJapanese] = useState('');
  const { setWords } = useWordList(); // WordListContextからsetWordsを取得

  async function handleSubmit(e) {
    e.preventDefault();
    if (!english.trim() || !japanese.trim()) return;

    // バリデーション: 英語140文字以下かつ英語のみ
    if (english.length > 140 || !/^[a-zA-Z\s]+$/.test(english)) {
      alert("English input must be 140 characters or less and contain only alphabets.");
      return;
    }

    // バリデーション: 日本語140文字以下かつ日本語のみ
    if (japanese.length > 140 || !/^[\u3040-\u30FF\u4E00-\u9FFF]+$/.test(japanese)) {
      alert("Japanese input must be 140 characters or less and contain only Japanese characters.");
      return;
    }

    try {
      await sendWordsToServer(english, japanese);
      const updatedWords = await fetchWordsFromServer(); // サーバーから最新リストを取得
      setWords(updatedWords); // 取得したリストを更新      
    } catch (err) {
      console.error(err);
      alert(err.message); // エラーメッセージを表示
    }
    // フォームをリセット
    setEnglish('');
    setJapanese('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>English:</label>
        <input
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Japanese:</label>
        <input
          type="text"
          value={japanese}
          onChange={(e) => setJapanese(e.target.value)}
          required
        />
      </div>
      <button type="submit">Save Word or Phrase</button>
    </form>
  );
}
