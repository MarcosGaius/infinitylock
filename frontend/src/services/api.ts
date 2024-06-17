import axios from "axios";
// import { parseCookies } from "nookies";

// const { token } = parseCookies();

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
});

// if (token) {
//   api.defaults.headers["Authorization"] = `Bearer ${token}`;
// }
