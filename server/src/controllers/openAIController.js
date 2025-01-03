const axios = require("axios");

exports.generateIPA = async ({ text }) => {
  if (!text) {
    throw new Error("'English' field is required.");
  }
  const promptMessage = `
    You are a linguistics assistant that specializes in providing precise IPA 
    (International Phonetic Alphabet) transcriptions of English words and phrases. 
    Do not include any explanations or extra text.
  `.trim();  
  try{
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: promptMessage },
          { role: "user", content: `Provide the American English pronunciation for: "${text}" in IPA format.` }
        ],
        max_tokens: 50,
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content.trim(); // IPA記号を返す
  } catch (error) {
    console.error("Error in OpenAI API call:", error.response?.data || error.message);
    // ステータスコードに応じたエラーを投げる
    if (error.response?.status === 401) {
      throw new Error("Unauthorized: Invalid OpenAI API key.");
    } else if (error.response?.status === 400) {
      throw new Error("Bad Request: Check your input text or API configuration.");
    } else {
      throw new Error("Failed to generate IPA pronunciation.");
    }
  }

};
