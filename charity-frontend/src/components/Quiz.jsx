import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const Quiz = () => {
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Southern", "Pacific"],
      correctAnswer: "Pacific",
    },
    {
      question: "What is the longest river in the world?",
      options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
      correctAnswer: "Nile",
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Egypt", "Japan", "Russia"],
      correctAnswer: "Japan",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnswerSelection = (answer) => {
    setUserAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (userAnswer === null) {
      alert("Please select an answer before submitting.");
      return;
    }

    let newScore = score;
    if (userAnswer === questions[currentQuestion].correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setUserAnswer(null);
    } else {
      setIsFinished(true);
      setShowConfetti(true);

      setTimeout(() => {
        saveQuizScore(newScore);
      }, 100);
    }
  };

  const saveQuizScore = async (finalScore) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("You need to log in first!");
        return;
      }

      const response = await fetch("http://localhost:3030/api/saveQuizScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: finalScore }),
      });

      if (!response.ok) {
        throw new Error("Failed to save score.");
      }

      const data = await response.json();
      console.log("✅ Score saved successfully:", data);
    } catch (error) {
      console.error("❌ Error saving score:", error);
      alert("Failed to save score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #000000, #1a1a1a, #333333)",
      color: "white",
      padding: "20px",
    },
    card: {
      maxWidth: "600px",
      width: "100%",
      backgroundColor: "#222",
      padding: "25px",
      borderRadius: "10px",
      boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
      color: "white",
    },
    button: {
      marginTop: "10px",
    },
    progressBar: {
      height: "10px",
      backgroundColor: "#444",
      borderRadius: "5px",
      overflow: "hidden",
    },
    progressFill: (progress) => ({
      width: `${progress}%`,
      height: "100%",
      backgroundColor: "#28a745",
      transition: "width 0.5s ease-in-out",
    }),
  };

  return (
    <div style={styles.container}>
      {isFinished && showConfetti && <Confetti />}
      <a href="/gameindex" className="btn btn-dark">
        BACK TO GAME CORNER
      </a>
      <br />
      <div style={styles.card}>
        <h1 className="text-center mb-3">Quiz Application 🎯</h1>

        {isFinished ? (
          <div>
            <h2 className="text-center">🎉 Quiz Completed! 🎉</h2>
            
          </div>
        ) : (
          <div>
            <h4 className="mb-3">{questions[currentQuestion].question}</h4>

            <div className="d-grid gap-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(option)}
                  className={`btn btn-lg ${
                    userAnswer === option ? "btn-info text-white" : "btn-outline-secondary"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer}
              className="btn btn-success btn-lg w-100 mt-4"
              style={styles.button}
            >
              Submit Answer ✅
            </button>
          </div>
        )}

        <div className="mt-4">
          <p className="text-center mb-1">
            <strong>Question {currentQuestion + 1} of {questions.length}</strong>
          </p>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(((currentQuestion + 1) / questions.length) * 100)} />
          </div>
          <p className="text-center mt-2 fs-5">
            Score: <strong>{score} / {questions.length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quiz;