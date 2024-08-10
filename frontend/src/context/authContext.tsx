import { createContext, useEffect, useReducer, ReactNode } from "react";

interface AuthState {
  user: User | null;
  showConfetti: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPGRADE" }
  | { type: "TOGGLE_CONFETTI" };

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload, showConfetti: state.showConfetti };
    case "LOGOUT":
      return { user: null, showConfetti: state.showConfetti };
    case "UPGRADE":
      return { ...state, user: { ...state.user!, isPremium: true } };
    case "TOGGLE_CONFETTI":
      return { ...state, showConfetti: !state.showConfetti };
    default:
      return state;
  }
};

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    showConfetti: false,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      dispatch({
        type: "LOGIN",
        payload: user,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
