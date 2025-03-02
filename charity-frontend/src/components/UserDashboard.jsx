import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import UserNavbar from './UserNavbar';



const UserDashboard = () => {
  return (
<div className="container-fluid">
<UserNavbar/>
      <div className="row">
        {/* Sidebar */}
        <div className="col-sm-3 sidenav bg-light p-3">
          
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold " href="#home">HOME</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold " href="/gameindex">GAME CORNER</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#">MAKE PAYMENT</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#">VIEW TRANSACTIONS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#photos">POST A REVIEW</a>
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