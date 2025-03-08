import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faHandsHelping, faFileAlt, faComments } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserNavbar from './UserNavbar';



const UserDashboard = () => {
  return (
<div className="container-fluid">
<UserNavbar/>

<div className="row">
        {/* Sidebar with updated UI */}
        <div className="col-sm-3 bg-white text-dark p-3 min-vh-100 border-end">
          <ul className="nav flex-column">
            {[
              { href: "/userdashboard", icon: faHome, label: "HOME" },
              { href: "/gameindex", icon: faUsers, label: "GAME CORNER" },
              { href: "/makepayment", icon: faHandsHelping, label: "MAKE PAYMENT" },
              { href: "/viewreports", icon: faFileAlt, label: "VIEW TRANSACTIONS" },
              { href: "/review", icon: faComments, label: "POST A REVIEW" },
              { href: "/myprofile", icon: faComments, label: "MY PROFILE" }
            ].map((item, index) => (
              <li key={index} className="nav-item">
                <a className="nav-link text-dark fw-bold d-flex align-items-center border-bottom py-3 px-2" href={item.href}
                  style={{ transition: "background 0.3s ease-in-out" }}>
                  <FontAwesomeIcon icon={item.icon} className="me-2" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
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