import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
console.log("Base URL:", baseURL);

const API = axios.create({ baseURL });

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
