import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import OverlayProvider from "./OverlayProvider";
import ConfettiProvider from "./ConfettiProvider";
import AuthProvider from "./AuthProvider";

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
          <AuthProvider>
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
            <OverlayProvider />
          </AuthProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
