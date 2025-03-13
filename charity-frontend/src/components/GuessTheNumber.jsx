import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Confetti from "react-confetti";

const GuessTheNumber = () => {
    const [typedNumber, setTypedNumber] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [generatedNumber, setGeneratedNumber] = useState(Math.floor(Math.random() * 100) + 1);
    const [alertMessage, setAlertMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    console.log(`Generated Number: ${generatedNumber}`);

    const playAgain = () => {
        setTypedNumber("");
        setAttempts(0);
        setAlertMessage("");
        setShowPopup(false);
        setGeneratedNumber(Math.floor(Math.random() * 100) + 1);
    };

    // Function to send attempts count to backend when the player wins
    const saveScore = async (finalAttempts) => {
        try {
            const token = sessionStorage.getItem("token"); // Get token from sessionStorage
    
            if (!token) {
                console.error("❌ User is not authenticated");
                alert("You must be logged in to save your score.");
                return;
            }
    
            const response = await fetch("http://localhost:3030/api/saveGuessTheNumberScore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Send authentication token
                },
                body: JSON.stringify({ attempts: finalAttempts }),
            });
    
            const data = await response.json();
            console.log("✅ Score saved:", data);
        } catch (error) {
            console.error("❌ Error saving score:", error);
        }
    };
    

    const compare = () => {
        const number = Number(typedNumber); // Convert input to a number

        if (isNaN(number) || number < 1 || number > 100) {
            setAlertMessage("Please enter a valid number between 1 and 100!");
            return;
        }

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (number === generatedNumber) {
            setAlertMessage(`🎉 You won! The number was ${generatedNumber}`);
            setShowPopup(true);
            saveScore(newAttempts); // Save the correct number of attempts
        } else if (Math.abs(number - generatedNumber) <= 5) {
            setAlertMessage(`🔥 You are very close!`);
        } else if (number > generatedNumber) {
            setAlertMessage(`📈 Number is too High!`);
        } else {
            setAlertMessage(`📉 Number is too Low!`);
        }
    };

    // Styles
    const styles = {
        numberGame: {
            width: "100%",
            backgroundColor: "black",
            margin: 0,
            padding: 0,
            fontFamily: "Arial, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            color: "rgb(21, 228, 21)",
            boxShadow: "inset 0 0 100px rgba(21, 228, 21, 0.3)",
            flexDirection: "column",
        },
        appMain: {
            width: "50%",
            height: "500px",
            backgroundColor: "black",
            margin: "0 auto",
            padding: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            border: "2px solid rgba(21, 228, 21, 0.7)",
            boxShadow: "0 0 100px rgba(21, 228, 21, 0.7)",
            borderRadius: "10px",
            position: "relative",
        },
        numberHead: {
            fontSize: "3em",
            marginBottom: "20px",
            color: "rgb(21, 228, 21)",
            textShadow: "0 0 15px rgba(21, 228, 21, 0.7)",
        },
        numberP: {
            color: "rgb(21, 228, 21)",
            fontSize: "1.5em",
            margin: "15px 0",
        },
        input: {
            padding: "10px",
            fontSize: "1.2em",
            width: "120px",
            backgroundColor: "black",
            border: "2px solid rgba(21, 228, 21, 0.5)",
            outline: "none",
            color: "rgb(21, 228, 21)",
            boxShadow: "0 0 15px rgba(21, 228, 21, 0.7)",
            borderRadius: "5px",
            textAlign: "center",
            transition: "all 0.3s ease",
            appearance: "none", // Removes the number input spinner
            MozAppearance: "textfield", // Firefox fix
        },
        numberBtn: {
            padding: "12px 25px",
            fontSize: "1em",
            cursor: "pointer",
            backgroundColor: "black",
            color: "rgb(21, 228, 21)",
            border: "2px solid rgb(21, 228, 21)",
            borderRadius: "5px",
            marginTop: "20px",
            boxShadow: "0 0 15px rgba(21, 228, 21, 0.7)",
            transition: "all 0.3s ease",
        },
    };

    return (
        <div style={styles.numberGame}>
            <a href="/gameindex" className="btn btn-dark">
                BACK TO GAME CORNER
            </a>
            <br />
            <div style={styles.appMain}>
                <h1 style={styles.numberHead}>Guess the Number</h1>
                <p style={styles.numberP}>Guess a number between 1 and 100</p>
                <input
                    type="number"
                    value={typedNumber}
                    onChange={(e) => setTypedNumber(e.target.value)}
                    style={styles.input}
                    min="1"
                    max="100"
                />
                {typedNumber && (
                    <button style={styles.numberBtn} onClick={compare}>
                        Check
                    </button>
                )}
                <br></br>
                <p>{alertMessage}</p>
                <p>Attempts: {attempts}</p>
                <button style={styles.numberBtn} onClick={playAgain}>
                    Play Again
                </button>
            </div>

            {/* Confetti effect when the game is won */}
            {showPopup && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            <Outlet />
        </div>
    );
};

export default GuessTheNumber;
