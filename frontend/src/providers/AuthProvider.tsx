import { AuthContext } from "@/store/authContext";
import { authReducer } from "@/store/authReducer";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect, useReducer } from "react";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    showConfetti: false,
    isInitializing: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: "SET_INITIALIZING", payload: true });

      try {
        const token = localStorage.getItem("user");

        if (token && typeof token === "string") {
          const decoded: DecodedToken = jwtDecode(token);

          if (!("email" in decoded) || !("isPremium" in decoded)) {
            throw new Error("Decoded token is missing required properties.");
          }

          const user = {
            email: decoded.email,
            isPremium: decoded.isPremium,
            token,
          };

          dispatch({
            type: "LOGIN",
            payload: user,
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch({ type: "LOGOUT" });
      } finally {
        dispatch({ type: "SET_INITIALIZING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
