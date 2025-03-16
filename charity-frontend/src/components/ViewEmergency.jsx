import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import SocialWorkersNavbar from "./SocialWorkersNavbar";

const ViewEmergency = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportLoading, setReportLoading] = useState(null); // Track report button state

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Fetch Emergency Alerts
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3030/getemergency");
      setAlerts(response.data);
      setError(null); // Reset error on successful fetch
    } catch (error) {
      console.error("❌ Error fetching alerts:", error);
      setError("Failed to load alerts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Report Emergency Alert
  const handleReport = async (id) => {
    if (!window.confirm("Are you sure you want to report this emergency alert?")) return;

    try {
      setReportLoading(id); // Disable report button for the clicked alert
      await axios.post("http://localhost:3030/reportemergency", { id });
      fetchAlerts(); // Refresh alerts after reporting
      alert("🚩 Emergency alert reported!");
    } catch (error) {
      console.error("❌ Error reporting alert:", error);
      alert("❌ Failed to report emergency.");
    } finally {
      setReportLoading(null); // Re-enable report button
    }
  };

  return (
    <div>
      <SocialWorkersNavbar />
      <div className="container mt-4">
        <h4 className="text-center fw-bold mb-4 text-danger">🚨 EMERGENCY ALERTS</h4>

        {/* Error Message */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Display Alerts */}
        {loading ? (
          <h5 className="text-center">Loading...</h5>
        ) : alerts.length === 0 ? (
          <h5 className="text-center text-muted">No alerts available.</h5>
        ) : (
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Ward Number</th>
                <th>Type</th>
                <th>Date</th>
                <th>Reports</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert._id}>
                  <td>{alert.title}</td>
                  <td>{alert.location}</td>
                  <td>{alert.ward_no}</td>
                  <td>{alert.alertType}</td>
                  <td>{new Date(alert.createdAt).toLocaleString()}</td>
                  <td>{alert.reports || 0}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleReport(alert._id)}
                      disabled={reportLoading === alert._id} // Disable button while reporting
                    >
                      <FontAwesomeIcon icon={faFlag} /> Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewEmergency;
