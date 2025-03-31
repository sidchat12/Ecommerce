import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginUser() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
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
      const url = "http://localhost:5000/user/login";
      await axios.post(url, formData);
      alert("Login successful!");
    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ffe5dc]">
      <div className="p-8 rounded-lg shadow-lg w-96" style={{ backgroundColor: "#990011", color: "#FCF6F5" }}>
        <h2 className="text-2xl font-bold text-center mb-6">User Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            {errors.username && <p className="text-sm text-[#FCF6F5]">{errors.username}</p>}
          </div>

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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

