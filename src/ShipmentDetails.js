import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateShipmentStatus } from "./api/shipmentAPI";
import { useWallet } from "@solana/wallet-adapter-react";
import { lockFunds, releaseFunds } from "./solana/utils";

const ESCROW_ACCOUNT = process.env.REACT_APP_ESCROW_ACCOUNT;

export default function ShipmentDetails() {
  const { id } = useParams();
  const wallet = useWallet();

  const [shipment, setShipment] = useState(null);
  const [sellerWalletInput, setSellerWalletInput] = useState(""); // 🆕 Manual entry field
  const [locking, setLocking] = useState(false);
  const [releasing, setReleasing] = useState(false);

  // ✅ Fetch shipment details
  useEffect(() => {
    fetch('http://localhost:5000/api/shipments/${id}')
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched shipment:", data);
        setShipment(data);
      })
      .catch((err) => console.error("Error fetching shipment:", err));
  }, [id]);

  // ✅ Update status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await updateShipmentStatus(id, newStatus);
      setShipment((prev) => ({ ...prev, status: newStatus }));

      if (newStatus === "Delivered") {
        await handleReleaseFunds();
      }

      alert("✅ Status updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Error updating status");
    }
  };

  // ✅ Lock funds manually
  const handleLockFunds = async () => {
    if (!wallet.connected) return alert("⚠ Please connect your wallet first!");
    setLocking(true);
    try {
      const signature = await lockFunds(wallet, ESCROW_ACCOUNT, 0.01);
      alert("💸 Funds locked successfully! Tx: " + signature);
      await updateShipmentStatus(id, "Payment Locked");
      setShipment((prev) => ({ ...prev, status: "Payment Locked" }));
    } catch (err) {
      console.error("Error locking funds:", err);
      alert("❌ Error locking funds: " + err.message);
    }
    setLocking(false);
  };

  // ✅ Release funds manually
  const handleReleaseFunds = async () => {
    if (!wallet.connected) return alert("⚠ Connect your wallet first!");
    if (!shipment?.sellerWallet) {
      alert("❌ Seller wallet address missing in shipment data!");
      console.error("Seller wallet undefined:", shipment);
      return;
    }

    setReleasing(true);
    try {
      const signature = await releaseFunds(wallet, shipment.sellerWallet, 0.01);
      alert("💸 Funds released successfully! Tx: " + signature);
    } catch (err) {
      console.error("Error releasing funds:", err);
      alert("❌ Error releasing funds: " + err.message);
    }
    setReleasing(false);
  };

  // ✅ Manual Seller Wallet Update (Modified)
  const handleSellerWalletSave = async () => {
    if (!sellerWalletInput)
      return alert("⚠ Please enter a seller wallet address!");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/shipments/${shipment._id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sellerWallet: sellerWalletInput }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Seller wallet updated successfully!");
        setShipment((prev) => ({ ...prev, sellerWallet: sellerWalletInput }));
        setSellerWalletInput("");
      } else {
        alert("❌ Failed to update wallet: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating seller wallet:", err);
      alert("❌ Error: " + err.message);
    }
  };

  if (!shipment) return <div className="text-white p-8">Loading shipment...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Shipment Details</h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-3">
        <p><strong>Tracking ID:</strong> {shipment.trackingId}</p>
        <p><strong>Origin:</strong> {shipment.origin}</p>
        <p><strong>Destination:</strong> {shipment.destination}</p>
        <p>
          <strong>Seller Wallet:</strong>{" "}
          {shipment.sellerWallet || "❌ Missing"}
        </p>
        <p><strong>Status:</strong> {shipment.status}</p>

        {/* 🆕 Manual Seller Wallet Input */}
        {!shipment.sellerWallet && (
          <div className="mt-4 p-4 bg-yellow-100 text-gray-900 rounded-lg">
            <p className="font-semibold mb-2">Seller Wallet Missing!</p>
            <input
              type="text"
              placeholder="Enter Seller Wallet Address"
              value={sellerWalletInput}
              onChange={(e) => setSellerWalletInput(e.target.value)}
              className="border rounded p-2 w-full mb-2"
            />
            <button
              onClick={handleSellerWalletSave}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded w-full"
            >
              💾 Save Seller Wallet
            </button>
          </div>
        )}

        {/* Status Dropdown */}
        <div className="mt-4">
          <label className="block mb-2 font-semibold">Update Status:</label>
          <select
            value={shipment.status}
            onChange={handleStatusChange}
            className="bg-gray-700 text-white p-2 rounded"
          >
            <option>Pending</option>
            <option>In Transit</option>
            <option>Delivered</option>
            <option>Payment Locked</option>
          </select>
        </div>

        {/* Blockchain Escrow Section */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-2">Blockchain Escrow</h2>

          {wallet.connected ? (
            <div>
              <p className="text-sm text-gray-400 mb-3">
                Connected: {wallet.publicKey?.toBase58().slice(0, 6)}...
                {wallet.publicKey?.toBase58().slice(-4)}
              </p>

              <button
                onClick={handleLockFunds}
                disabled={locking}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold mr-3"
              >
                {locking ? "Locking..." : "🔒 Lock Funds (0.01 SOL)"}
              </button>

              <button
                onClick={handleReleaseFunds}
                disabled={releasing}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold"
              >
                {releasing ? "Releasing..." : "💸 Release Funds"}
              </button>
            </div>
          ) : (
            <p className="text-gray-400 mt-2">
              ⚠ Connect Phantom wallet to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}