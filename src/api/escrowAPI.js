// src/api/escrowAPI.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/escrow";

export const lockFunds = async (buyerPublicKey, amount) => {
  const res = await axios.post(`${API_URL}/lock`, { buyerPublicKey, amount });
  return res.data;
};

export const releaseFunds = async (sellerPublicKey, amount) => {
  const res = await axios.post(`${API_URL}/release`, { sellerPublicKey, amount });
  return res.data;
};
