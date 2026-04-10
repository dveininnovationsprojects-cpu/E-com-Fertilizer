import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) { setLoading(false); return; }
        const res = await API.get(`/orders/${user._id}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-section" style={{ margin: "40px", borderRadius: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", cursor: "pointer", color: "#79A206", fontSize: "1.2rem" }}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h3 style={{ margin: 0 }}>Order History</h3>
      </div>
      {loading ? <p style={{ color: "#888" }}>Loading orders...</p>
        : orders.length === 0 ? <p style={{ color: "#888" }}>No orders found.</p>
        : (
          <table className="orders-table">
            <thead><tr><th>Order ID</th><th>Date</th><th>Item</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id || o.id}>
                  <td>{o._id || o.id}</td>
                  <td>{new Date(o.createdAt || o.date).toLocaleDateString()}</td>
                  <td>{o.item || o.productName}</td>
                  <td>₹{o.amount || o.totalAmount}</td>
                  <td><span className={`order-status ${(o.status || "").toLowerCase()}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};

export default OrderHistory;
