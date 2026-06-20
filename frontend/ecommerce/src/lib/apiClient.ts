import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,           // sends your auth cookie
});

export default apiClient;