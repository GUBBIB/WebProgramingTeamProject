import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import IntroPage from "./pages/IntroPage";
import MainPage from "./pages/MainPage";
import GPTCodeHelper from "./components/GPTCodeHelper/GPTCodeHelper";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  </React.StrictMode>
);
