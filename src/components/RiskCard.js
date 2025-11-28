import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RiskCard({ shipments = [] }) {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧠 Fetch AI Risk Prediction from your Mistral backend
  const fetchRisk = async () => {
    if (shipments.length === 0) return;
    setLoading(true);

    try {
      const latestShipment = shipments[shipments.length - 1];

      const res = await axios.post("http://localhost:5000/api/ai/risk", {
        origin: latestShipment.origin || "Unknown",
        destination: latestShipment.destination || "Unknown",
        vendor: latestShipment.vendor || "Not Provided",
        status: latestShipment.status || "In Transit",
        reliability: latestShipment.sellerReliability || "Good",
        routeHistory: latestShipment.routeHistory || "Normal",
        weather: "Clear",
      });

      setRiskData(res.data);
    } catch (err) {
      console.error("❌ Risk fetch error:", err);
      setRiskData({ riskLevel: "Unknown", reason: "Backend not reachable" });
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Auto-refresh every 60s
  useEffect(() => {
    fetchRisk();
    const interval = setInterval(fetchRisk, 60000);
    return () => clearInterval(interval);
  }, [shipments]);

  return (
    <div className="bg-gray-800 text-white p-5 rounded-2xl shadow-xl mb-6">
      <h2 className="text-xl font-semibold mb-3">🧠 AI Risk Prediction</h2>

      {loading ? (
        <p className="text-gray-400">Analyzing latest shipment risk...</p>
      ) : riskData ? (
        <div className="space-y-2">
          <p>
            <strong>Risk Level:</strong>{" "}
            <span
              className={`${
                riskData.riskLevel === "High"
                  ? "text-red-400"
                  : riskData.riskLevel === "Medium"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {riskData.riskLevel}
            </span>
          </p>
          <p>
            <strong>Reason:</strong> {riskData.reason}
          </p>
          <p className="text-xs text-gray-400 italic">
            Auto-updates every 1 minute ⏱️
          </p>
        </div>
      ) : (
        <p>No shipment data available yet.</p>
      )}
    </div>
  );
}
