import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const { user_id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${user_id}/profile`);
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
      }
    };

    if (user_id) fetchUser();
  }, [user_id]);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!userData) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ffe5dc]">
      <div className="p-8 rounded-lg shadow-lg w-96" style={{ backgroundColor: "#990011", color: "#FCF6F5" }}>
        <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Username:</p>
            <p>{userData.user_name}</p>
          </div>
          <div>
            <p className="font-semibold">Name:</p>
            <p>{userData.name || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold">Mobile Number:</p>
            <p>{userData.mobile_number}</p>
          </div>
          <div>
            <p className="font-semibold">Address ID:</p>
            <p>{userData.address_id || "N/A"}</p>
          </div>
          <div className="space-y-2 mt-4">
            <button className="btn w-full bg-[#FCF6F5] text-[#990011] hover:font-bold">Change Password</button>
            <button className="btn w-full bg-[#FCF6F5] text-[#990011] hover:font-bold">View Order History</button>
            <button className="btn w-full bg-gray-500 text-white hover:font-bold">Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
