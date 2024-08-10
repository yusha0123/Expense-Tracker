import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactConfetti from "react-confetti";
import { ToastContainer } from "react-toastify";
import useWindowSize from "react-use/lib/useWindowSize";
import { AuthContextProvider } from "@/context/authContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import ModalProvider from "@/overlays/ModalProvider";

const ConfettiProvider = () => {
  const {
    state: { showConfetti },
    dispatch,
  } = useAuthContext();
  const { width, height } = useWindowSize();

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
      width={width}
      height={height}
      numberOfPieces={1000}
      recycle={false}
      onConfettiComplete={handleComplete}
    />
  );
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
      },
      mutations: {
        retry: 1,
      },
    },
  });

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <AuthContextProvider>
            <ConfettiProvider />
            <ToastContainer
              position="top-center"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              theme="colored"
            />
            {children}
            <ModalProvider />
          </AuthContextProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
