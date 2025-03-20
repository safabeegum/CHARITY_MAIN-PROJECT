import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import UserNavbar from "./UserNavbar";

const TicTacToeLeader = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchTicTacToeLeader();
  }, []);

  const fetchTicTacToeLeader = async () => {
    try {
      const response = await fetch(
        "http://localhost:3030/api/getTicTacToeLeader",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: new Date().toISOString().split("T")[0],
          }),
        }
      );

      const data = await response.json();
      if (!data.leaderboard) {
        console.error("No leaderboard data found!");
        return;
      }

      setLeaders(data.leaderboard.sort((a, b) => b.score - a.score));
    } catch (error) {
      console.error("Error fetching Tic Tac Toe leaderboard:", error);
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="leaderboard-container" style={{ textAlign: "center" }}>
        <h3>Today's Tic Tac Toe Leaders 🏆</h3>
        {leaders.length > 0 && (
          <h4>🥇 Top Scorer: {leaders[0].userId?.username} </h4>
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
            <YAxis
              label={{ value: "Score", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Bar dataKey="score" fill="#4287f5" barSize={50}>
              {leaders.map((entry, index) => (
                <Cell
                  key={entry.userId?._id}
                  fill={index === 0 ? "#FFD700" : "#4287f5"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TicTacToeLeader;
