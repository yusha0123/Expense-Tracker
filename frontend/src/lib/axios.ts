import axios from "axios";
import { authStorage } from "@/utils/authStorage";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_ADDRESS}/api`,
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = authStorage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
);

export default axiosInstance;