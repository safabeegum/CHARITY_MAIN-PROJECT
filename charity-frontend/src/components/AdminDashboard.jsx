import React from 'react'
import AdminNavbar from './AdminNavbar'
import 'bootstrap/dist/css/bootstrap.min.css';



const AdminDashboard = () => {
  return (
<div className="container-fluid">
<AdminNavbar/>
      <div className="row">
        {/* Sidebar */}
        <div className="col-sm-3 sidenav bg-light p-3">
          
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold " href="#home">HOME</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#friends">MANAGE USERS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#family">MANAGE CHARITY ORGANIZATIONS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark fw-bold" href="#photos">VIEW REPORTS</a>
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

export default AdminDashboard