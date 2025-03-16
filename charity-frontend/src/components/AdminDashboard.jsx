import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faHandsHelping, faHourglassHalf, faCheckCircle, 
         faTimesCircle, faHandHoldingHeart, faGamepad, faMoneyCheckAlt, faComments, faGift, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    socialWorkers: 0,
    reports: 0,
    feedback: 0,
  });

  const [userActivity, setUserActivity] = useState([]);
  const [transactionActivity, setTransactionActivity] = useState([]);

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
        const response = await axios.post('http://localhost:3030/api/useractivity');
        setUserActivity(response.data);
      } catch (error) {
        console.error("Error fetching user activity:", error);
      }
    };

    const fetchTransactionActivity = async () => {
      try {
        const response = await axios.post('http://localhost:3030/api/transactionactivity');
        setTransactionActivity(response.data);
      } catch (error) {
        console.error("Error fetching transaction activity:", error);
      }
    };

    fetchStats();
    fetchUserActivity();
    fetchTransactionActivity();
  }, []);

  // Format date for better readability
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // User Activity Line Chart Data
  const userChartData = {
    labels: userActivity.map((data) => formatDate(data.date)),
    datasets: [
      {
        label: 'New Users Registered',
        data: userActivity.map((data) => data.count),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
      },
    ],
  };
  
   // Transaction Bar Chart Data
  const transactionChartData = {
    labels: transactionActivity.map((data) => formatDate(data.date)),
    datasets: [
      {
        label: 'Total Transactions (Last 7 Days)',
        data: transactionActivity.map((data) => data.totalAmount),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 2,
      },
    ],
  };
  

 

  return (
    <div className="container-fluid">
      <AdminNavbar />

      <div className="row">
        {/* Sidebar */}
        <div className="col-sm-3 bg-white text-dark p-3 min-vh-100 border-end">
          <ul className="nav flex-column">
            {[
              { href: "/admindashboard", icon: faHome, label: "HOME" },
              { href: "/manageusers", icon: faUsers, label: "MANAGE USERS" },
              { href: "/managesocialworkers", icon: faHandsHelping, label: "MANAGE SOCIAL WORKERS" },
              { href: "/pendingposts", icon: faHourglassHalf, label: "PENDING POSTS" },
              { href: "/approvedposts", icon: faCheckCircle, label: "APPROVED POSTS" },
              { href: "/rejectedposts", icon: faTimesCircle, label: "REJECTED POSTS" },
              { href: "/donations", icon: faHandHoldingHeart, label: "MANAGE DONATIONS" },
              { href: "/gamepayments", icon: faGamepad, label: "MANAGE GAME FUNDS" },
              { href: "/completedposts", icon: faMoneyCheckAlt, label: "MANAGE TRANSACTIONS" },
              { href: "/rewardslist", icon: faGift, label: "MANAGE REWARDS" },
              { href: "/adminreport", icon: faChartLine, label: "REPORTS AND ANALYTICS" },
              { href: "/managereview", icon: faComments, label: "MANAGE REVIEWS" }
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
            <div className="col-md-7">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">User Activity (Last 7 Days)</h5>
                  {userActivity.length > 0 ? <Line data={userChartData} /> : <p>No Data Available</p>}
                </div>
              </div>
            </div>

            {/* Transaction Chart (Bigger) */}
            <div className="col-md-5">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Transaction Overview</h5>
                  {transactionActivity.length > 0 ? <Bar data={transactionChartData} /> : <p>No Data Available</p>}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


