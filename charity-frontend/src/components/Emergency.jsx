import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import SocialWorkersNavbar from "./SocialWorkersNavbar";

const Emergency = () => {
  const [alerts, setAlerts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [alertType, setAlertType] = useState("default");
  const [ward_no, setWardNo] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Fetch Emergency Alerts (Only Approved)
  const fetchAlerts = async () => {
    try {
      const response = await axios.get("http://localhost:3030/getemergency");
      setAlerts(response.data);
    } catch (error) {
      console.error("❌ Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add New Emergency Alert
  const handleAdd = async () => {
    if (!title.trim() || !description.trim() || !location.trim() || alertType === "default" || ward_no === "default") {
      alert("⚠️ Please fill all fields and select a valid alert type!");
      return;
    }

    try {
      // Post the emergency alert data to the backend
      const response = await axios.post("http://localhost:3030/addemergency", {
        title,
        description,
        location,
        alertType,
        ward_no
      });

      // Trigger email sending after alert is added successfully
      if (response.data.success) {
        alert("✅ Emergency alert reported and emails sent!");
      } else {
        alert("❌ Failed to report the emergency alert.");
      }

      setTitle("");
      setDescription("");
      setLocation("");
      setAlertType("default"); // Reset dropdown
      setWardNo("default");
      fetchAlerts(); // Refresh alerts
    } catch (error) {
      console.error("❌ Error adding alert:", error);
      alert("Your alert was flagged as potential spam and was not added!");
    }
  };

  return (
    <div>
      <SocialWorkersNavbar />
      <div className="container mt-4">
        <h4 className="text-center fw-bold mb-4 text-danger">🚨 EMERGENCY ALERTS</h4>

        {/* Add Alert Form */}
        <div className="mb-3 p-3 border rounded">
          <h5 className="fw-bold">REPORT AN EMERGENCY</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Dropdown with Disabled Default Option */}
          <select
            className="form-control mb-2"
            value={alertType}
            onChange={(e) => setAlertType(e.target.value)}
          >
            <option value="default" disabled>
              --- SELECT CAUSE ---
            </option>
            <option value="Fire">Fire</option>
            <option value="Flood">Flood</option>
            <option value="Accident">Accident</option>
            <option value="Crime">Crime</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="form-control mb-2"
            value={ward_no}
            onChange={(e) => setWardNo(e.target.value)}
          >
            <option value="default" disabled>
              --- SELECT WARD ---
            </option>
            {[...Array(10).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>

          <button className="btn btn-danger" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} /> Report Emergency
          </button>
        </div>

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
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert._id}>
                  <td>{alert.title}</td>
                  <td>{alert.location}</td>
                  <td>{alert.ward_no}</td>
                  <td>{alert.alertType}</td>
                  <td>{alert.createdAt}</td>
                  <td>{alert.reports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Emergency;
