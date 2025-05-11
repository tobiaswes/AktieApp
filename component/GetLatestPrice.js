import { API_KEY } from '@env';

export const fetchLatestPrice = async (symbol) => {
  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    const data = await response.json();
    return data.c || null; 
  } catch (error) {
    console.error(`Fel vid hämtning av pris för ${symbol}:`, error);
    return null;
  }
};