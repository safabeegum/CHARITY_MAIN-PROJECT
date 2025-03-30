import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "./UserNavbar";

const Wallet = () => {
  const [wallets, setWallets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3030/allwallets", {
        headers: { token },
      });

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.status);
        setLoading(false);
        return;
      }

      setWallets([data]);  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      setError("Failed to fetch wallet data.");
      setLoading(false);
    }
};

  const claimReward = async (userId) => {
    const upiId = prompt("Enter your UPI ID to claim the reward:");

    if (!upiId) {
      alert("UPI ID is required to claim the reward.");
      return;
    }

    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3030/claimreward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ userId, upiId }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert("Reward granted successfully!");
        fetchWallets();
      } else {
        alert(data.message || "Failed to claim reward.");
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <UserNavbar />

      <div style={styles.backgroundContainer}>
        <div style={styles.imageContainer}>
          <img
            src="https://img.freepik.com/premium-vector/decorative-frame-with-realistic-red-ribbon-bow_118877-76.jpg?semt=ais_hybrid"
            alt="Wallet Background"
            style={styles.backgroundImage}
          />
          <div style={styles.walletCard}>
            {loading && <p className="text-center">Loading wallets...</p>}
            {error && <p className="text-danger text-center">{error}</p>}

            {!loading && !error && wallets.length > 0 ? (
              wallets.map((wallet) => (
                <div
                  key={wallet._id}
                  className="card shadow-sm border-0"
                  style={styles.card}
                >
                  <div className="card-body">
                    <h3 className="text-center fw-bold mb-4 text-danger">
                      MY WALLET
                    </h3>
                    <h5 className="card-title text-danger">
                      {wallet.userId?.name || "N/A"}
                    </h5>
                    <p className="fw-bold text-success">
                      Balance: ₹{wallet.balance.toFixed(2)}
                    </p>
                    <p className="text-muted">
                      HighScore In: {wallet.transactions.length} Games
                    </p>
                    <div className="d-flex justify-content-center gap-2 mt-2">
                      <button
                        className="btn btn-danger btn"
                        onClick={() => claimReward(wallet.userId?._id)}
                        disabled={wallet.balance < 30}
                      >
                        GET REWARD
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No wallet data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    overflow: "hidden",
    height: "100vh",
    width: "100vw",
  },
  backgroundContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh",
    padding: "0px",
    marginTop: "-30px",
  },
  walletTitle: {
    marginBottom: "5px",
  },
  imageContainer: {
    position: "relative",
    textAlign: "center",
    marginTop: "-30px",
  },
  backgroundImage: {
    width: "750px",
    height: "auto",
    objectFit: "cover",
    transform: "translateY(10px)",
  },
  walletCard: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "340px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
  },
  card: {
    backgroundColor: "transparent",
    border: "none",
  },
};

export default Wallet;
