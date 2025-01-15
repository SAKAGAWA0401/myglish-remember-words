import { useState, useEffect } from "react";
import { auth } from "@/services/firebase";
import { signout } from "@/services/authService";
import AuthModal from "@/components/AuthModal";
import { Button } from "./ui/button";

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
    <div className="flex items-center gap-2">
      {user ? (
        <div>
          <span>{user.email}</span>
          <Button
            onClick={handleLogout}
            className="px-4 py-2 ml-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Logout
          </Button>
        </div>
      ) : (
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Login
          </Button>
      )}
      <AuthModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
