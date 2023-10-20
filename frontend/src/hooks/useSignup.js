import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import showToast from "./showToast";

export const useSignup = () => {
  const [isError, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const toast = useToast();

  const signUp = async (email, name, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/auth/signup", {
        email: email,
        name: name,
        password: password,
      });
      if (response.status == 201) {
        showToast(toast, "Registration Successful!", "success");
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
  return { signUp, loading, isError };
};
