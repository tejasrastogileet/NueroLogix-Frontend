import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "./api/auth";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Buyer",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        const res = await signup(formData);
        alert(res.data.message);
        setIsSignup(false);
      } else {
        const res = await login(formData);
        alert(res.data.message);
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-purple-900/30 to-black blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-[90%] max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <div className="flex items-center bg-black/30 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <Mail className="w-5 h-5 text-cyan-400 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="bg-transparent outline-none flex-1 text-white placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="flex items-center bg-black/30 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <Lock className="w-5 h-5 text-purple-400 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-transparent outline-none flex-1 text-white placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300">Select Role</label>
            <div className="flex items-center bg-black/30 border border-white/20 rounded-lg px-3 py-2 mt-1">
              <User className="w-5 h-5 text-green-400 mr-2" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-transparent outline-none flex-1 text-white"
              >
                <option className="bg-black text-white" value="Buyer">Buyer</option>
                <option className="bg-black text-white" value="Seller">Seller</option>
              </select>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full mt-4 py-3 rounded-lg font-semibold text-black bg-gradient-to-r from-cyan-400 to-purple-500 hover:opacity-90 transition"
          >
            {isSignup ? "Create Account" : "Login"}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-cyan-400 hover:underline"
          >
            {isSignup ? "Login" : "Create Account"}
          </button>
        </p>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-cyan-400 transition"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
