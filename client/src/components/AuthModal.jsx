import { useState } from "react";
import { signInWithGoogle, signInWithEmail, registerWithEmail } from "@/services/authService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import PropTypes from "prop-types";

export default function AuthModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleEmailSubmit = async () => {
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (error) {
      console.error("Email authentication error:", error);
    }
  };

  AuthModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isRegister ? "Register" : "Sign In"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleGoogleSignIn}
          >
            {isRegister ? "Register with Google" : "Sign in with Google"}
          </button>
          <div className="flex flex-col space-y-2">
        <input
          type="email"
          placeholder="Email"
              className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
              className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleEmailSubmit}
          >
            {isRegister ? "Register with Email" : "Sign in with Email"}
      </button>
    </div>
        <DialogFooter>
          <button
            className="text-sm text-gray-500 hover:underline"
            onClick={() => setIsRegister((prev) => !prev)}
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
