import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const ApprovedPost = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3030/approvedposts")
            .then(response => setPosts(response.data))
            .catch(error => console.error("Error fetching posts:", error));
    }, []);

    return (
        <div>
            <AdminNavbar />
            <div className="container mt-4">
                <h3 className="text-center fw-bold mb-4">APPROVED POSTS</h3>
                {posts.length === 0 ? (
                    <p className="text-center">No approved posts available.</p>
                ) : (
                    <div className="row">
                        {posts.map((post, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <p className="card-text">NAME: {post.name}</p>
                                        <p><strong>Required:</strong> ${post.requiredAmount}</p>
                                        <p><strong>Collected:</strong> ${post.currentDonationsReceived}</p>
                                        <button className="btn btn-primary">View Details</button>
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

export default ApprovedPost;
