import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faHandsHelping, faHourglassHalf, faCheckCircle, 
         faTimesCircle, faHandHoldingHeart, faGamepad, faMoneyCheckAlt, faComments } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    socialWorkers: 0,
    reports: 0,
    feedback: 0,
  });

  const [userActivity, setUserActivity] = useState([]);
  const [socialWorkerActivity, setSocialWorkerActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.post('http://localhost:3030/api/admindashboard');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    const fetchUserActivity = async () => {
      try {
        const response = await axios.post('http://localhost:3030/api/useractivity'); // Replace with actual API
        setUserActivity(response.data);
      } catch (error) {
        console.error("Error fetching user activity:", error);
      }
    };



    const fetchSocialWorkerActivity = async () => {
      try {
        const response = await axios.post('http://localhost:3030/api/socialworkeractivity');
        setSocialWorkerActivity(response.data);
      } catch (error) {
        console.error("Error fetching social worker activity:", error);
      }
    };

    fetchStats();
    fetchUserActivity();
    fetchSocialWorkerActivity();
  }, []);

  // User Activity Chart Data
  const userChartData = {
    labels: userActivity.map((data) => data.date),
    datasets: [
      {
        label: 'New Users Registered',
        data: userActivity.map((data) => data.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  // Social Worker Activity Chart Data
  const socialWorkerChartData = {
    labels: socialWorkerActivity.map((data) => data.date),
    datasets: [
      {
        label: 'New Social Workers Registered',
        data: socialWorkerActivity.map((data) => data.count),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="container-fluid">
      <AdminNavbar />

      <div className="row">
        {/* Sidebar with updated icons */}
        <div className="col-sm-3 bg-white text-dark p-3 min-vh-100 border-end">
          <ul className="nav flex-column">
            {[
              { href: "/admindashboard", icon: faHome, label: "Home" },
              { href: "/manageusers", icon: faUsers, label: "Manage Users" },
              { href: "/managesocialworkers", icon: faHandsHelping, label: "Manage Social Workers" },
              { href: "/pendingposts", icon: faHourglassHalf, label: "Pending Posts" },
              { href: "/approvedposts", icon: faCheckCircle, label: "Approved Posts" },
              { href: "/rejectedposts", icon: faTimesCircle, label: "Rejected Posts" },
              { href: "/managedonations", icon: faHandHoldingHeart, label: "Manage Donations" },
              { href: "/managegamefunds", icon: faGamepad, label: "Manage Game Funds" },
              { href: "/managetransactions", icon: faMoneyCheckAlt, label: "Manage Transactions" },
              { href: "/managereview", icon: faComments, label: "Manage Reports" }
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
          <h4><small>RECENT ACTIVITY</small></h4>
          <hr />

          {/* Dashboard Overview Section */}
          <div className="row">
            {[
              { title: "Users", value: stats.users, color: "bg-primary", desc: "Active Users" },
              { title: "Charity Organizations", value: stats.socialWorkers, color: "bg-success", desc: "Total Registered" },
              { title: "Pending Approvals", value: stats.pendingApprovals, color: "bg-warning", desc: "Pending Approval" },
              { title: "Donations", value: stats.donation, color: "bg-danger", desc: "Successful Donations" }
            ].map((card, index) => (
              <div key={index} className="col-md-3">
                <div className={`card text-white ${card.color} mb-3`}>
                  <div className="card-body">
                    <h5 className="card-title">{card.title}</h5>
                    <h3>{card.value}</h3>
                    <p>{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">User Activity (Last 7 Days)</h5>
                  {userActivity.length > 0 ? (
                    <Line data={userChartData} />
                  ) : (
                    <div style={{ height: "200px", background: "#f0f0f0", textAlign: "center", lineHeight: "200px" }}>
                      No Data Available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* New Chart (Social Worker Registrations) */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Transaction Details</h5>
                  {socialWorkerActivity.length > 0 ? (
                    <Line data={socialWorkerChartData} />
                  ) : (
                    <div style={{ height: "200px", background: "#f0f0f0", textAlign: "center", lineHeight: "200px" }}>
                      No Data Available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div> {/* End of Charts Section */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
