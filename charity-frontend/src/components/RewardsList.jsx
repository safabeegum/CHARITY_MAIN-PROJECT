import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";

const RewardsList = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch("http://localhost:3030/rewardslist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.message || "Failed to fetch rewards.");
        setLoading(false);
        return;
      }

      setRewards(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavbar />

      <div className="container mt-5">
        <h3 className="text-center fw-bold mb-4 text-danger">REWARD LIST</h3>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        {!loading && !error && rewards.length > 0 ? (
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>USER NAME</th>
                <th>EMAIL</th>
                <th>UPI ID</th>
                <th>AMOUNT</th>
                <th>CLAIMED AT</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward._id}>
                  <td>{reward.userId?.name || "N/A"}</td>
                  <td>{reward.userId?.email || "N/A"}</td>
                  <td>{reward.upiId}</td>
                  <td>₹{reward.amount.toFixed(2)}</td>
                  <td>{new Date(reward.claimedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No rewards found.</p>
        )}
      </div>
    </div>
  );
};

export default RewardsList;
