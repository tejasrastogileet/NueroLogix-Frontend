import React, { useEffect, useState, useCallback } from "react";
import { getShipments } from "./api/shipmentAPI";
import ShipmentCard from "./components/ShipmentCard";
import { Link } from "react-router-dom";
import ChatBubble from "./components/ChatBubble";
import RiskCard from "./components/RiskCard";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Dashboard() {
  const [shipments, setShipments] = useState([]);
  const wallet = useWallet();
  const NETWORK = "https://api.devnet.solana.com";

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await getShipments();
        console.log("Shipments API Response:", res);

        if (Array.isArray(res)) {
          setShipments(res);
        } else if (Array.isArray(res.data)) {
          setShipments(res.data);
        } else if (Array.isArray(res.shipments)) {
          setShipments(res.shipments);
        } else {
          console.warn("Unexpected response format:", res);
          setShipments([]);
        }
      } catch (err) {
        console.error("Error fetching shipments:", err);
      }
    };
    fetchShipments();
  }, []);

  const handleReleaseFunds = useCallback(
    async (sellerWalletAddress) => {
      if (!wallet.connected) {
        alert("Please connect your wallet first!");
        return;
      }

      try {
        const connection = new Connection(NETWORK, "confirmed");
        const sellerPubKey = new PublicKey(sellerWalletAddress);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: sellerPubKey,
            lamports: 0.1 * 1e9,
          })
        );

        const signature = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, "confirmed");

        alert(`Funds released to seller!\nTx Signature: ${signature}`);
        console.log("Transaction confirmed:", signature);
      } catch (err) {
        console.error("Release error:", err);
        alert("Failed to release funds: " + err.message);
      }
    },
    [wallet]
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipment Dashboard</h1>
        <Link to="/add-shipment">
          <button className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition-all">
            + Add Shipment
          </button>
        </Link>
      </div>

      <RiskCard shipments={shipments} />

      <div className="space-y-4 mt-4">
        {Array.isArray(shipments) && shipments.length > 0 ? (
          shipments.map((shipment) => (
            <div key={shipment._id} className="bg-gray-800 p-4 rounded-xl">
              <ShipmentCard shipment={shipment} />

              {shipment.sellerWallet && (
                <button
                  onClick={() => handleReleaseFunds(shipment.sellerWallet)}
                  className="mt-3 bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-all"
                >
                  Release Funds to Seller
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No shipments found yet.</p>
        )}
      </div>

      <ChatBubble />
    </div>
  );
}
