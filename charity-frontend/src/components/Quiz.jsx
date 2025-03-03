import React, { useState } from "react";
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
      question: 'Who wrote the play "Romeo and Juliet"?',
      options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "George Orwell"],
      correctAnswer: "William Shakespeare",
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Egypt", "Japan", "Russia"],
      correctAnswer: "Japan",
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswerSelection = (answer) => {
    setUserAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (userAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }

    setUserAnswer("");
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  // Styles with a dark gradient background
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
      {isFinished && <Confetti />}
      <a href="/gameindex" className="btn btn-dark">BACK TO GAME CORNER</a>
      <br />
      <div style={styles.card}>
        <h1 className="text-center mb-3">Quiz Application 🎯</h1>

        {isFinished ? (
          <div className="text-center">
            <h2 className="text-success">🎉 Quiz Completed! 🎉</h2>
            <p className="fs-5">
              Your final score: <strong>{score} / {questions.length}</strong>
            </p>
            <button onClick={handleRestart} className="btn btn-danger btn-lg mt-3">
              Restart Quiz 🔄
            </button>
          </div>
        ) : (
          <div>
            <h4 className="mb-3">{questions[currentQuestionIndex].question}</h4>

            <div className="d-grid gap-2">
              {questions[currentQuestionIndex].options.map((option, index) => (
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

        {!isFinished && (
          <div className="mt-4">
            <p className="text-center mb-1">
              <strong>Question {currentQuestionIndex + 1} of {questions.length}</strong>
            </p>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(((currentQuestionIndex + 1) / questions.length) * 100)} />
            </div>

            <p className="text-center mt-2 fs-5">
              Score: <strong className="text-danger">{score}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
