import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthContext } from "./useAuthContext";

export const useUpgrade = () => {
  const { dispatch, state: { user } } = useAuthContext();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get("/api/auth/refresh", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      return data;
    },
    onSuccess: (data) => {
      dispatch({ type: "TOGGLE_CONFETTI" });
      dispatch({ type: "UPGRADE" });
      localStorage.setItem("user", data?.token);
      toast.success("You are now a Pro Member!");
    },
    onError: () => {
      toast.error("Failed to upgrade user!");
    }
  })

  return { upgrade: mutate }
}