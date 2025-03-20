import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UserNavbar from "./UserNavbar";

const PaymentDetails = () => {
  const { method, amount, postId } = useParams();
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3030/makepayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          postId: postId,
          amount: amount,
          method: method,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        sessionStorage.clear();
        window.location.href = "/login";
        return;
      }

      if (result.status !== "Success") {
        alert("Payment initiation failed. Please try again.");
        return;
      }

      const paymentId = result.paymentId;
      if (!paymentId) {
        alert("Payment ID not received. Payment failed!");
        return;
      }

      const processResponse = await fetch(
        "http://localhost:3030/processpayment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ paymentId: paymentId }),
        }
      );

      const processResult = await processResponse.json();

      if (processResult.status !== "Success") {
        alert("Payment processing failed. Please try again.");
        return;
      }
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        setFormData({
          cardHolder: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          upiId: "",
          accountNumber: "",
          ifscCode: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Payment Error:", error);
      alert("An error occurred while processing your payment.");
    }
  };

  return (
    <div>
      <UserNavbar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="card p-4 shadow" style={{ width: "600px" }}>
          <h3 className="text-center fw-bold text-success">
            Enter Payment Details
          </h3>
          <p className="text-center fw-bold text-danger">Amount: ₹{amount}</p>

          {/*Payment Form */}
          <form onSubmit={handleSubmit} className="payment-form">
            {method === "card" && (
              <>
                <label className="fw-bold">Card Holder Name:</label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="Enter your Name"
                  required
                />

                <label className="fw-bold">Card Number:</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="0000 0000 0000 0000"
                  required
                />

                <label className="fw-bold">Expiry Date:</label>
                <input
                  type="month"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  required
                />

                <label className="fw-bold">CVV:</label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="***"
                  required
                />
              </>
            )}

            {method === "upi" && (
              <>
                <label className="fw-bold">UPI ID:</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="yourupi@bank"
                  required
                />
              </>
            )}

            {method === "bank" && (
              <>
                <label className="fw-bold">Account Number:</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="1234567890"
                  required
                />

                <label className="fw-bold">IFSC Code:</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="ABCD0123456"
                  required
                />
              </>
            )}

            {/* Submit Payment */}
            <button type="submit" className="btn btn-success w-100">
              Pay Now
            </button>
          </form>
        </div>
      </div>

      {/*Modal Confirmation */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-success">Payment Successful</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p className="fw-bold">
                  Your payment of ₹{amount} via {method.toUpperCase()} was
                  successful!
                </p>
                <p className="text-muted">
                  Thank you for supporting this cause.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => setShowModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
