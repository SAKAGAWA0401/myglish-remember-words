import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import PropTypes from 'prop-types';

export default function WordItem({ word }) {
  const { english, japanese, pronunciation, audioEnglish, audioJapanese } = word;

  // 音声再生関数
  const playAudio = (audioBase64) => {
    const audioBlob = base64ToBlob(audioBase64);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  // Base64 を Blob に変換する関数
  const base64ToBlob = (base64) => {
    const binary = atob(base64);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "audio/mp3" });
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
          <Button onClick={() => playAudio(audioEnglish)} variant="outline">Play English</Button>
          <Button onClick={() => playAudio(audioJapanese)} variant="outline">Play Japanese</Button>
        </div>
      </CardContent>
    </Card>
  );
}
