import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import TransactionModal from "./TransactionModal";

const CompletedPosts = () => {
  const [completedPosts, setCompletedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [completedTransactions, setCompletedTransactions] = useState({});

  useEffect(() => {
    fetchCompletedPosts();
  }, []);

  const fetchCompletedPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3030/completedposts");
      console.log("Completed Posts Response:", response.data);

      setCompletedPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch completed posts", error);
    }
  };

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleTransactionSuccess = async () => {
    await fetchCompletedPosts();
    setShowModal(false);
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-4">
        <h3 className="text-center fw-bold mb-4 text-success">TRANSACTION</h3>
        {completedPosts.length === 0 ? (
          <p className="text-center">No completed posts available.</p>
        ) : (
          <div className="row">
            {completedPosts.map((post) => (
              <div key={post._id} className="col-md-4 mb-4">
                <div className="card shadow-sm border-success">
                  <div className="card-body">
                    <h5 className="card-title text-success">{post.title}</h5>
                    <p className="card-text">
                      <strong>Name:</strong> {post.name}
                    </p>
                    <p>
                      <strong>Required:</strong> ₹{post.requiredAmount}
                    </p>
                    <p>
                      <strong>Collected:</strong> ₹
                      {post.currentDonationsReceived}
                    </p>
                    <p className="text-success fw-bold">✔ Fully Funded</p>

                    {post.status === "success" ? (
                      <p className="text-success fw-bold">
                        Transaction Successful
                      </p>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => handleOpenModal(post)}
                      >
                        Perform Transaction
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <TransactionModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          post={selectedPost}
          onTransactionSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
};

export default CompletedPosts;
