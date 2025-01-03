const axios = require("axios");

exports.generateAudio = async ({ text, lang }) => {
  if (!text || !lang) {
    throw new Error("Both 'text' and 'lang' fields are required.");
  }

  let voiceConfig;
  let audioConfig = { audioEncoding: "MP3" };
  // 言語に応じた音声設定
  if (lang === "en-US") {
    voiceConfig = {
      languageCode: "en-US",
      name: "en-US-Wavenet-D", // WaveNet男性音声
      ssmlGender: "MALE",
    };
  } else if (lang === "ja-JP") {
    voiceConfig = {
      languageCode: "ja-JP",
      name: "ja-JP-Standard-A",
      ssmlGender: "NEUTRAL",
    };
    audioConfig.speakingRate = 2;
  }

  try {
  const response = await axios.post(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
    {
      input: { text },
      voice: voiceConfig,
      audioConfig: audioConfig,
    }
  );
    // 成功時にBase64エンコードされた音声データを返す
    return response.data.audioContent;
  } catch (error) {
    // エラー時に詳細をログ出力
    console.error("Error in Google TTS API:", error.response?.data || error.message);
    // 特定のエラーに応じた適切なレスポンスをスロー
    if (error.response?.status === 401) {
      throw new Error("Unauthorized: Invalid API key.");
    } else if (error.response?.status === 400) {
      throw new Error("Bad Request: Invalid input data.");
    } else {
      throw new Error("Failed to generate audio using Google TTS API.");
    }
  }
};
