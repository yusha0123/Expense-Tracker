import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const { dispatch } = useAuthContext();
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post("/api/auth/signup", formData);
      return data;
    },
    onSuccess: (data) => {
      const user = {
        email: data.email,
        token: data.token,
        isPremium: data.isPremium,
      };
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: "LOGIN",
        payload: user,
      });
      toast.success("Registration Successful!");
    },
  });
};
