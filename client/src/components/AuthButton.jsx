import { useState, useEffect } from "react";
import { auth } from "@/services/firebase";
import { signout } from "@/services/authService";
import AuthModal from "@/components/AuthModal";

export default function AuthButton() {
  const [user, setUser] = useState(null); // 初期値を null に設定
  const [isModalOpen, setModalOpen] = useState(false);

  // 認証状態の変更を監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    // クリーンアップ: コンポーネントがアンマウントされたときにリスナーを解除
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signout();
      setUser(null); // ログアウト後、ユーザを null に設定
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Logged in as: {user.email}</span>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => setModalOpen(true)}
        >
          Login
        </button>
      )}
      <AuthModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
