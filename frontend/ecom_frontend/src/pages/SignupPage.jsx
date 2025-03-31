import { useState } from "react";
import SignupSeller from "../components/SignupSeller";
import SignupUser from "../components/SignupUser";

export default function SignupPage() {
  const [isSeller, setIsSeller] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FCF6F5]">
      <button
        onClick={() => setIsSeller(!isSeller)}
        className="mb-6 px-4 py-2 font-bold rounded bg-[#FCF6F5] text-[#990011] border-2 border-[#990011] hover:bg-[#990011] hover:text-[#FCF6F5]"
      >
        {isSeller ? "Switch to User Signup" : "Switch to Seller Signup"}
      </button>
      {isSeller ? <SignupSeller /> : <SignupUser />}
    </div>
  );
}
