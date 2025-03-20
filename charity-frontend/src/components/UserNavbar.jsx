import React from "react";
import { useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <nav className="navbar navbar-expand-lg bg-tertiary">
              <div className="container-fluid">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/043/197/284/non_2x/logo-illustration-of-hands-holding-a-heart-representing-charity-and-support-vector.jpg"
                  alt="Logo"
                  width="140"
                  height="140"
                  className="d-inline-block align-text-top"
                />

                <a href="/userdashboard" className="btn btn-outline-warning">
                  USER DASHBOARD
                </a>

                <button className="btn btn-info ms-2" onClick={handleLogout}>
                  LOGOUT
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
