import React from "react";
import { Link } from "react-router-dom";

export default function ShipmentCard({ shipment }) {
  return (
    <Link to={`/shipment/${shipment._id}`}>
      <div className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition cursor-pointer mb-4">
        <h2 className="text-xl font-bold">{shipment.trackingId}</h2>
        <p>{shipment.origin} ➡️ {shipment.destination}</p>
        <p>Status: {shipment.status}</p>
      </div>
    </Link>
  );
}
