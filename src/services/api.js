import axios from "axios";
import { getToken } from "./auth";
import config from '../config/config';

const api = axios.create({
  baseURL: config.endpoint
});

api.interceptors.request.use(async config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;