import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameResult, setGameResult] = useState(null);
  const [shake, setShake] = useState(false);

  const winner = calculateWinner(board);

  useEffect(() => {
    if (!isXNext && !winner) {
      makeAIMove();
    }
  }, [isXNext, board, winner]);

  useEffect(() => {
    if (winner) {
      if (winner === "X") {
        setGameResult("🎉 You Win! 🎉");
        triggerPartyEffect();
      } else {
        setGameResult("❌ You Lose! ❌");
        triggerShakeEffect();
      }
    } else if (!board.includes(null)) {
      setGameResult("It's a Draw! 🤝");
    }
  }, [winner]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameResult(null);
    setShake(false);
  };

  const makeAIMove = () => {
    const ai = "O";
    const opponent = "X";
    let newBoard = [...board];

    const winningMove = findBestMove(newBoard, ai);
    if (winningMove !== -1) {
      newBoard[winningMove] = ai;
      setBoard(newBoard);
      setIsXNext(true);
      return;
    }

    const blockingMove = findBestMove(newBoard, opponent);
    if (blockingMove !== -1) {
      newBoard[blockingMove] = ai;
      setBoard(newBoard);
      setIsXNext(true);
      return;
    }

    const emptyCells = newBoard.map((cell, index) => (cell === null ? index : -1)).filter(index => index !== -1);
    const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    newBoard[randomMove] = ai;
    setBoard(newBoard);
    setIsXNext(true);
  };

  const findBestMove = (board, player) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      const cells = [board[a], board[b], board[c]];
      const emptyCellIndex = cells.indexOf(null);

      if (emptyCellIndex !== -1 && cells.filter(cell => cell === player).length === 2) {
        return combination[emptyCellIndex];
      }
    }
    return -1;
  };

  const triggerPartyEffect = () => {
    const confetti = document.createElement("div");
    confetti.innerHTML = "🎉";
    confetti.style.position = "fixed";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = "-10px";
    confetti.style.fontSize = "2rem";
    confetti.style.animation = "fall 2s linear";
    document.body.appendChild(confetti);

    setTimeout(() => {
      document.body.removeChild(confetti);
    }, 2000);
  };

  const triggerShakeEffect = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div style={styles.TTTmain}>
        <a href="/gameindex" className="btn btn-dark">BACK TO GAME CORNER</a>
        <br></br>
      <div style={{ ...styles.TTTgame, ...(shake ? styles.shake : {}) }}>
        <h1 style={styles.heading}>Tic Tac Toe</h1>
        {gameResult ? <h2 style={styles.result}>{gameResult}</h2> : <h2 style={styles.subHeading}>Next Player: {isXNext ? "X" : "O"}</h2>}
        <div style={styles.TTTboard}>
          {board.map((cell, index) => (
            <div key={index} style={styles.TTTcell} onClick={() => handleClick(index)}>
              {cell}
            </div>
          ))}
        </div>
        <button style={styles.TTTrestart} onClick={restartGame}>
          Restart Game
        </button>
      </div>
      
    </div>
  );
};

// Helper function to check for a winner
const calculateWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

// Inline styles
const styles = {
  TTTmain: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to bottom, #2a0a52, #3d0e70)", // Dark Purple Gradient
    flexDirection: "column",
  },
  TTTgame: {
    textAlign: "center",
    backgroundColor: "#2a0a52", // Dark Purple
    padding: "20px",
    borderRadius: "10px",
    border: "2px solid white",
  },
  heading: {
    fontSize: "36px",
    marginBottom: "20px",
    color: "purple", // Changed from yellow to black
  },
  subHeading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "white",
  },
  result: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "white", // Changed from yellow to black
  },
  shake: {
    animation: "shake 0.5s",
  },
  TTTboard: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 100px)",
    gridTemplateRows: "repeat(3, 100px)",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  TTTcell: {
    width: "100px",
    height: "100px",
    backgroundColor: "#5e1a98", // Darker Purple Tile
    fontSize: "32px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "5px",
    color: "white",
  },
  TTTrestart: {
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "purple",
    color: "black",
    border: "none",
    borderRadius: "5px",
  },
  TTTHome: {
    marginTop: "20px",
    backgroundColor: "#f4a261",
    padding: "10px 20px",
    borderRadius: "5px",
  },
};

export default TicTacToe;
