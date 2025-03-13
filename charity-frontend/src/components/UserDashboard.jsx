import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faFileAlt, faComments, faUser } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserNavbar from './UserNavbar';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  const fetchApprovedPosts = async () => {
    try {
      const response = await axios.post('http://localhost:3030/approvedposts');
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  const handleCharityPayment = (postId) => navigate(`/gameindex`);
  const handleCustomPayment = (postId) => navigate(`/makepayment/${postId}`);
  

  return (
    <div className="container-fluid">
      <UserNavbar />
      <div className="row">
        <div className="col-sm-3 bg-white text-dark p-3 min-vh-100 border-end">
          <ul className="nav flex-column">
            {[
              { href: "/userdashboard", icon: faHome, label: "HOME" },
              { href: "/gameindex", icon: faUsers, label: "GAME CORNER" },
              { href: "/paymenthistory", icon: faFileAlt, label: "PAYMENT HISTORY" },
              { href: "/leadership", icon: faUsers, label: "LEADERSHIP SCORES" },
              { href: "/review", icon: faComments, label: "POST A REVIEW" },
              { href: "/myprofile", icon: faUser, label: "MY PROFILE" }
            ].map((item, index) => (
              <li key={index} className="nav-item">
                <a className="nav-link text-dark fw-bold d-flex align-items-center border-bottom py-3 px-2" href={item.href}>
                  <FontAwesomeIcon icon={item.icon} className="me-2" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-sm-9">
          <h4><small>RECENT POSTS THAT NEED DONATIONS</small></h4>
          <hr />
          {posts
            .filter(post => post.currentDonationsReceived < post.requiredAmount)  // ✅ FILTER: Hide if target achieved
            .map((post) => (
              <div key={post._id} className="card mb-3 shadow-lg" style={{ borderRadius: "10px" }}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img 
                      src={`http://localhost:3030/${post.image}`} 
                      className="img-fluid rounded-start" 
                      alt={post.title} 
                      style={{ height: "250px", objectFit: "cover", borderRadius: "10px 0 0 10px" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title text-danger fw-bold">{post.title}</h5>
                      <p><strong>Name:</strong> {post.name}, {post.age} yrs</p>
                      <p><strong>Location:</strong> {post.location}</p>
                      <p><strong>Contact Number:</strong> {post.contact}</p>
                      <p><strong>Required:</strong> ₹{post.requiredAmount}</p>
                      <h6 className="text-secondary mt-2"><strong>BANK DETAILS</strong></h6>
                      <p><strong>Account:</strong> {post.accountName}</p>
                      <p><strong>Account No:</strong> {post.accountNo}</p>
                      <p><strong>IFSC:</strong> {post.ifsc}</p>
                      <p><strong>Bank:</strong> {post.bankName}</p>

                      <div className="progress mt-2">
  <div 
    className="progress-bar bg-success" 
    role="progressbar" 
    style={{ width: `${Math.round((post.currentDonationsReceived / post.requiredAmount) * 100)}%` }}
  >
    {Math.round((post.currentDonationsReceived / post.requiredAmount) * 100)}%
  </div>
</div>


                      {/* ✅ DISPLAY TARGET ACHIEVED IF 100% */}
                      {post.currentDonationsReceived >= post.requiredAmount ? (
                        <p className="text-center mt-2 text-success fw-bold">
                           Target Achieved! No More Donations Required.
                        </p>
                      ) : (
                        <p className="text-center mt-1">
  <strong>Collected:</strong> ₹{post.currentDonationsReceived.toFixed(2)} / ₹{post.requiredAmount}
</p>

                      )}
                      
                      {/* ✅ Hide Donate Buttons If Target Achieved */}
                      {post.currentDonationsReceived < post.requiredAmount && (
                        <div className="mt-2">
                          <button className="btn btn-primary me-2" onClick={() => handleCharityPayment(post._id)}> Donate ₹2</button>
                          <button className="btn btn-success" onClick={() => handleCustomPayment(post._id)}> Pay Custom</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

