import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.js";
import { AppProvider } from "./providers/index.js";

createRoot(document.getElementById("root")!).render(
  <Router>
    <AppProvider>
      <App />
    </AppProvider>
  </Router>
);
