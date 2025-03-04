import React, { useState, useEffect } from "react";
import Confetti from "react-confetti"; // 🎉 Import react-confetti

const Hangman = () => {
    const words = [
        "assassin", "rhythm", "antibacterial", "phenomenon",
        "separate", "accommodate", "aisle",
        "ceiling", "kaleidoscope", "handle", 
        "orangutan", "friendship", "autumn", 
        "zero", "vegetable", "successful", 
        "substance", "remember", "machine"
    ];
    
    const [word, setWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const maxWrongGuesses = 7;
    
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const selectNewWord = () => {
        const chosenWord = words[Math.floor(Math.random() * words.length)];
        setWord(chosenWord);

        const randomLetters = [];
        while (randomLetters.length < 2) {
            const randomLetter = chosenWord[Math.floor(Math.random() * chosenWord.length)];
            if (!randomLetters.includes(randomLetter)) {
                randomLetters.push(randomLetter);
            }
        }

        setGuessedLetters(randomLetters);
    };

    useEffect(() => {
        selectNewWord();
    }, []);

    const handleGuess = (letter) => {
        if (gameOver || guessedLetters.includes(letter)) return;

        setGuessedLetters((prev) => [...prev, letter]);

        if (!word.includes(letter)) {
            setWrongGuesses((prev) => prev + 1);
        }
    };

    useEffect(() => {
        if (wrongGuesses >= maxWrongGuesses) {
            setGameOver(true);
        }

        if (word && word.split("").every((letter) => guessedLetters.includes(letter))) {
            setWin(true);
            setGameOver(true);
        }
    }, [guessedLetters, wrongGuesses, word]);

    const restartGame = () => {
        setWrongGuesses(0);
        setGameOver(false);
        setWin(false);
        selectNewWord();
    };

    const hangmanStages = [
        ` 
         ------
         |    |
              |
              |
              |
              |
        =========
        `,
        ` 
         ------
         |    |
         O    |
              |
              |
              |
        =========
        `,
        ` 
         ------
         |    |
         O    |
         |    |
              |
              |
        =========
        `,
        ` 
         ------
         |    |
         O    |
        /|    |
              |
              |
        =========
        `,
        ` 
         ------
         |    |
         O    |
        /|\\  |
              |
              |
        =========
        `,
        ` 
         ------
         |    |
         O    |
        /|\\  |
        /     |
              |
        =========
        `,
        ` 
         ------
         |    |
         O    |
        /|\\  |
        / \\  |
              |
        =========
        `,
    ];

    const styles = {
        outerContainer: {
            background: "linear-gradient(to right, #0a0a1a, #14142b, #1e1e3f)",
            minHeight: "100vh", // Full page height
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
        },
        container: {
            width: "750px",
            padding: "20px",
            border: "3px solid #333",
            borderRadius: "10px",
            textAlign: "center",
            background: "linear-gradient(to bottom, #000000, #1a1a1a, #333333)",
            color: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            position: "relative",
            zIndex: 2,
        },
        word: {
            fontSize: "24px",
            margin: "20px",
        },
        hangman: {
            whiteSpace: "pre-line",
            fontFamily: "monospace",
            fontSize: "16px",
            lineHeight: "1.2",
            marginBottom: "20px",
        },
        alphabet: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "10px",
        },
        button: {
            margin: "5px",
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            border: "none",
            backgroundColor: "purple",
            color: "white",
            borderRadius: "5px",
        },
        buttonDisabled: {
            backgroundColor: "lightgray",
            cursor: "not-allowed",
        },
        status: {
            fontSize: "18px",
            margin: "20px",
        },
    };

    return (
        
        <div style={styles.outerContainer}>
            
            <div style={{
            position: "absolute",
            top: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
        }}>
            <a href="/gameindex" className="btn btn-dark" style={{
                padding: "10px 20px",
                display: "inline-block",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)"
            }}>
                BACK TO GAME CORNER
            </a>
        </div>
            {/* 🎉 Full-Screen Confetti when the player wins */}
            {win && <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={200} gravity={0.2} />}
            
            <div style={styles.container}>
            
                <h1>Hangman Game</h1>
                <h2>{gameOver ? (win ? "🎉 You Won! 🎉" : "Game Over!") : "Guess the word!"}</h2>

                {/* Hangman Drawing */}
                <pre style={styles.hangman}>{hangmanStages[wrongGuesses]}</pre>

                {/* Word Display */}
                <div style={styles.word}>
                    {word.split("").map((letter, index) => 
                        guessedLetters.includes(letter) ? (
                            <span key={index}>{letter} </span>
                        ) : (
                            <span key={index}>_ </span>
                        )
                    )}
                </div>

                {!gameOver && (
                    <div style={styles.alphabet}>
                        {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
                            <button
                                key={letter}
                                onClick={() => handleGuess(letter)}
                                style={{
                                    ...styles.button,
                                    ...(guessedLetters.includes(letter) || gameOver ? styles.buttonDisabled : {}),
                                }}
                                disabled={guessedLetters.includes(letter) || gameOver}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                )}
                
                <div style={styles.status}>
                    <p>Wrong guesses: {wrongGuesses}/{maxWrongGuesses}</p>
                </div>

                {gameOver && !win && (
                    <p style={{ color: "red", fontSize: "20px" }}>The correct word was: <strong>{word}</strong></p>
                )}

                {gameOver && (
                    <div>
                        <button onClick={restartGame} style={styles.button}>Restart Game</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hangman;
