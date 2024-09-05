import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";
import { jwtDecode } from "jwt-decode";

export const useLogin = () => {
  const { dispatch } = useAuthContext();

  return useMutation({
    mutationFn: (formData: Record<string, unknown>) => {
      return axios.post("/api/auth/login", formData);
    },
    onSuccess: (response) => {
      const token = response?.data?.token;
      const decoded: DecodedToken = jwtDecode(token);

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
