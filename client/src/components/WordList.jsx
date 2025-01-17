import { useEffect, useState, useRef } from "react";
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
  const [isPlaying, setIsPlaying] = useState(false); // 再生中かどうかを管理
  const audioRef = useRef(null); // Audioオブジェクトの参照

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await fetchWordsFromServer();
        // ソートしてからセット
        const sortedData = data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setWords(sortedData);
          setLoading(false);
      } catch (err) {
        console.error("Error fetching words:", err);
        setError("Failed to load words. Please try again.");
        setLoading(false);
      }
    };
    fetchWords();
   }, [setWords]);

  const base64ToBlob = (base64) => {
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: "audio/mp3" });
  };

  const playAllAudioAlternating = () => {
    if (isPlaying) return; // 多重クリックを防止
    setIsPlaying(true);

    let index = 0;
    let isEnglish = true; // 英語と日本語を交互に再生するフラグ
  
    const playNext = async () => {
      if (index >= words.length) {
        setIsPlaying(false); // 再生終了
        return;
      }

      try {
        const audioBase64 = isEnglish
          ? words[index].audioEnglish
          : words[index].audioJapanese;
        const audioBlob = base64ToBlob(audioBase64);
        const audioUrl = URL.createObjectURL(audioBlob);

        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        audioRef.current.src = audioUrl;
        audioRef.current.play();
  
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl); // リソースの解放
          if (isEnglish) {
            isEnglish = false; // 次は日本語
          } else {
            isEnglish = true;
            index++; // 次の単語へ
          }
          playNext(); // 次を再生
        };
      } catch (err) {
        console.error("Error playing audio:", err);
        setIsPlaying(false);
      }
    };

    playNext();
  };

  if (loading) return <p>Loading words...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Word List</h2>
      <Button
        onClick={playAllAudioAlternating}
        disabled={isPlaying} // 再生中はボタンを無効化
        variant="destructive"
        className="mt-4"
      >
        {isPlaying ? "Playing..." : "Play All"}
      </Button>
      {words.length > 0 ? (
        words.map((word) => <WordItem key={word.id} word={word} />)
      ) : (
        <p>No words found.</p>
      )}
    </div>
  );
}
