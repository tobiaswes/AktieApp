import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchLatestPrice } from './GetLatestPrice';
import { getPurchases } from '../storage/DataStorage';

export const updatePrices = async (setPurchases) => {
  try {
    const oldPurchases = await getPurchases();
    const updated = await Promise.all(
      oldPurchases.map(async (item) => {
        const latestPrice = await fetchLatestPrice(item.symbol);
        return latestPrice ? { ...item, latestPrice } : item;
      })
    );
    await AsyncStorage.setItem('purchases', JSON.stringify(updated));
    setPurchases(updated);
  } catch (error) {
    console.error('Fel vid uppdatering av priser:', error);
  }
};