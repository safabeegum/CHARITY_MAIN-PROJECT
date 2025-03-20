import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#28a745",
  "#17a2b8",
  "#ffc107",
  "#dc3545",
  "#6f42c1",
  "#fd7e14",
];

const AdminReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await fetch("http://localhost:3030/adminreport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.status !== 200) {
        setError("Failed to fetch report.");
        setLoading(false);
        return;
      }

      setReport(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-4">
        <h3 className="text-center fw-bold mb-4 text-secondary">
          ADMIN REPORT
        </h3>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        {report && (
          <>
            {/* Small Info Boxes */}
            <div className="row">
              {[
                {
                  title: "TOTAL DONATIONS",
                  value: report?.totalDonations ?? 0,
                  bg: "bg-success",
                },
                {
                  title: "TOTAL GAME FUNDS",
                  value: report?.totalGameFunds ?? 0,
                  bg: "bg-info",
                },
                {
                  title: "TOTAL TRANSACTIONS",
                  value: report?.totalTransactions ?? 0,
                  bg: "bg-warning",
                },
                {
                  title: "TOTAL REWARDS",
                  value: report?.totalRewards ?? 0,
                  bg: "bg-danger",
                },
                {
                  title: "WALLET AMOUNT",
                  value: report?.walletAmount ?? 0,
                  bg: "bg-primary",
                },
                {
                  title: "PLATFORM EARNINGS",
                  value: report?.platformEarnings ?? 0,
                  bg: "bg-dark",
                },
              ].map((box, index) => (
                <div key={index} className="col-md-4 col-lg-2 mb-3">
                  <div className={`card text-white ${box.bg} text-center`}>
                    <div className="card-header">{box.title}</div>
                    <div className="card-body">
                      <h5 className="card-title">₹{box.value.toFixed(2)}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="row mt-4">
              {/* Pie Chart for Donations vs Game Funds */}
              <div className="col-md-6">
                <h5 className="text-center">Donations vs Game Funds</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Donations", value: report.totalDonations },
                        { name: "Game Funds", value: report.totalGameFunds },
                      ]}
                      dataKey="value"
                      outerRadius={100}
                      label={({ name, value }) =>
                        `${name}: ₹${value.toFixed(2)}`
                      }
                      labelLine={true}
                    >
                      {COLORS.slice(0, 2).map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart for Funds vs Transactions */}
              <div className="col-md-6">
                <h5 className="text-center">Funds vs Transactions</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        name: "Total Funds",
                        funds: report.totalGameFunds + report.totalDonations,
                      },
                      {
                        name: "Transactions",
                        transactions: report.totalTransactions,
                      },
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="funds" fill="#28a745" />
                    <Bar dataKey="transactions" fill="#ffc107" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReport;
