import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpgrade = () => {
  const { toggleConfetti, login, upgrade } = useAuthStore();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.get("/auth/refresh");
      return data;
    },
    onSuccess: (data) => {
      login(data?.token);
      toggleConfetti();
      upgrade();
      toast.success("You are now a Pro Member!");
    },
    onError: () => {
      toast.error("Failed to upgrade user!");
    }
  })

  return { upgrade: mutate }
}