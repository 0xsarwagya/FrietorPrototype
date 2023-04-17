import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <div data-theme="halloween">
      <Toaster />
      <div className="p-5">
        <App />
      </div>
    </div>
  </React.StrictMode>
);
