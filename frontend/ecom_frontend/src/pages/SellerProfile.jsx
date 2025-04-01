import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SellerProfile() {
  const { seller_id } = useParams();
  const [sellerData, setSellerData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/seller/${seller_id}/profile`);
        setSellerData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch seller data");
      }
    };

    if (seller_id) fetchSeller();
  }, [seller_id]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!sellerData) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ffe5dc]">
      <div className="p-8 rounded-lg shadow-lg w-96" style={{ backgroundColor: "#990011", color: "#FCF6F5" }}>
        <h2 className="text-2xl font-bold text-center mb-6">Seller Profile</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Seller ID:</p>
            <p>{sellerData.seller_id}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{sellerData.seller_email}</p>
          </div>
          <div>
            <p className="font-semibold">Name:</p>
            <p>{sellerData.name || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Mobile Number:</p>
            <p>{sellerData.mobile}</p>
          </div>
          <div>
            <p className="font-semibold">Address:</p>
            <p>{sellerData.address_line_1}, {sellerData.address_line_2}</p>
            <p>{sellerData.city}, {sellerData.state} - {sellerData.pincode}</p>
          </div>
          <div className="space-y-2 mt-4">
            <button className="btn w-full bg-[#FCF6F5] text-[#990011] hover:font-bold">Change Password</button>
            <button className="btn w-full bg-[#FCF6F5] text-[#990011] hover:font-bold">Add Product</button>
            <button className="btn w-full bg-gray-500 text-white hover:font-bold">Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}