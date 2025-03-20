import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const RejectedPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3030/rejectedposts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching rejected posts:", error));
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-4">
        <h3 className="text-center fw-bold mb-4">REJECTED POSTS</h3>
        {posts.length === 0 ? (
          <p className="text-center">No rejected posts available.</p>
        ) : (
          <div className="row">
            {posts.map((post, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card shadow-sm border-danger">
                  <div className="card-body">
                    <h5 className="card-title text-danger">{post.title}</h5>
                    <p className="card-text">NAME: {post.name}</p>
                    <p>
                      <strong>REJECTION REASON:</strong> {post.rejectionReason}
                    </p>
                    <button className="btn btn-outline-danger">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RejectedPost;
