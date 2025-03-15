import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const PendingPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingPosts();
    }, []);

    const fetchPendingPosts = async () => {
        try {
            const response = await axios.post("http://localhost:3030/pendingposts");
            setPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("❌ Failed to fetch pending posts", error);
            alert("❌ Failed to fetch pending posts");
        }
    };

    const handleApprove = async (postId) => {
        const email = sessionStorage.getItem("email");
        try {
            await axios.post("http://localhost:3030/approvepost", {
                postId,
                action: "approve",
                email,
            });

            alert("✅ Post Approved Successfully!");
            fetchPendingPosts();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert("❌ You are not authorized to approve the post");
            } else {
                alert("❌ Failed to approve the post");
            }
        }
    };

    const handleReject = async (postId) => {
        const email = sessionStorage.getItem("email");
        const reason = prompt("❌ Enter the Reason for Rejection:");
        if (!reason) return alert("Rejection reason is required");

        try {
            await axios.post("http://localhost:3030/approvepost", {
                postId,
                action: "reject",
                rejectionReason: reason,
                email,
            });

            alert("❌ Post Rejected Successfully!");
            fetchPendingPosts();
        } catch (error) {
            alert("❌ Failed to reject the post");
        }
    };

    return (
        <div>
            <AdminNavbar />
            <Container className="mt-4">
            <h3 className="text-center fw-bold mb-4">PENDING POSTS</h3>

                {loading ? (
                    <h4 className="text-center">Loading...</h4>
                ) : posts.length === 0 ? (
                    <h4 className="text-center text-muted">No Pending Posts Available</h4>
                ) : (
                    <Row>
                        {posts.map((post) => (
                            <Col key={post._id} md={4} className="mb-4">
                                <Card className="shadow-sm border-light">
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:3030/${post.image}`}
                                        alt={post.title}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <Card.Body>
                                        <Card.Title className="text-primary">{post.title}</Card.Title>
                                        <Card.Text>
                                            <strong>DESCRIPTION:</strong> {post.description} <br />
                                            <strong>NAME:</strong> {post.name} <br />
                                            <strong>AGE:</strong> {post.age} <br />
                                            <strong>LOCATION:</strong> {post.location} <br />
                                            <strong>CONTACT:</strong> {post.contact} <br />
                                            <strong>PURPOSE:</strong> {post.purpose} <br />
                                            <strong>REQUIRED AMOUNT:</strong> ₹{post.requiredAmount}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="bg-white">
                                        <h6 className="text-center fw-bold">BANK DETAILS</h6>
                                        <p className="mb-1"><strong>ACCOUNT HOLDER:</strong> {post.accountName}</p>
                                        <p className="mb-1"><strong>ACCOUNT NUMBER:</strong> {post.accountNo}</p>
                                        <p className="mb-1"><strong>IFSC CODE:</strong> {post.ifsc}</p>
                                        <p><strong>BANK NAME:</strong> {post.bankName}</p>

                                        <div className="d-flex justify-content-around mt-2">
                                            <Button variant="success" onClick={() => handleApprove(post._id)}>
                                                APPROVE
                                            </Button>
                                            <Button variant="danger" onClick={() => handleReject(post._id)}>
                                                REJECT
                                            </Button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default PendingPosts;
