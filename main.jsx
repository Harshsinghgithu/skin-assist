import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VRScene from "./App.jsx";
import MainWebPage from "./MainWebPage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VRScene />} />
        <Route path="/main" element={<MainWebPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
