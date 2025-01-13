import WordForm from "@/components/WordForm";
import WordList from "@/components/WordList";
import AuthButton from "@/components/AuthButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <h1>myglish</h1>
      <AuthButton />
      {user ? (
        <>
          <WordForm />
          <WordList />
        </>
      ) : (
        <WordList />
      )}
    </div>
  );
}
