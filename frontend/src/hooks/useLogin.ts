import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const { dispatch } = useAuthContext();

  return useMutation({
    mutationFn: (formData: Record<string, unknown>) => {
      return axios.post("/api/auth/login", formData);
    },
    onSuccess: (response) => {
      const user = {
        email: response.data.email,
        token: response.data.token,
        isPremium: response.data.isPremium,
      };
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: "LOGIN",
        payload: user,
      });
    },
  });
};
