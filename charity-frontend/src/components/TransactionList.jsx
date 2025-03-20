import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3030/transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-4">
        <h3 className="text-center fw-bold mb-4 text-primary">
          TRANSACTION LIST
        </h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Required Amount</th>
              <th>Account Name</th>
              <th>Account No</th>
              <th>IFSC</th>
              <th>Bank Name</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={index}>
                <td>₹{txn.requiredAmount}</td>
                <td>{txn.accountName}</td>
                <td>{txn.accountNo}</td>
                <td>{txn.ifsc}</td>
                <td>{txn.bankName}</td>
                <td className="text-success fw-bold">{txn.status}</td>
                <td>{new Date(txn.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
