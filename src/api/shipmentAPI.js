import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getShipments = () => API.get("/shipments");

export const createShipment = (data) => API.post("/shipments", data);

export const getShipmentById = (id) => API.get(`/shipments/${id}`);
export const updateShipmentStatus = (id, status) =>
  API.put(`/shipments/${id}/status`, { status });
