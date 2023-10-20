import { createContext, useEffect, useReducer, useState } from "react";
import { Loading } from "../components/Loading";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "UPGRADE":
      return { ...state, user: { ...state.user, isPremium: true } };
    case "TOGGLE_CONFETTI":
      return { ...state, showConfetti: !state.showConfetti };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    showConfetti: false,
  });

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({
        type: "LOGIN",
        payload: user,
      });
    }
    // Set isLoading to false after checking for user data
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};
