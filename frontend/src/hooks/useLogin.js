import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import showToast from "./showToast";

export const useLogin = () => {
  const [isError, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const toast = useToast();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/auth/login", {
        email: email,
        password: password,
      });
      if (response.status == 200) {
        showToast(toast, "Login Successful!", "success");
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
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return { login, loading, isError };
};
