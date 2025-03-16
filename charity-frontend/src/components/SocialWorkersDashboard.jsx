import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import SocialWorkersNavbar from "./SocialWorkersNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPlusCircle,
  faTasks,
  faFileAlt,
  faBullhorn,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";

const SocialWorkersDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialWorkerPosts();
  }, []);

  const fetchSocialWorkerPosts = async () => {
    const email = sessionStorage.getItem("email"); // Get logged-in social worker's email

    try {
      const response = await axios.post(
        "http://localhost:3030/getSocialWorkerPosts",
        { email }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch posts", error);
      alert("❌ Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <SocialWorkersNavbar />
      <div className="row">
        {/* Sidebar */}
        <div className="col-sm-3 bg-white text-dark p-3 min-vh-100 border-end">
          <ul className="nav flex-column">
            {[
              { href: "/", icon: faHome, label: "HOME" },
              { href: "/addpost", icon: faPlusCircle, label: "ADD POSTS" },
              { href: "/manageposts", icon: faTasks, label: "MANAGE POSTS" },
              { href: "/viewreports", icon: faFileAlt, label: "VIEW REPORTS" },
              { href: "/announcements", icon: faBullhorn , label: "COMMUNITY ANNOUNCEMENT" },
              { href: "/emergency", icon: faExclamationTriangle , label: "EMERGENCY ALERT" },
            ].map((item, index) => (
              <li key={index} className="nav-item">
                <a
                  className="nav-link text-dark fw-bold d-flex align-items-center border-bottom py-3 px-2"
                  href={item.href}
                  style={{ transition: "background 0.3s ease-in-out" }}
                >
                  <FontAwesomeIcon icon={item.icon} className="me-2" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-sm-9 p-4">
        <h4><small>RECENT POSTS</small></h4>
          <hr />

          {loading ? (
            <h5>Loading...</h5>
          ) : posts.length === 0 ? (
            <h5>No posts found.</h5>
          ) : (
            <div className="row">
              {posts.map((post) => {
                const isCompleted =
                  Number(post.currentDonationsReceived) >=
                  Number(post.requiredAmount);

                return (
                  <div key={post._id} className="col-md-4 mb-4">
                    <div className="card shadow-sm border-0 rounded">
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{post.title}</h5>
                        <p className="mb-1">
                          <strong>Name:</strong> {post.name}
                        </p>
                        <p className="mb-1">
                          <strong>Required:</strong> ₹{post.requiredAmount}
                        </p>
                        <p className="mb-1">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`badge ${
                              isCompleted
                                ? "bg-primary"
                                : post.status === "approved"
                                ? "bg-success"
                                : post.status === "Rejected"
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                          >
                            {isCompleted ? "completed" : post.status}
                          </span>
                        </p>
                        <p>
                          <strong>Collected:</strong> ₹
                          {Number(post.currentDonationsReceived).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialWorkersDashboard;


