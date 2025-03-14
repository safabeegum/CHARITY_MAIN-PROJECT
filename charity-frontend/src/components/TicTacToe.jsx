import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Define `calculateWinner` function
const calculateWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return the winner ('X' or 'O')
    }
  }
  return null; // No winner yet
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameResult, setGameResult] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const navigate = useNavigate();

  const winner = calculateWinner(board);

  useEffect(() => {
    if (winner) {
      if (winner === "X") {
        setGameResult("🎉 You Win!");
        setPlayerScore((prevScore) => prevScore + 1);
        saveScore(1);
      } else {
        setGameResult("❌ You Lose! ❌");
        saveScore(0);
      }
    } else if (!board.includes(null)) {
      setGameResult("It's a Draw! 🤝");
      saveScore(0.5);
    }
  }, [winner, board]);

  useEffect(() => {
    if (!isXNext && !winner) {
      setTimeout(makeAIMove, 500); // ✅ AI moves automatically after 500ms
    }
  }, [isXNext, board, winner]);

  const saveScore = async (score) => {
    try {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("🚨 No authentication token found!");
            return;
        }

        console.log("📌 Sending score to backend:", score);

        const response = await fetch("http://localhost:3030/api/saveTicTacToeScore", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ score }),
        });

        const data = await response.json();
        console.log("✅ Response from backend:", data);
    } catch (error) {
        console.error("❌ Error saving score:", error);
    }
};


  const handleClick = (index) => {
    if (board[index] || gameResult) return; // ✅ Prevent clicking on occupied cells

    const newBoard = [...board];
    newBoard[index] = "X"; // Player move
    setBoard(newBoard);
    setIsXNext(false); // ✅ AI moves next
  };

  const makeAIMove = () => {
    let availableMoves = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null);
      
    if (availableMoves.length === 0 || winner) return;

    let aiMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    let newBoard = [...board];
    newBoard[aiMove] = "O"; // ✅ AI move
    setBoard(newBoard);
    setIsXNext(true); // ✅ Player moves next
  };

  return (
    <div style={styles.TTTmain}>
      <a href="/gameindex" className="btn btn-dark">BACK TO GAME CORNER</a>
      <br />
      <div style={{ ...styles.TTTgame }}>
        <h1 style={styles.heading}>Tic Tac Toe</h1>
        {gameResult ? (
          <h2 style={styles.result}>{gameResult}</h2>
        ) : (
          <h2 style={styles.subHeading}>Next Player: {isXNext ? "X" : "O"}</h2>
        )}
        <div style={styles.TTTboard}>
          {board.map((cell, index) => (
            <div key={index} style={styles.TTTcell} onClick={() => handleClick(index)}>
              {cell}
            </div>
          ))}
        </div>
        <button style={styles.TTTrestart} onClick={() => navigate("/gameindex")}>
          RESTART
        </button>
      </div>
    </div>
  );
};

// ✅ Styles (Not changed)
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
    color: "purple",
  },
  subHeading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "white",
  },
  result: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "white",
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
    backgroundColor: "#5e1a98",
    fontSize: "32px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "5px",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  TTTrestart: {
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "purple",
    color: "black",
    border: "none",
    borderRadius: "5px",
  },
};

export default TicTacToe;
