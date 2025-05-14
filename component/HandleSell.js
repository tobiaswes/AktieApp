import { Alert } from 'react-native';
import { updateStockPurchase, removeStockPurchase, getPurchases, setCapital } from '../storage/DataStorage';

export const handleSell = async ({ item, sellAmount, capital, setItem, setCapitalState, setPurchases }) => {
  if (!item) {
    Alert.alert('Ogiltig åtgärd', 'Finns ingen aktie att sälja.');
    return;
  }

  try {
    await updateStockPurchase(item.symbol, sellAmount);

    if (item.quantity - sellAmount <= 0) {
      await removeStockPurchase(item.symbol);
      setItem(null);
    } else {
      setItem({ ...item, quantity: item.quantity - sellAmount });
    }

    const salePrice = item.latestPrice || item.price;
    const saleAmount = salePrice * sellAmount;
    const newCapital = capital + saleAmount;

    await setCapital(newCapital);
    setCapitalState(newCapital);
    setPurchases(await getPurchases());

    Alert.alert(
      'Försäljning lyckades',
      `Du har sålt ${sellAmount} aktie${sellAmount > 1 ? 'r' : ''} av ${item.symbol}`
    );
  } catch (error) {
    console.error('Fel vid försäljning:', error);
    Alert.alert('Något gick fel', 'Försäljningen misslyckades, försök igen senare.');
  }
};