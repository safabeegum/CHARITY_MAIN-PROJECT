import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container } from "react-bootstrap";
import AdminNavbar from "./AdminNavbar";

const Donations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://localhost:3030/donations");
      setDonations(response.data);
    } catch (error) {
      console.error("Failed to fetch donations", error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <Container className="mt-4">
        <h3 className="text-center fw-bold mb-4">DONATION LIST</h3>
        <Table striped bordered hover>
          <thead className="bg-success text-white">
            <tr>
              <th>#</th>
              <th>Donor Name</th>
              <th>Email</th>
              <th>Post ID</th>
              <th>Amount (₹)</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No donations found
                </td>
              </tr>
            ) : (
              donations.map((donation, index) => (
                <tr key={donation._id}>
                  <td>{index + 1}</td>
                  <td>{donation.userId?.name || "Unknown"}</td>
                  <td>{donation.userId?.email || "No Email"}</td>
                  <td>{donation.postId?._id || "Unknown Post ID"}</td> {}
                  <td>₹{donation.amount}</td>
                  <td>{donation.method}</td>
                  <td
                    className={
                      donation.status === "pending"
                        ? "text-warning"
                        : "text-success"
                    }
                  >
                    {donation.status}
                  </td>
                  <td>{new Date(donation.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default Donations;
