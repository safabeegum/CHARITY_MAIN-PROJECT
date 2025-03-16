import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import SocialWorkersNavbar from "./SocialWorkersNavbar";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  useEffect(() => {
    fetchSocialWorkerPosts();
  }, []);

  const fetchSocialWorkerPosts = async () => {
    const email = sessionStorage.getItem("email");
    try {
      const response = await axios.post("http://localhost:3030/getSocialWorkerPosts", { email });
      setPosts(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch posts", error);
      alert("❌ Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);  // Store the selected post for editing
    setEditAmount(post.requiredAmount); // Pre-fill with existing amount
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3030/editPost", {
        postId: editingPost._id,
        requiredAmount: editAmount, // Send only updated amount
      });

      alert(response.data.message);

      // Update UI instantly
      setPosts(posts.map((post) => (post._id === editingPost._id ? response.data.updatedPost : post)));

      setEditingPost(null); // Close the modal
    } catch (error) {
      console.error("❌ Failed to update amount", error);
      alert("❌ Failed to update amount");
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
        try {
            await axios.post("http://localhost:3030/deletePost", { postId }); // Send postId in the body
            setPosts(posts.filter((post) => post._id !== postId));
            alert("✅ Post deleted successfully");
        } catch (error) {
            console.error("❌ Failed to delete post", error.response ? error.response.data : error.message);
            alert("❌ Failed to delete post: " + (error.response ? error.response.data.message : error.message));
        }
    }
};



  return (
    <div>
      <SocialWorkersNavbar />
      <div className="container mt-4">
        <h3 className="text-center fw-bold mb-4 text-warning">MANAGE POSTS</h3>
        {loading ? (
          <h5>Loading...</h5>
        ) : posts.length === 0 ? (
          <h5>No posts found.</h5>
        ) : (
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Required (₹)</th>
                <th>Collected (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.requiredAmount}</td>
                  <td>{post.currentDonationsReceived}</td>
                  <td>
                    <span className={`badge ${post.status === "approved" ? "bg-success" : post.status === "Rejected" ? "bg-danger" : post.requiredAmount <= post.currentDonationsReceived ? "bg-primary" : "bg-warning"}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-warning me-2" onClick={() => handleEdit(post)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(post._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Required Amount</h5>
                <button className="btn-close" onClick={() => setEditingPost(null)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">New Required Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">Save Changes</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePosts;
