import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles
import { BrowserRouter } from 'react-router-dom';
import MainPage from './pages/MainPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  </React.StrictMode>
);

