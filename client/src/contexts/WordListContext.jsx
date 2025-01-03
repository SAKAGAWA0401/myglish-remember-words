import { createContext, useState } from "react";
import PropTypes from 'prop-types';

// Contextの作成
const WordListContext = createContext();

// Contextを提供するProviderコンポーネント
export function WordListProvider({ children }) {
  const [words, setWords] = useState([]); // 単語リストを管理するstate

  WordListProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <WordListContext.Provider value={{ words, setWords }}>
      {children}
    </WordListContext.Provider>
  );
}

export default WordListContext;
