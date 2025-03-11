import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

const PendingPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Pending Posts on Page Load
    useEffect(() => {
        fetchPendingPosts();
    }, []);

    const fetchPendingPosts = async () => {
        try {
            // Fetch Posts Without Token (Fixed Now)
            const response = await axios.post('http://localhost:3030/pendingposts');
            setPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('❌ Failed to fetch pending posts', error);
            alert('❌ Failed to fetch pending posts');
        }
    };

    // Approve Post Function
    const handleApprove = async (postId) => {
        const email = sessionStorage.getItem('email');  // Get Admin Email From Session
        try {
            await axios.post('http://localhost:3030/approvepost', {
                postId,
                action: 'approve',
                email  // Send Admin Email
            });

            alert('✅ Post Approved Successfully!');
            fetchPendingPosts();  // Refresh Posts After Approval
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert('❌ You are not authorized to approve the post');
            } else {
                alert('❌ Failed to approve the post');
            }
        }
    };

    // Reject Post Function
    const handleReject = async (postId) => {
        const email = sessionStorage.getItem('email');  // Get Admin Email From Session
        const reason = prompt("❌ Enter the Reason for Rejection:");
        if (!reason) return alert('Rejection reason is required');

        try {
            await axios.post('http://localhost:3030/approvepost', {
                postId,
                action: 'reject',
                rejectionReason: reason,
                email  // Send Admin Email
            });

            alert('❌ Post Rejected Successfully!');
            fetchPendingPosts();  // Refresh Posts After Rejection
        } catch (error) {
            alert('❌ Failed to reject the post');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <AdminNavbar />
            <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>PENDING POSTS</h2>

            {loading ? (
                <h4 style={{ textAlign: 'center' }}>Loading...</h4>
            ) : posts.length === 0 ? (
                <h4 style={{ textAlign: 'center', color: 'gray' }}>No Pending Posts Available</h4>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px'
                }}>
                    {posts.map((post) => (
                        <div key={post._id} style={{
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            padding: '10px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            <img
                                src={`http://localhost:3030/${post.image}`}
                                alt={post.title}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '10px'
                                }}
                            />
                            <h4 style={{ margin: '5px 0', fontWeight: 'bold' }}>{post.title}</h4>
                            <p><strong>Description:</strong> {post.description}</p>
                            <p><strong>Name:</strong> {post.name}</p>
                            <p><strong>Age:</strong> {post.age}</p>
                            <p><strong>Location:</strong> {post.location}</p>
                            <p><strong>Contact:</strong> {post.contact}</p>
                            <p><strong>Purpose:</strong> {post.purpose}</p>
                            <p><strong>Required Amount:</strong> ₹{post.requiredAmount}</p>

                            <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>BANK DETAILS</h4>
                            <p><strong>Account Holder Name:</strong> {post.accountName}</p>
                            <p><strong>Account Number:</strong> {post.accountNo}</p>
                            <p><strong>Bank Name:</strong> {post.bankName}</p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                <button
                                    onClick={() => handleApprove(post._id)}
                                    style={{
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        padding: '5px 10px',
                                        border: 'none',
                                        borderRadius: '5px'
                                    }}
                                >
                                    ✅ Approve
                                </button>
                                <button
                                    onClick={() => handleReject(post._id)}
                                    style={{
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        padding: '5px 10px',
                                        border: 'none',
                                        borderRadius: '5px'
                                    }}
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingPosts;
