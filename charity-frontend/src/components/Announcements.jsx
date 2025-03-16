import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import SocialWorkersNavbar from "./SocialWorkersNavbar";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Fetch Announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3030/getAnnouncements");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("❌ Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Announcement
  const handleAdd = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3030/addAnnouncement", { topic });
      setAnnouncements([...announcements, response.data.announcement]);
      setTopic(""); // Clear input
      alert("✅ Announcement added!");
    } catch (error) {
      console.error("❌ Error adding announcement:", error);
      alert("❌ Failed to add announcement.");
    }
  };

  // Delete Announcement
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await axios.post("http://localhost:3030/deleteAnnouncement", { id });
      setAnnouncements(announcements.filter((a) => a._id !== id));
      alert("✅ Announcement deleted!");
    } catch (error) {
      console.error("❌ Error deleting announcement:", error);
      alert("❌ Failed to delete announcement.");
    }
  };

  return (
    <div>
        <SocialWorkersNavbar/>
    <div className="container mt-4">
      <h4 className="text-center fw-bold mb-4 text-secondary">COMMUNITY ANNOUNCEMENTS</h4>
      {/* Add Announcement */}
      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter announcement topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} /> Add
        </button>
      </div>

      {/* Display Announcements */}
      {loading ? (
        <h5 className="text-center">Loading...</h5>
      ) : announcements.length === 0 ? (
        <h5 className="text-center text-muted">No announcements available.</h5>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Topic</th>
              <th>Likes</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement._id}>
                <td>{announcement.topic}</td>
                <td>{announcement.likes || 0}</td>
                <td>{new Date(announcement.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(announcement._id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
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

export default Announcements;
