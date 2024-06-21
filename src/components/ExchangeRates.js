import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExchangeRates = () => {
  const [rates, setRates] = useState({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/exchange_rates');
        const data = response.data;
        setRates({
          USD: data.USD,
          EUR: data.EUR
        });
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  return (
    <div>
      <h2>Güncel Kurlar</h2>
      <p className="rates">USD: {rates.USD} EUR: {rates.EUR}</p>
     
    </div>
  );
};

export default ExchangeRates;
