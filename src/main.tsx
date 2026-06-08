import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted Geist (no third-party font CDN, no visitor-IP transfer to Google).
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
