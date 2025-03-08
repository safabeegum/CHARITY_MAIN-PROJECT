import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";

const MakePayment = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(""); // Default empty to show placeholder
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }
    navigate(`/paymentdetails/${method}/${amount}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to right, #f8f9fa, #eef2f3)" }}>
      <UserNavbar />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "65vh" }}>
        <div className="card p-4 shadow-lg border-0 rounded" style={{ width: "550px", backgroundColor: "white" }}>
          <h3 className="text-center mb-3 text-danger">Make a Payment</h3>
          <form onSubmit={handleNext} className="payment-form">
            <label className="fw-bold">Enter Amount (₹):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-control mb-3"
              required
            />

            <label className="fw-bold">Select Payment Method:</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="form-control mb-3">
  <option value="" disabled>----SELECT PAYMENT METHOD----</option>
  <option value="card">💳 Credit / Debit Card</option>
  <option value="upi">📲 UPI</option>
  <option value="bank">🏦 Bank Transfer</option>
</select>


            <button type="submit" className="btn btn-danger w-100">Next</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
