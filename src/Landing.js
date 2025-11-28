import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Lock, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGlobalWallet } from "./context/WalletContext"; // 🟣 import global wallet context

const Landing = () => {
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const { setWalletAddress } = useGlobalWallet(); // 🟣 access setter from context

  // ✅ When wallet connects, store both in localStorage & global context
  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toBase58();
      localStorage.setItem("walletAddress", address);
      setWalletAddress(address); // 🟣 update context globally
      console.log("💾 Wallet connected:", address);
    }
  }, [connected, publicKey, setWalletAddress]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-cyan-900/10 to-black blur-3xl" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/30 border-b border-white/10 flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          NeuroLogix
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Login / Sign Up
          </button>

          {/* ✅ Phantom Connect Button */}
          <div className="rounded-lg overflow-hidden">
            <WalletMultiButton className="!bg-gradient-to-r !from-cyan-400 !to-purple-500 !text-black !font-semibold !px-4 !py-2 !rounded-lg !hover:opacity-90 transition" />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col justify-center items-center text-center px-6 mt-32 md:mt-40 z-10">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AI-Powered Logistics Escrow
        </motion.h1>

        <motion.p
          className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          NeuroLogix merges{" "}
          <span className="text-cyan-400 font-semibold">artificial intelligence</span>{" "}
          with <span className="text-purple-400 font-semibold">Solana smart contracts</span>{" "}
          to bring trust, risk prediction, and automation into global logistics.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 text-lg rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold hover:scale-105 transition-transform"
          >
            Launch App
          </button>

          <button className="px-6 py-3 text-lg rounded-xl border border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-black transition">
            Learn More
          </button>
        </motion.div>

        {/* ✅ Show wallet info when connected */}
        {connected && publicKey && (
          <p className="mt-8 text-gray-400 text-sm">
            ✅ Connected Wallet:{" "}
            <span className="text-cyan-400 font-mono">
              {publicKey.toBase58().slice(0, 8)}...
              {publicKey.toBase58().slice(-8)}
            </span>
          </p>
        )}
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 mt-24 px-8 max-w-7xl mx-auto z-10">
        {[
          {
            icon: <Brain className="text-cyan-400 w-10 h-10 mb-4" />,
            title: "AI Risk Prediction",
            desc: "Predict shipment delays, frauds, and route anomalies using real-time AI models.",
            color: "from-cyan-400/10 to-cyan-800/20",
          },
          {
            icon: <Lock className="text-purple-400 w-10 h-10 mb-4" />,
            title: "Secure Escrow Contracts",
            desc: "Solana-powered escrow ensures funds are locked and released only after AI validation.",
            color: "from-purple-400/10 to-purple-800/20",
          },
          {
            icon: <LineChart className="text-green-400 w-10 h-10 mb-4" />,
            title: "Real-Time Insights",
            desc: "Track shipments, fund flows, and AI decisions with transparent analytics.",
            color: "from-green-400/10 to-green-800/20",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`p-8 rounded-2xl bg-gradient-to-br ${card.color} text-white font-semibold border border-white/10 hover:shadow-[0_0_25px_rgba(0,255,163,0.2)] transform transition-all`}
          >
            <div className="flex flex-col items-center text-center">
              {card.icon}
              <h3 className="text-xl font-semibold mb-3 text-cyan-300">{card.title}</h3>
              <p className="text-gray-400">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <footer className="text-center mt-24 py-8 border-t border-gray-800 text-gray-500 text-sm">
        © 2025 NeuroLogix • Built on Solana •{" "}
        <span className="text-cyan-400">AI Powered</span>
      </footer>
    </div>
  );
};

export default Landing;
