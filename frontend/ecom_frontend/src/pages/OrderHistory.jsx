import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const OrderHistory = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${user_id}/history`);
        setOrders(response.data.result);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user_id]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#FCF6F5" }}>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6" style={{ color: "#990011" }}>
          <h1 className="text-2xl font-bold mb-4">Order History</h1>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Purchase Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border">
                  <td className="border p-2 text-blue-600">
                    <Link to={`/user/${user_id}/${order.order_id}`} className="hover:underline">{order.order_id}</Link>
                  </td>
                  <td className="border p-2">{order.product_title}</td>
                  <td className="border p-2">₹{order.price}</td>
                  <td className="border p-2">{order.purchase_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            className="mt-6 px-4 py-2 rounded text-white" 
            style={{ backgroundColor: "#990011", color: "#FCF6F5" }} 
            onClick={() => navigate(`/user/${user_id}/profile`)}
          >
            Back to Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
