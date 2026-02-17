import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { createRoot } from "react-dom/client";

import "./index.css";
import { StrictMode } from "react";

import { WrapperProvider } from "./WrapperProvider";
import App from "./App.jsx";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WrapperProvider>
      <App />
    </WrapperProvider>
  </StrictMode>,
);
