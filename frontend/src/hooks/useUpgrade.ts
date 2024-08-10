import { toast } from "react-toastify";
import { useAuthContext } from "./useAuthContext";

export const useUpgrade = () => {
  const { dispatch } = useAuthContext();

  const upgrade = () => {
    const userString = localStorage.getItem("user");
    const user: User | null = userString ? JSON.parse(userString) : null;

    if (user) {
      user.isPremium = true;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: "UPGRADE",
      });
    } else {
      toast.error("User is not logged in!");
    }
  };

  return { upgrade };
};
