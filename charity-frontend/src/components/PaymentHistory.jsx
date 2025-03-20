import axios from "axios";
import React, { useEffect, useState } from "react";
import UserNavbar from "./UserNavbar";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.log("No token found! Redirecting to login...");
      setError("Authentication failed. Please log in again.");
      return;
    }

    console.log("Token being sent:", token);

    axios
      .post(
        "http://localhost:3030/getuserpayment",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Response Data:", response.data);
        if (Array.isArray(response.data)) {
          setPayments(response.data);
        } else {
          setError(response.data.status || "Unexpected response from server");
        }
      })
      .catch((error) => {
        console.error("Axios Error:", error.response?.data || error.message);
        setError("Error fetching payment history. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const downloadReceipt = (paymentId) => {
    const token = sessionStorage.getItem("token");

    axios
      .post(
        "http://localhost:3030/downloadreceipt",
        { paymentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "blob", // 👈 Important for downloading PDF
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Receipt_${paymentId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("Error downloading receipt:", error);
        alert("Failed to download receipt. Please try again later.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="container">
        <UserNavbar />
        <div className="row">
          <div className="col col-12">
            <h4 className="text-center my-3">PAYMENT HISTORY </h4>

            {/* SHOW LOADING STATE */}
            {loading ? (
              <div className="text-center my-5">
                <h5>⏳ Loading Payment History...</h5>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <table className="table table-bordered table-striped">
                <thead className="table-dark text-center">
                  <tr>
                    <th scope="col">TRANSACTION ID</th>
                    <th scope="col">AMOUNT</th>
                    <th scope="col">METHOD</th>
                    <th scope="col">STATUS</th>
                    <th scope="col">DATE & TIME</th>
                    <th scope="col">DOWNLOAD RECEIPT</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment._id}</td>
                        <td>
                          <b>₹{payment.amount}</b>
                        </td>
                        <td>{payment.method}</td>
                        <td>
                          <span
                            className={`badge ${
                              payment.status === "success"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {payment.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{new Date(payment.createdAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => downloadReceipt(payment._id)}
                          >
                            📄 Download PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No payment history found.
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

export default PaymentHistory;
