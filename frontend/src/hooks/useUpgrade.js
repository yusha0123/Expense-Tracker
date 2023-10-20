import { useAuthContext } from "./useAuthContext";

export const useUpgrade = () => {
  const { dispatch } = useAuthContext();
  const upgrade = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    user.isPremium = true;
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({
      type: "UPGRADE",
    });
  };
  return { upgrade };
};
