import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';

const ManageUsers = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const fetchData = () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.log("No token found! Redirecting to login...");
      setError("Authentication failed. Please log in again.");
      return;
    }

    console.log("🔹 Token being sent:", token); // Debugging step

    axios
      .post(
        'http://localhost:3030/manageusers',
        {},
        {
          headers: { token, 'Content-Type': 'application/json' },
        }
      )
      .then((response) => {
        console.log("Response Data:", response.data);
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setError(response.data.status || "Unexpected response from server");
        }
      })
      .catch((error) => {
        console.error("Axios Error:", error.response?.data || error.message);
        setError("Error fetching users. Please try again later.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

 
  return (
    <div>
      <div className="container">
        <AdminNavbar/>
        <div className="row">
          <div className="col col-12">
            <h2 className="text-center my-3">MANAGE USERS</h2>
            {error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">NAME</th>
                    <th scope="col">USERNAME</th>
                    <th scope="col">ADDRESS</th>
                    <th scope="col">EMAIL</th>
                    <th scope="col">PHONE NUMBER</th>
                    <th scope="col">WARD NUMBER</th>
                    <th scope="col">WARD NAME</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((value, index) => (
                      <tr key={index}>
                        <td>{value.name}</td>
                        <td>{value.username}</td>
                        <td>{value.address}</td>
                        <td>{value.email}</td>
                        <td>{value.phone}</td>
                        <td>{value.ward_no}</td>
                        <td>{value.ward_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No users found or authentication failed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
