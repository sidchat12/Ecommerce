import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function AddAddress() {
  const { user_id } = useParams();
  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  
  const statesOfIndia = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const validate = () => {
    let newErrors = {};
    if (!formData.address1.trim()) newErrors.address1 = "Address Line 1 is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "Please select a state";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const url = `http://localhost:5000/user/${user_id}/addaddress`;
      const payload = {
        address_line_1: formData.address1,
        address_line_2: formData.address2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };
      await axios.post(url, payload);
      alert("Address submitted successfully!");
    } catch (error) {
      alert("Submission failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ffe5dc]">
      <div className="p-8 rounded-lg shadow-lg w-96" style={{ backgroundColor: "#990011", color: "#FCF6F5" }}>
        <h2 className="text-2xl font-bold text-center mb-6">Address Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["address1", "address2", "city", "pincode"].map((field) => (
            <div key={field}>
              <input
                type="text"
                name={field}
                placeholder={field.replace(/\d/, "").replace("address", "Address Line ")}
                value={formData[field]}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              {errors[field] && <p className="text-sm text-[#FCF6F5]">{errors[field]}</p>}
            </div>
          ))}
          <div>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select State</option>
              {statesOfIndia.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="text-sm text-[#FCF6F5]">{errors.state}</p>}
          </div>
          <button type="submit" className="btn w-full hover:font-bold bg-[#FCF6F5] text-[#990011]">
            Submit Address
          </button>
        </form>
      </div>
    </div>
  );
}
