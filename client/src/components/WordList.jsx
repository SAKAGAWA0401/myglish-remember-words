import { useEffect, useState } from "react";
import { fetchWordsFromServer } from "@/services/apiService";
import { useWordList } from "@/hooks/useWordList";
import WordItem from "./WordItem";

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

  if (loading) return <p>Loading words...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Word List</h2>
      {Array.isArray(words) && words.length > 0 ? (
        words.map((word) => <WordItem key={word.id} word={word} />)
      ) : (
        <p>No words found.</p>
      )}
    </div>
  );
}
