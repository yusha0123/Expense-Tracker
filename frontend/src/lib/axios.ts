import axios from "axios";
import { authStorage } from "@/utils/authStorage";
import { toast } from "react-toastify";
import { forceLogout } from "@/services/logoutService";

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
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || "";

        const isAuthRoute = requestUrl.includes("/auth");

        if (status === 401 && !isAuthRoute) {
            toast.error("Your session has expired. Please log in again.");
            forceLogout();
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;