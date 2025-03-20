import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

const ManageReview = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        console.log("No token found! Redirecting to login...");
        setError("Authentication failed. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3030/managereview",
          {},
          { headers: { token } }
        );

        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          setError("Unexpected response format from server.");
        }
      } catch (error) {
        console.error(
          "Error fetching reviews:",
          error.response?.data?.error || error.message
        );
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="container">
        <h4 className="text-center mt-4">USER REVIEWS & RATINGS</h4>

        {loading ? (
          <div className="alert alert-info">Loading reviews...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>User ID</th>
                <th>Review</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <tr key={index}>
                    <td>{review.userId || "N/A"}</td> {}
                    <td>{review.review}</td>
                    <td>{"⭐".repeat(review.rating)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No Reviews Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageReview;
