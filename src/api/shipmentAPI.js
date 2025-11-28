import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend port
});

// ✅ Get all shipments
export const getShipments = () => API.get("/shipments");

// ✅ Create new shipment
export const createShipment = (data) => API.post("/shipments", data);

// ✅ Get single shipment by ID
export const getShipmentById = (id) => API.get(`/shipments/${id}`);
export const updateShipmentStatus = (id, status) =>
  API.put(`/shipments/${id}/status`, { status });
