import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import OverlayProvider from "./OverlayProvider";
import ConfettiProvider from "./ConfettiProvider";
import theme from "@/theme";
import { queryClient } from "@/lib/queryClient";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
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
        </ChakraProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
