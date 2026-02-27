import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (formData: Record<string, unknown>) => {
      return axiosInstance.post("/auth/login", formData);
    },
    onSuccess: (response) => {
      const token = response?.data?.token;

      login(token);
    },
  });
};
