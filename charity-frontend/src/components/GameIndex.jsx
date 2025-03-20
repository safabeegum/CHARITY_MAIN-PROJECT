import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const GameIndex = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [upiID, setUpiID] = useState("");
  const navigate = useNavigate();

  const styles = {
    indexMain: {
      width: "100%",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.79), rgba(0, 0, 0, 0.73)), 
                       url('https://previews.123rf.com/images/topvector/topvector2309/topvector230900022/212377790-game-together-family-fun-friendship-time-vector-illustration-people-playing-games-together.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    indexHead: {
      color: "white",
      fontSize: "50px",
      fontWeight: "bold",
      lineHeight: "2.5",
      marginBottom: "-20px",
    },
    indexContainer: {
      width: "70%",
      height: "350px",
      border: "1px solid white",
      borderRadius: "10px",
      textAlign: "center",
      color: "white",
      paddingTop: "20px",
    },
    indexSubHead: {
      marginTop: "20px",
    },
    gameBtns: {
      width: "80%",
      height: "220px",
      marginLeft: "10%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
    },
    buttonStyle: {
      width: "150px",
      height: "70px",
      border: "2px solid white",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      color: "white",
      fontWeight: "600",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      textDecoration: "none",
    },
    buttonHover: {
      backgroundColor: "white",
      color: "black",
      transform: "scale(1.05)",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      width: "400px",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
    },
    modalButton: {
      marginTop: "10px",
      padding: "10px 20px",
      border: "none",
      backgroundColor: "green",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "5px",
    },
    closeButton: {
      marginTop: "10px",
      padding: "10px 20px",
      border: "none",
      backgroundColor: "red",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "5px",
      marginLeft: "10px",
    },
    inputField: {
      width: "90%",
      padding: "8px",
      marginTop: "10px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
  };

  const gameRoutes = {
    "TIC TAC TOE": "/tictactoe",
    "SNAKE GAME": "/snakegame",
    "HANG MAN": "/hangman",
    QUIZ: "/quiz",
    "GUESS THE NUMBER": "/guessthenumber",
  };

  const openModal = (game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const handlePayment = async () => {
    if (upiID.trim() === "") {
      alert("Please enter your UPI ID to proceed.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Authentication error! Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:3030/gamepayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ method: "UPI" }),
      });

      const data = await response.json();
      console.log("Payment API Response:", data);

      if (data.status === "Success") {
        alert("Payment Successful! Redirecting to game...");
        setModalOpen(false);
        navigate(gameRoutes[selectedGame]);
      } else {
        alert("Payment Failed! Try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Server error! Try again later.");
    }
  };

  return (
    <>
      <div style={styles.indexMain}>
        <h1 style={styles.indexHead}>WELCOME TO GAME CORNER</h1>
        <div style={styles.indexContainer}>
          <h2 style={styles.indexSubHead}>PLAY YOUR FAVOURITE GAME!</h2>
          <div style={styles.gameBtns}>
            {Object.entries(gameRoutes).map(([gameName, path], index) => (
              <div
                key={index}
                style={styles.buttonStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor =
                    styles.buttonHover.backgroundColor;
                  e.currentTarget.style.color = styles.buttonHover.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "white";
                }}
                onClick={() => openModal(gameName)}
              >
                {gameName}
              </div>
            ))}
          </div>
        </div>
        <br />
        <a href="/userdashboard" className="btn btn-dark">
          BACK TO HOME
        </a>
      </div>
      <Outlet />

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Payment Required</h3>
            <p>Pay Rs 2 to play {selectedGame}</p>

            {/* UPI Input Field */}
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiID}
              onChange={(e) => setUpiID(e.target.value)}
              style={styles.inputField}
            />

            <br />
            <button style={styles.modalButton} onClick={handlePayment}>
              Pay
            </button>
            <button
              style={styles.closeButton}
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GameIndex;
