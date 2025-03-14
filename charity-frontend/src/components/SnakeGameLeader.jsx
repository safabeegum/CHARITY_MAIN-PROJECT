import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import UserNavbar from "./UserNavbar";

const SnakeGameLeader = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        fetchSnakeLeader();
    }, []);

    const fetchSnakeLeader = async () => {
        try {
            const response = await fetch("http://localhost:3030/api/getSnakeLeader", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: new Date().toISOString().split("T")[0] }) // Send today's date
            });

            const data = await response.json();
            if (!data.leaderboard) {
                console.error("No leaderboard data found!");
                return;
            }

            setLeaders(data.leaderboard.sort((a, b) => b.score - a.score)); // Sort highest score first
        } catch (error) {
            console.error("Error fetching Snake Game leaderboard:", error);
        }
    };

    return (
        <div>
            <UserNavbar />
            <div className="leaderboard-container" style={{ textAlign: "center" }}>
                <h3>Today's Snake Game Leaders 🏆</h3>
                {leaders.length > 0 && (
                    <h4>🥇 Top Scorer: {leaders[0].userId?.username} </h4>
                )}
                <ResponsiveContainer width="80%" height={400}>
                    <BarChart data={leaders} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <XAxis dataKey="userId.username" tick={{ fontSize: 14 }} angle={-30} textAnchor="end" />
                        <YAxis label={{ value: "Score", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#42f54b" barSize={50}>
                            {leaders.map((entry, index) => (
                                <Cell key={entry.userId?._id} fill={index === 0 ? "#FFD700" : "#42f54b"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SnakeGameLeader;
