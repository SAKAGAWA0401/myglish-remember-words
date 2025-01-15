import { useEffect, useState } from "react";
import { fetchWordsFromServer } from "@/services/apiService";
import { useWordList } from "@/hooks/useWordList";
import WordItem from "./WordItem";
import { Button } from "./ui/button";

/**
 * WordList コンポーネント
 * サーバーからデータを取得し、単語リストを表示
 */
export default function WordList() {
  const { words, setWords } = useWordList();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await fetchWordsFromServer();
          setWords(data);
          setLoading(false);
      } catch (err) {
        console.error("Error fetching words:", err);
        setError("Failed to load words. Please try again.");
        setLoading(false);
      }
    };
    fetchWords();
   }, [setWords]);

  // 連続再生機能
  const playAllAudioAlternating = () => {
    let index = 0;
    let isEnglish = true; // 英語と日本語を交互に再生するフラグ
  
    const playNext = () => {
      if (index < words.length) {
        const audioBase64 = isEnglish
          ? words[index].audioEnglish
          : words[index].audioJapanese;
        const audioBlob = base64ToBlob(audioBase64);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
  
        audio.onended = () => {
          if (isEnglish) {
            isEnglish = false; // 次は日本語を再生
          } else {
            isEnglish = true;  // 次の単語の英語を再生
            index++;           // 次の単語に進む
          }
          playNext();
        };
  
        audio.play();
      }
    };
  
    playNext();
  };

  const base64ToBlob = (base64) => {
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "audio/mp3" });
  };

  if (loading) return <p>Loading words...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 max-w-md space-y-4">
      <h2 className="text-xl font-semibold">
        Word List
      </h2>
      <Button onClick={playAllAudioAlternating} variant="destructive" className="mt-4">
        Play All
      </Button>
      {Array.isArray(words) && words.length > 0 ? (
        words.map((word) => <WordItem key={word.id} word={word} />)
      ) : (
        <p>No words found.</p>
      )}
    </div>
  );
}
