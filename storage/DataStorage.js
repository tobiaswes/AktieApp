import AsyncStorage from '@react-native-async-storage/async-storage';

// Funktion för att hämta kapitalet
export const getCapital = async () => {
  try {
    const storedCapital = await AsyncStorage.getItem('capital');
    if (storedCapital !== null) {
      return parseFloat(storedCapital);
    }
    return null;
  } catch (error) {
    console.error('Fel vid hämtning av kapital:', error);
    return null;
  }
};

export const setCapital = async (capital) => {
  try {
    await AsyncStorage.setItem('capital', capital.toString());
  } catch (error) {
    console.error('Fel vid uppdatering av kapital:', error);
  }
};

// Funktion för att återställa kapitalet och aktier
export const reset = async () => {
  try {
    await AsyncStorage.setItem('capital', '10000');
    await AsyncStorage.removeItem('purchases');
  } catch (error) {
    console.error('Fel vid återställning av kapital och aktier:', error);
  }
};

// Hämta aktieköp
export const getPurchases = async () => {
  const json = await AsyncStorage.getItem('purchases');
  return json ? JSON.parse(json) : [];
};

// Lägg till aktieköp i portföljen
export const addStockPurchase = async (newPurchase) => {
  const currentPurchases = await getPurchases();

  const existingIndex = currentPurchases.findIndex(
    (purchase) => purchase.symbol === newPurchase.symbol
  );

  if (existingIndex !== -1) {
    // Uppdatera befintligt köp
    const existingPurchase = currentPurchases[existingIndex];
    const updatedQuantity = existingPurchase.quantity + newPurchase.quantity;
    const updatedTotal = existingPurchase.total + newPurchase.total;

    currentPurchases[existingIndex] = {
      ...existingPurchase,
      quantity: updatedQuantity,
      total: updatedTotal,
      price: newPurchase.price, // ev. senaste pris
      timestamp: new Date().toISOString(), // uppdatera tid
    };
  } else {
    // Lägg till nytt köp
    currentPurchases.push(newPurchase);
  }

  await AsyncStorage.setItem('purchases', JSON.stringify(currentPurchases));
};

// Uppdatera aktieköp när aktier säljs
export const updateStockPurchase = async (symbol, sellAmount) => {
  try {
    const purchases = await getPurchases();
    const updatedPurchases = purchases.map((purchase) => {
      if (purchase.symbol === symbol) {
        purchase.quantity -= sellAmount;
      }
      return purchase;
    }).filter(purchase => purchase.quantity > 0);

    await AsyncStorage.setItem('purchases', JSON.stringify(updatedPurchases));
  } catch (error) {
    console.error('Fel vid uppdatering av aktieköp:', error);
  }
};

// Ta bort aktieköp om mängden blir 0
export const removeStockPurchase = async (symbol) => {
  try {
    const purchases = await getPurchases();
    const updatedPurchases = purchases.filter(purchase => purchase.symbol !== symbol);
    await AsyncStorage.setItem('purchases', JSON.stringify(updatedPurchases));
  } catch (error) {
    console.error('Fel vid borttagning av aktieköp:', error);
  }
};