import { useContext } from "react";
import { AuthContext } from "@/store/authContext";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside an Auth Context Provider!");
  }

  return context;
};
