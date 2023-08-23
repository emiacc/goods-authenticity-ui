import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </MoralisProvider>
  </React.StrictMode>
);
