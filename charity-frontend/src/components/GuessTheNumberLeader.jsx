import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import UserNavbar from "./UserNavbar";

const GuessTheNumberLeader = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        fetchGuessTheNumberLeader();
    }, []);

    const fetchGuessTheNumberLeader = async () => {
        try {
            const response = await fetch("http://localhost:3030/api/getGuessTheNumberLeader");
            const data = await response.json();

            // Sort leaders by attempts (lower is better)
            const sortedLeaders = data.guessTheNumberLeader.sort((a, b) => a.attempts - b.attempts);
            setLeaders(sortedLeaders);
        } catch (error) {
            console.error("Error fetching GuessTheNumberLeader:", error);
        }
    };

    return (
        <div><UserNavbar/>
        
        <div className="leaderboard-container" style={{ textAlign: "center" }}>
            
            <h3>Today's Leader of Guess the Number!!</h3>
            {leaders.length > 0 && (
                <h4>🏆 Winner: {leaders[0].userId.username}</h4>
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
                    <YAxis label={{ value: "Attempts", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Bar dataKey="attempts" fill="#82ca9d" barSize={50}>
                        {leaders.map((entry, index) => (
                            <Cell key={entry.userId.username} fill={index === 0 ? "#FFD700" : "#82ca9d"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
};

export default GuessTheNumberLeader;

