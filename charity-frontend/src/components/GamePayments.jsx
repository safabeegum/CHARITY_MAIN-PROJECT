import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container } from "react-bootstrap";
import AdminNavbar from "./AdminNavbar";

const GamePayments = () => {
    const [gamedonation, setPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get("http://localhost:3030/gamepayments");
            setPayments(response.data);
        } catch (error) {
            console.error("❌ Failed to fetch payments", error);
        }
    };

    return (
        <div>
            <AdminNavbar/> 
        <Container className="mt-4">
            <h3 className="text-center fw-bold mb-4">GAME PAYMENTS</h3>
            <Table striped bordered hover>
                <thead className="bg-primary text-white">
                    <tr>
                        <th>#</th>
                        <th>User ID</th>
                        <th>Amount (₹)</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {gamedonation.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">No payments found</td>
                        </tr>
                    ) : (
                        gamedonation.map((gamedonation, index) => (
                            <tr key={gamedonation._id}>
                                <td>{index + 1}</td>
                                <td>{gamedonation.userId}</td>
                                <td>₹{gamedonation.amount}</td>
                                <td>{gamedonation.method}</td>
                                <td className={gamedonation.status === "pending" ? "text-warning" : "text-success"}>
                                    {gamedonation.status}
                                </td>
                                <td>{new Date(gamedonation.createdAt).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </Container>
        </div>
    );
};

export default GamePayments;
