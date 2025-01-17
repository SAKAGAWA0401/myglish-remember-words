import { useRef, useState } from "react";
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import PropTypes from 'prop-types';

export default function WordItem({ word }) {
  const { english, japanese, pronunciation, audioEnglish, audioJapanese } = word;

  const audioRef = useRef(null); // 再利用可能なAudioオブジェクト
  const [isPlaying, setIsPlaying] = useState(false); // 再生中かどうかの状態

  // // 音声再生関数
  // const playAudio = (audioBase64) => {
  //   const audioBlob = base64ToBlob(audioBase64);
  //   const audioUrl = URL.createObjectURL(audioBlob);
  //   const audio = new Audio(audioUrl);
  //   audio.play();
  // };

  // Base64 を Blob に変換する関数
  const base64ToBlob = (base64) => {
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: "audio/mp3" });
  };

  // 音声再生関数
  const playAudio = async (audioBase64) => {
    if (isPlaying) return; // 再生中の多重クリックを防止
    setIsPlaying(true);

    try {
      const audioBlob = base64ToBlob(audioBase64);
      const audioUrl = URL.createObjectURL(audioBlob);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        setIsPlaying(false); // 再生終了後に状態をリセット
        URL.revokeObjectURL(audioUrl); // リソース解放
      };

      audioRef.current.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false); // 再生失敗時も状態をリセット
    }
  };

  WordItem.propTypes = {
    word: PropTypes.shape({
      english: PropTypes.string.isRequired,
      japanese: PropTypes.string.isRequired,
      pronunciation: PropTypes.string.isRequired,
      audioEnglish: PropTypes.string.isRequired,
      audioJapanese: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">{english}</h3>
      </CardHeader>
      <CardContent className="p-4 border rounded-lg shadow-sm max-w-md">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <p>{pronunciation}</p>
            <p>{japanese}</p>
          </div>
        </div>
        <div className="flex space-x-2 items-center mt-4">
          <Button
            onClick={() => playAudio(audioEnglish)}
            disabled={isPlaying}
            variant="outline"
          >
            Play English
          </Button>
          <Button
            onClick={() => playAudio(audioJapanese)}
            disabled={isPlaying}
            variant="outline"
          >
            Play Japanese
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
