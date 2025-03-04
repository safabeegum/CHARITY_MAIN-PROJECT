import React from "react";
import { Link, Outlet } from "react-router-dom";

const GameIndex = () => {
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
    };

    // List of games with correct paths
    const gameRoutes = {
        "QUIZ": "/quiz",
        "GUESS THE NUMBER": "/guessthenumber",
        "TIC TAC TOE": "/tictactoe",
        "SNAKE GAME": "/snake-game",
        "HANG MAN": "/hang-man",
        "ADULT PICTIONARY": "/adult-pictionary",
        "TRUTH/DARE": "/truth-or-dare",
        "NEVER HAVE I EVER": "/never-have-i-ever"
    };

    return (
        <>
            <div style={styles.indexMain}>
                <h1 style={styles.indexHead}>WELCOME TO GAME CORNER</h1>
                <div style={styles.indexContainer}>
                    <h2 style={styles.indexSubHead}>PLAY YOUR FAVOURITE GAME!</h2>
                    <div style={styles.gameBtns}>
                        {Object.entries(gameRoutes).map(([gameName, path], index) => (
                            <Link
                                key={index}
                                to={path}
                                style={styles.buttonStyle}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                                    e.currentTarget.style.color = styles.buttonHover.color;
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "";
                                    e.currentTarget.style.color = "white";
                                }}
                            >
                                {gameName}
                            </Link>
                        ))}
                    </div>
                </div>
                <br />
                <a href="/userdashboard" className="btn btn-dark">BACK TO HOME</a>
            </div>
            <Outlet />
        </>
    );
};

export default GameIndex;
