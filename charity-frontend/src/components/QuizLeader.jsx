import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import UserNavbar from "./UserNavbar";

const QuizLeader = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        fetchQuizLeader();
    }, []);

    const fetchQuizLeader = async () => {
        try {
            const response = await fetch("http://localhost:3030/api/getQuizLeader"); // ✅ Correct API URL
            const data = await response.json();

            if (!data.quizLeaderboard) {
                console.error("No leaderboard data found!");
                return;
            }

            // Sort leaders by highest score (higher is better)
            const sortedLeaders = data.quizLeaderboard.sort((a, b) => b.score - a.score);
            setLeaders(sortedLeaders);
        } catch (error) {
            console.error("Error fetching Quiz Leaderboard:", error);
        }
    };

    return (
        <div>
            <UserNavbar />
            <div className="leaderboard-container" style={{ textAlign: "center" }}>
                <h3>Today's Quiz Leaders 🏆</h3>
                {leaders.length > 0 && (
                    <h4>🥇 Top Scorer: {leaders[0].userId?.username} with {leaders[0].score} points!</h4>
                )}
                <ResponsiveContainer width="80%" height={400}>
                    <BarChart 
                        data={leaders} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <XAxis 
                            dataKey="userId.username" 
                            tick={{ fontSize: 14 }} 
                            angle={-30} 
                            textAnchor="end" 
                        />
                        <YAxis label={{ value: "Score", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#4287f5" barSize={50}>
                            {leaders.map((entry, index) => (
                                <Cell key={entry.userId?._id} fill={index === 0 ? "#FFD700" : "#4287f5"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default QuizLeader;
