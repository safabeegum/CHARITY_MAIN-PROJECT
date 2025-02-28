import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

const ManageSocialWorkers = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState({
    org_name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
  });

  // Function to generate a random 4-character password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 4; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Handle Input Change
  const inputHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  // Open Modal and Generate Password
  const openModal = () => {
    setInput({
      org_name: "",
      email: "",
      address: "",
      phone: "",
      password: generatePassword(),
    });
    setIsModalOpen(true);
  };

  // Handle Form Submission
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3030/managesocialworkers", input)
      .then((response) => {
        if (response.data.status === "Success") {
          alert("Successfully Registered!");
          setIsModalOpen(false);
          fetchData();
        } else {
          alert(response.data.status || "Registration failed!");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  };

  // Fetch Data from Server
  const fetchData = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.log("No token found! Redirecting to login...");
      setError("Authentication failed. Please log in again.");
      return;
    }

    axios
      .post(
        "http://localhost:3030/retrievesocialworkers",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
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
    <div className="container">
      <AdminNavbar />
      <h4 className="text-center my-3">MANAGE SOCIAL WORKERS</h4>

      {/* Button to Open Modal */}
      <button className="btn btn-outline-primary" onClick={openModal}>
        + ADD SOCIAL WORKERS
      </button>
    <br></br>
      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              width: "600px",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Add Social Workers</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Organization Name"
                name="org_name"
                value={input.org_name}
                onChange={inputHandler}
                required
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={input.email}
                onChange={inputHandler}
                required
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                value={input.address}
                onChange={inputHandler}
                required
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                value={input.phone}
                onChange={inputHandler}
                required
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              <input
                type="text"
                placeholder="Password"
                name="password"
                value={input.password}
                readOnly
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: "purple",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: "green",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <br />

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADDRESS</th>
              <th>PHONE NUMBER</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((value, index) => (
                <tr key={index}>
                  <td>{value._id}</td>
                  <td>{value.org_name}</td>
                  <td>{value.email}</td>
                  <td>{value.address}</td>
                  <td>{value.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No organizations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageSocialWorkers;
