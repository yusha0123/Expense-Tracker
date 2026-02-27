import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/lib/axios";
import { authStorage } from "@/utils/authStorage";

export const useLogin = () => {
  const { dispatch } = useAuthContext();

  return useMutation({
    mutationFn: (formData: Record<string, unknown>) => {
      return axiosInstance.post("/auth/login", formData);
    },
    onSuccess: (response) => {
      const token = response?.data?.token;
      const decoded: DecodedToken = jwtDecode(token);

      authStorage.setToken(token);

      const user = {
        email: decoded.email,
        isPremium: decoded.isPremium,
        token,
      };

      dispatch({
        type: "LOGIN",
        payload: user,
      });
    },
  });
};
