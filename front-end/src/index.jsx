import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Global styles
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import IntroPage from "./pages/IntroPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/board/*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
