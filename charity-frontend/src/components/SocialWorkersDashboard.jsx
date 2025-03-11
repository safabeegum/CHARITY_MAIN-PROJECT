import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SocialWorkersNavbar from './SocialWorkersNavbar';

const SocialWorkersDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialWorkerPosts();
  }, []);

  const fetchSocialWorkerPosts = async () => {
    const email = sessionStorage.getItem('email'); // Get logged-in social worker's email (or other identifier)

    try {
      const response = await axios.post('http://localhost:3030/getSocialWorkerPosts', { email });
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Failed to fetch posts', error);
      alert('❌ Failed to fetch posts');
    }
  };

  return (
    <div className="container-fluid">
      <SocialWorkersNavbar />
      <div className="row">
        {/* Sidebar */}
        <div className="col-sm-3 sidenav bg-light p-3">
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="/">HOME</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="/addpost">ADD POSTS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#">MANAGE POSTS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#photos">VIEW REPORTS</a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-sm-9">
          <h4><small>RECENT POSTS</small></h4>
          <hr />

          {loading ? (
            <h5>Loading...</h5>
          ) : posts.length === 0 ? (
            <h5>No posts found.</h5>
          ) : (
            <div className="row">
              {posts.map((post) => (
                <div key={post._id} className="col-sm-4 mb-3">
                  <div className="card">
                    <img className="card-img-top" src={`http://localhost:3030/${post.image}`} alt={post.title} />
                    <div className="card-body">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text">{post.name}</p>
                      <p className="card-text">{post.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialWorkersDashboard;
