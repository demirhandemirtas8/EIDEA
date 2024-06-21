import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Products from './components/Product';
import ExchangeRates from './components/ExchangeRates';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar className="sidebar" />
        <div className="main-content">
          <ExchangeRates />
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
