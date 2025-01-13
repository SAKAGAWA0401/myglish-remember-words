import axios from "axios";
import { auth } from "@/services/firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendWordsToServer = async (english, japanese) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not logged in");
    }
    const idToken = await user.getIdToken();

    const response = await axios.post(
      `${API_BASE_URL}/api/words`, 
      { english, japanese },
      {
        headers: {
          Authorization: `Bearer ${idToken}`, // ヘッダーにidTokenを設定
        }
      }
    );
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error); // サーバー側のエラーメッセージを投げる
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * サーバーから単語リストを取得する
 */
export const fetchWordsFromServer = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      const response = await axios.get(`${API_BASE_URL}/api/words?public=true`);
      console.log("Server response:", response.data); // レスポンスデータを確認
      return response.data; // サーバーから取得した単語リスト
    }
    const idToken = await user.getIdToken();

    const response = await axios.get(`${API_BASE_URL}/api/words`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });    
    console.log("Server response:", response.data); // レスポンスデータを確認
    return response.data; // サーバーから取得した単語リスト
  } catch (error) {
    console.error("Error fetching words from server:", error);
    throw error;
  }
};