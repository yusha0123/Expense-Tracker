import App from "./App.js";
import { AppProvider } from "./providers/index.js";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
