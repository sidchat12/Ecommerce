import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetails = () => {
  const { user_id, order_id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${user_id}/${order_id}`);
        setOrderDetails(response.data.result);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user_id, order_id]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#FCF6F5" }}>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="max-w-3xl mx-auto shadow-lg rounded-lg overflow-hidden p-6" style={{ backgroundColor: "#990011", color: "#FCF6F5" }}>
          <h1 className="text-2xl font-bold mb-4">Order Details</h1>
          <img className="h-48 w-full object-cover" src={orderDetails.photo} alt={orderDetails.product_title} />
          <p className="mt-4 text-lg font-semibold">{orderDetails.product_title}</p>
          <p>Price: ₹{orderDetails.price}</p>
          <h2 className="mt-6 text-lg font-semibold">Shipping Address</h2>
          <p>{orderDetails.address_line_1}, {orderDetails.address_line_2}</p>
          <p>{orderDetails.city}, {orderDetails.state} - {orderDetails.pincode}</p>
          <h2 className="mt-6 text-lg font-semibold">Ordered By</h2>
          <p>{orderDetails.user_name}</p>
          <button 
            className="mt-6 px-4 py-2 rounded text-white" 
            style={{ backgroundColor: "#FCF6F5", color: "#990011" }} 
            onClick={() => navigate(`/user/${user_id}/profile`)}
          >
            Back to Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;