import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

const TransactionModal = ({
  show,
  handleClose,
  post,
  onTransactionSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);

  const handleTransaction = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3030/transaction", {
        postId: post._id,
        amount: post.currentDonationsReceived,
        accountName: post.accountName,
        accountNo: post.accountNo,
        bankName: post.bankName,
        ifsc: post.ifsc,
      });

      setTransactionStatus("Transaction Successful!");
      alert(response.data.message);

      setTimeout(() => {
        onTransactionSuccess(post._id);
        handleClose();
      }, 1000);
    } catch (error) {
      console.error("Transaction Failed", error);
      setTransactionStatus("Transaction Failed!");
    }
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Account Name:</strong> {post.accountName}
        </p>
        <p>
          <strong>Account Number:</strong> {post.accountNo}
        </p>
        <p>
          <strong>Bank Name:</strong> {post.bankName}
        </p>
        <p>
          <strong>IFSC Code:</strong> {post.ifsc}
        </p>
        <p>
          <strong>Amount:</strong> ₹{post.currentDonationsReceived}
        </p>
        {transactionStatus && <p className="fw-bold">{transactionStatus}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleTransaction}
          disabled={loading || transactionStatus === "Transaction Successful!"}
        >
          {loading ? "Processing..." : "Confirm Transfer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionModal;
