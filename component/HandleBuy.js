import { getPurchases, setCapital as storeCapital, addStockPurchase } from '../storage/DataStorage';

export const handleBuy = async ({
  symbol,
  name,
  stockDetails,
  quantity,
  capital,
  setCapital,
}) => {
  try {
    const total = quantity * stockDetails.c;
    if (total > capital) {
      alert('Du har inte tillräckligt med kapital för detta köp.');
      return;
    }

    const purchases = await getPurchases();
    const uniqueSymbols = [...new Set(purchases.map(p => p.symbol))];
    const isNewSymbol = !uniqueSymbols.includes(symbol);

    if (uniqueSymbols.length >= 6 && isNewSymbol) {
      alert('Du kan max ha 6 olika aktier i portföljen.');
      return;
    }

    const newCapital = capital - total;
    await storeCapital(newCapital.toFixed(2));
    setCapital(newCapital);

    const purchase = {
      symbol,
      name,
      price: stockDetails.c,
      quantity,
      total,
      timestamp: new Date().toISOString(),
    };

    await addStockPurchase(purchase);

    alert(`Du köpte ${quantity} aktier i ${name} för totalt ${total.toFixed(2)} USD.`);
  } catch (error) {
    console.error('Fel vid köp:', error);
    alert('Ett fel uppstod vid köp.');
  }
};