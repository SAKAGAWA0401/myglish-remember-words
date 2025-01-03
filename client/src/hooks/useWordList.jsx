import { useContext } from "react";
import WordListContext from "@/contexts/WordListContext";

export const useWordList = () => {
  const context = useContext(WordListContext);
  if (!context) {
    throw new Error("useWordList must be used within a WordListProvider");
  }
  return context;
};
