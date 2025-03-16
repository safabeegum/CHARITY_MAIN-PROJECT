import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "./UserNavbar";

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
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

  // Like Announcement
  const handleLike = async (id) => {
    try {
      const response = await axios.post("http://localhost:3030/likeAnnouncement", { id });
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === id ? { ...announcement, likes: response.data.likes } : announcement
        )
      );
    } catch (error) {
      console.error("❌ Error liking announcement:", error);
      alert("❌ Failed to like announcement.");
    }
  };

  return (
    <div>
      <UserNavbar/>
    <div className="container mt-4">
      <h4 className="text-center fw-bold mb-4 text-secondary">COMMUNITY ANNOUNCEMENTS</h4>
      {loading ? (
        <h5 className="text-center">Loading...</h5>
      ) : announcements.length === 0 ? (
        <h5 className="text-center text-muted">No announcements available.</h5>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Topic</th>
              <th>Date</th>
              <th>Likes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement._id}>
                <td>{announcement.topic}</td>
                <td>{new Date(announcement.createdAt).toLocaleDateString()}</td>
                <td>{announcement.likes || 0}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleLike(announcement._id)}>
                    <FontAwesomeIcon icon={faThumbsUp} /> Like
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

export default UserAnnouncements;
