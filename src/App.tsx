/* eslint-disable react-hooks/exhaustive-deps */

import words from "./words.json";
import { useState, useEffect, useCallback } from "react";
import HangmanDrawing from "./components/HangmanDrawing";
import HangmanWord from "./components/HangmanWord";
import Keyboard from "./components/Keyboard";

function App() {
  const getWord = ()=> words[Math.floor(Math.random() * words.length)]

  const [word, setWord] = useState(getWord);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !word.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = word
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetters = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;
      setGuessedLetters((currentGuessedLetters) => [
        ...currentGuessedLetters,
        letter,
      ]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "Enter") return;
      e.preventDefault();
      setGuessedLetters([])
      setWord(getWord())
      
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;
      e.preventDefault();
      addGuessedLetters(key);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);
  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        margin: "0 auto",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
      {isLoser && "Nice try! Refresh to try again!"}
        {isWinner && "Winner! Refresh to try again!"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord word={word} guessedLetters={guessedLetters} reveal = {isLoser}/>
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          addGuessedLetters={addGuessedLetters}
          disabled={isLoser || isWinner}
          activeLetters={guessedLetters.filter((letter) =>
            word.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
        />
      </div>
    </div>
  );
}

export default App;
