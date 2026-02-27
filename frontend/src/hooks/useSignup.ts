import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "./useAuthContext";
import axiosInstance from "@/lib/axios";
import { authStorage } from "@/utils/authStorage";

export const useSignup = () => {
  const { dispatch } = useAuthContext();

  return useMutation({
    mutationFn: async (formData: Record<string, unknown>) => {
      const { data } = await axiosInstance.post("/auth/signup", formData);
      return data;
    },
    onSuccess: (data) => {
      const token = data?.token;
      const decoded: DecodedToken = jwtDecode(token);

      const user = {
        email: decoded.email,
        isPremium: decoded.isPremium,
        token,
      };
      authStorage.setToken(token);

      dispatch({
        type: "LOGIN",
        payload: user,
      });
      toast.success("Registration Successful!");
    },
  });
};
