import React, { useState, useCallback } from "react";
import { createShipment } from "./api/shipmentAPI"; // ✅ fixed import path
import { useWallet } from "@solana/wallet-adapter-react";
import { lockFunds } from "./solana/utils"; // ✅ fixed import path

const ESCROW_ACCOUNT = process.env.REACT_APP_ESCROW_ACCOUNT;

export default function AddShipment() {
  const wallet = useWallet();

  const [form, setForm] = useState({
    trackingId: "",
    origin: "",
    destination: "",
    sellerWallet: "",
    amount: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔒 Lock funds to escrow
  const handleLockFunds = useCallback(async () => {
    if (!wallet.connected) {
      alert("⚠ Please connect your Phantom wallet first!");
      return;
    }

    try {
      const signature = await lockFunds(wallet, ESCROW_ACCOUNT, parseFloat(form.amount));
      alert('Funds locked successfully!\nTransaction: ${signature}');
      return signature;
    } catch (err) {
      console.error("❌ Escrow Lock Error:", err);
      alert("Failed to lock funds: " + err.message);
    }
  }, [wallet, form]);

  // 🚀 Create Shipment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const txSignature = await handleLockFunds();
      if (!txSignature) return;

      await createShipment({
        ...form,
        buyerWallet: wallet.publicKey?.toString(),
        txSignature,
      });

      alert("🚀 Shipment created & funds locked successfully!");
      setForm({
        trackingId: "",
        origin: "",
        destination: "",
        sellerWallet: "",
        amount: "",
        status: "Pending",
      });
    } catch (err) {
      console.error("❌ Error creating shipment:", err);
      alert("Error creating shipment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">📦 Create Shipment (Buyer)</h1>

        <input
          name="trackingId"
          placeholder="Tracking ID"
          value={form.trackingId}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700"
          required
        />
        <input
          name="origin"
          placeholder="Origin"
          value={form.origin}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700"
          required
        />
        <input
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700"
          required
        />
        <input
          name="sellerWallet"
          placeholder="Seller Wallet Address"
          value={form.sellerWallet}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700"
          required
        />
        <input
          name="amount"
          placeholder="Amount (in SOL)"
          type="number"
          value={form.amount}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 py-2 rounded hover:bg-purple-700 transition-all font-semibold"
        >
          🚀 Lock Funds & Create Shipment
        </button>
      </form>
    </div>
  );
}