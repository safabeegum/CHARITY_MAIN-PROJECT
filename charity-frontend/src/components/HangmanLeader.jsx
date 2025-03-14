import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import UserNavbar from "./UserNavbar";

const HangmanLeader = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHangmanLeader();
    }, []);

    const fetchHangmanLeader = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3030/api/getHangmanLeader", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: new Date().toISOString().split("T")[0] }) // Send today's date
            });

            const data = await response.json();
            console.log("✅ API Response:", data); // Debugging

            if (!data.leaderboard || data.leaderboard.length === 0) {
                setError("No leaders today!");
                setLeaders([]);
                return;
            }

            // Ensure sorting by lowest score (best performance wins)
            setLeaders(data.leaderboard.sort((a, b) => a.score - b.score));
        } catch (error) {
            console.error("❌ Error fetching Hangman leaderboard:", error);
            setError("Failed to load leaderboard");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <UserNavbar />
            <div className="leaderboard-container" style={{ textAlign: "center" }}>
                <h3>Today's Hangman Leaders 🏆</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : leaders.length > 0 ? (
                    <>
                        <h4>🥇 Best Player: {leaders[0]?.userId?.username || "N/A"}</h4>
                        <ResponsiveContainer width="90%" height={400}>
                            <BarChart data={leaders} margin={{ top: 30, right: 30, left: 20, bottom: 60 }}>
                                <XAxis dataKey="userId.username" tick={{ fontSize: 14 }} angle={-30} textAnchor="end" />
                                <YAxis label={{ value: "Chances Used", angle: -90, position: "insideLeft" }} />
                                <Tooltip />
                                <Bar dataKey="score" fill="#FF7F50" barSize={50}> {/* Added barSize={50} */}
    {leaders.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={index === 0 ? "#FFD700" : "#FF7F50"} />
    ))}
</Bar>

                            </BarChart>
                        </ResponsiveContainer>
                    </>
                ) : (
                    <h4 style={{ color: "gray" }}>No leaders today! Play a game to be the first leader.</h4>
                )}
            </div>
        </div>
    );
};

export default HangmanLeader;