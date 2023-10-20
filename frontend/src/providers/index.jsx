import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import { AuthContextProvider } from "../context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactConfetti from "react-confetti";
import { useAuthContext } from "../hooks/useAuthContext";

const ConfettiProvider = () => {
  const { showConfetti, dispatch } = useAuthContext();

  const handleComplete = () => {
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
      onConfettiComplete={handleComplete}
    />
  );
};

export const AppProvider = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <AuthContextProvider>
            <ConfettiProvider />
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme="colored"
            />
            {children}
          </AuthContextProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
