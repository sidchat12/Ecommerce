
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-[#990011] sticky top-0 z-50 shadow-md">
      <div className="flex-1">
        <a className="text-xl font-bold px-4">Website Name</a>
      </div>
      <div className="flex-1 flex justify-center">
        <input type="text" placeholder="Search..." className="input input-bordered bg-[#FCF6F5] w-full max-w-md" />
      </div>
      <div className="flex-none space-x-4 px-4">
        <button 
          className="btn btn-primary bg-white text-red-600 border-white hover:border-black-1500 hover:font-bold ml-lg"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button 
          className="btn btn-secondary bg-white text-red-600 border-white hover:border-black-1500 hover:font-bold ml-lg"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      </div>
    </div>
  );
}