import { AuthContext } from "../context/authContext";
import { useContext } from "react";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw error("useAuthContext must be used inside an Auth Context Provider!");
  }

  return context;
};
