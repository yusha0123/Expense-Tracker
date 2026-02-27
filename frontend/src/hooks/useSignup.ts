import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSignup = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (formData: Record<string, unknown>) => {
      const { data } = await axiosInstance.post("/auth/signup", formData);
      return data;
    },
    onSuccess: (data) => {
      const token = data?.token;
      login(token);

      toast.success("Registration Successful!");
    },
  });
};
