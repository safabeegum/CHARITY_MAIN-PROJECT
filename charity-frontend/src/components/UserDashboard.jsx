import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';



const UserDashboard = () => {
  return (
<div className="container-fluid">
<SocialWorkersNavbar/>
      <div className="row">
        {/* Sidebar */}
        <div className="col-sm-3 sidenav bg-light p-3">
          
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold " href="#home">HOME</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#">CHANGE PASSWORD</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#">MANAGE POSTS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#photos">EDIT PROFILE</a>
            </li>
          </ul>
          <br />
        </div>

        {/* Main Content */}
        <div className="col-sm-9">
          <h4><small>RECENT POSTS</small></h4>
          <hr />
          


        </div>
      </div>

      
    </div>
  );
};

export default UserDashboard