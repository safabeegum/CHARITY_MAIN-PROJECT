import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import SocialWorkersNavbar from "./SocialWorkersNavbar";

const ViewReports = () => {
  const [postReports, setPostReports] = useState([]);
  const [gameReports, setGameReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPostCash, setTotalPostCash] = useState(0);
  const [totalGameCash, setTotalGameCash] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError("");

    axios
      .post("http://localhost:3030/viewreports", {}, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        const { postReports = [], gameReports = [] } = response.data;

        setPostReports(postReports);
        setGameReports(gameReports);

        const postCash = postReports.reduce((sum, report) => sum + (report.currentDonationsReceived || 0), 0);
        setTotalPostCash(postCash);

        const gameCash = gameReports.reduce((sum, report) => sum + (report.amountDonated || 0), 0);
        setTotalGameCash(gameCash);

        const totalPostTransactions = postReports.filter(report => (report.currentDonationsReceived || 0) > 0).length;
        setTotalTransactions(totalPostTransactions + gameReports.length);
      })
      .catch((err) => {
        console.error("Failed to fetch reports", err);
        setError("Failed to load reports. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <SocialWorkersNavbar />
      <div className="container mt-4">
        <h4 className="text-center fw-bold mb-4 text-primary">VIEW REPORTS</h4>
        <div className="row mb-3">
          <div className="col-md-4">
            <div className="card text-white bg-success mb-3">
              <div className="card-body text-center">
                <h5>Total Post Donations</h5>
                <h2>₹ {totalPostCash.toLocaleString()}</h2>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card text-white bg-info mb-3">
              <div className="card-body text-center">
                <h5>Total Donations</h5>
                <h2>{totalTransactions}</h2>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <h5 className="text-center">Loading reports...</h5>
        ) : error ? (
          <h5 className="text-center text-danger">{error}</h5>
        ) : (
          <>
            <h4 className="text-success mt-4">POST DONATIONS</h4>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Required (₹)</th>
                  <th>Collected (₹)</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {postReports.length === 0 ? (
                  <tr><td colSpan="4" className="text-center">No post donations available.</td></tr>
                ) : (
                  postReports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.title || "N/A"}</td>
                      <td>₹ {(report.requiredAmount || 0).toLocaleString()}</td>
                      <td>₹ {(report.currentDonationsReceived || 0).toLocaleString()}</td>
                      <td>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewReports;
