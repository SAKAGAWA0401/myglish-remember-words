import WordForm from "@/components/WordForm";
import WordList from "@/components/WordList";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import Header from "@/components/layout/Header";
import { Separator } from "@radix-ui/react-separator";

export default function Home() {
  const [user] = useAuthState(auth);

  return (
    <div>
      <Header />
      <main>
        {user ? (
          <>
            <WordForm />
            <Separator />
            <WordList />
          </>
        ) : (
          <WordList />
        )}
      </main>
    </div>
  );
}
