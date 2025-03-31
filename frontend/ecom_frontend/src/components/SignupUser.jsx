import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignupUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Invalid email";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Invalid phone number";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
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
      const url ="http://localhost:5000/user/signup";
      await axios.post(url, formData);
      alert("Signup successful!");
    } catch (error) {
      alert("Signup failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ffe5dc]">
      <div className="p-8 rounded-lg shadow-lg w-96" style={{ backgroundColor: "#990011", color: "#FCF6F5" }}>
        <h2 className="text-2xl font-bold text-center mb-6">User Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "username", "phone"].map((field) => (
            <div key={field}>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              {errors[field] && <p className="text-sm text-[#FCF6F5]">{errors[field]}</p>}
            </div>
          ))}

          {/* Password Field with Eye Icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-sm text-[#FCF6F5]">{errors.password}</p>}
          </div>

          <button type="submit" className="btn w-full hover:font-bold bg-[#FCF6F5] text-[#990011]">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}