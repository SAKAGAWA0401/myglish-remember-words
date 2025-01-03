/**
 * WordItem コンポーネント
 * 各単語データを受け取り表示および音声再生機能を提供
 */
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
    <div className="card">
      <div className="card-header">
        <h3>{english}</h3>
        <p>{pronunciation}</p>
      </div>
      <div className="card-body">
        <p>{japanese}</p>
        <div className="buttons">
          <button onClick={() => playAudio(audioEnglish)}>Play English</button>
          <button onClick={() => playAudio(audioJapanese)}>Play Japanese</button>
        </div>
      </div>
    </div>
  );
}
