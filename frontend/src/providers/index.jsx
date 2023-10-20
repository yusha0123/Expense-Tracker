import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "../context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactConfetti from "react-confetti";
import { useAuthContext } from "../hooks/useAuthContext";

const ConfettiProvider = () => {
  const { showConfetti, dispatch } = useAuthContext();

  const handleClose = () => {
    dispatch({ type: "TOGGLE_CONFETTI" });
  };

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      style={{
        pointerEvents: "none",
        zIndex: 99,
      }}
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={handleClose}
    />
  );
};

export const AppProvider = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthContextProvider>
          <ConfettiProvider />
          {children}
        </AuthContextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
