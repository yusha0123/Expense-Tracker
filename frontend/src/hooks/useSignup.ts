import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const { dispatch } = useAuthContext();

  return useMutation({
    mutationFn: async (formData: Record<string, unknown>) => {
      const { data } = await axios.post("/api/auth/signup", formData);
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

      dispatch({
        type: "LOGIN",
        payload: user,
      });
      toast.success("Registration Successful!");
    },
  });
};
