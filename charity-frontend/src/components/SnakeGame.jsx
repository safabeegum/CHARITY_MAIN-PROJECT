import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SnakeGame = () => {
  const generateFood = () => {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    return { x, y };
  };

  const gridSize = 10;
  const WINNING_SCORE = 10;
  const [snake, setSnake] = useState([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState(generateFood());
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false); // Shake effect on lose

  useEffect(() => {
    if (gameOver || gameWon) return;
    const interval = setInterval(() => {
      moveSnake();
    }, 200);

    return () => clearInterval(interval);
  }, [snake, direction, gameOver, gameWon]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
      default:
        break;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setScore(score + 1);

      if (score + 1 === WINNING_SCORE) {
        setGameWon(true);
        triggerWinEffect();
        return;
      }
    } else {
      newSnake.pop();
    }

    if (checkCollision(head)) {
      setGameOver(true);
      triggerShakeEffect();
    }

    setSnake(newSnake);
  };

  const checkCollision = (head) => {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true;
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    return false;
  };

  const changeDirection = (e) => {
    if (gameOver || gameWon) return;

    switch (e.key) {
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
      default:
        break;
    }
  };

  const restartGame = () => {
    setSnake([
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ]);
    setDirection("RIGHT");
    setFood(generateFood());
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setShake(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", changeDirection);
    return () => window.removeEventListener("keydown", changeDirection);
  }, [direction]);

  const triggerWinEffect = () => {
    alert("🎉 You Win! 🎉");
  };

  const triggerShakeEffect = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div style={styles.page}>
      {/* BACK TO GAME CORNER BUTTON */}
      <Link to="/gameindex" style={styles.backButton}>
        BACK TO GAME CORNER
      </Link>

      <div style={styles.gameContainer}>
        <h1>Snake Game</h1>
        <h2>Score: {score}</h2>
        <div style={{ ...styles.board, ...(shake ? styles.shake : {}) }}>
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => {
              const isSnake = snake.some((segment) => segment.x === col && segment.y === row);
              const isFood = food.x === col && food.y === row;
              return (
                <div
                  key={`${row}-${col}`}
                  style={{
                    ...styles.cell,
                    ...(isSnake ? styles.snake : {}),
                    ...(isFood ? styles.food : {}),
                  }}
                />
              );
            })
          )}
        </div>

        {gameOver && (
          <div>
            <h2 style={styles.loseText}>❌ Game Over! ❌</h2>
            <button style={styles.button} onClick={restartGame}>Restart Game</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  page: {
    background: "linear-gradient(to bottom, #000000, #1a1a1a, #333333)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    textDecoration: "none",
    backgroundColor: "grey",
    color: "white", // Updated purple to match text color in image
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    marginBottom: "15px",
  },
  gameContainer: {
    backgroundColor: "purple", // Purple box
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    color: "violet",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 30px)",
    gridTemplateRows: "repeat(10, 30px)",
    gap: "2px",
    margin: "20px auto",
  },
  cell: {
    width: "30px",
    height: "30px",
    backgroundColor: "black",
    border: "1px solid #ccc",
  },
  snake: {
    backgroundColor: "#33cc33",
  },
  food: {
    backgroundColor: "#ff5733",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "black",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  shake: {
    animation: "shake 0.5s",
  },
  loseText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
  },
};

export default SnakeGame;
