import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { API_KEY } from '@env';
import { getCapital, setCapital as storeCapital, addStockPurchase } from '../storage/DataStorage';

export default function DetailScreen({ route }) {
  const { symbol, name } = route.params;
  const [stockDetails, setStockDetails] = useState(null);
  const [marketOpen, setMarketOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [capital,setCapital] = useState(0);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quoteRes = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
        );
        const quoteData = await quoteRes.json();
        setStockDetails(quoteData);

        const statusRes = await fetch(
          `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${API_KEY}`
        );
        const statusData = await statusRes.json();
        setMarketOpen(statusData.isOpen);

        // Hämta kapital från AsyncStorage
        const storedCapital = await getCapital();
        if (storedCapital !== null) {
          setCapital(storedCapital);
        }

      } catch (error) {
        console.error('Fel vid hämtning:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!stockDetails || stockDetails.c === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ingen data hittades för {symbol}</Text>
      </View>
    );
  }

  const handleBuy = async () => {
  try {
    const total = quantity * stockDetails.c;
    if (total > capital) {
      alert('Du har inte tillräckligt med kapital för detta köp.');
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
      timestamp: new Date().toISOString(), // valfritt
    };

    await addStockPurchase(purchase);

    alert(`Du köpte ${quantity} aktier i ${name} för totalt ${total.toFixed(2)} USD.`);
  } catch (error) {
    console.error('Fel vid köp:', error);
    alert('Ett fel uppstod vid köp.');
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.symbol}>{symbol}</Text>

        {marketOpen !== null && (
          <View style={styles.marketStatus}>
            <Text style={{ color: marketOpen ? 'green' : 'red' }}>
              {marketOpen ? 'Marknaden är öppen' : 'Marknaden är stängd'}
            </Text>
            <Text>(Öppettid 16.30–23.00 mån-fre)</Text>
          </View>
        )}

        <Text style={styles.price}>{stockDetails.c} USD</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Högsta idag:</Text>
          <Text>{stockDetails.h} USD</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Lägsta idag:</Text>
          <Text>{stockDetails.l} USD</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Öppningspris:</Text>
          <Text>{stockDetails.o} USD</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Föregående stängning:</Text>
          <Text>{stockDetails.pc} USD</Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.label}>Antal:</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.counterButton}>
              <Text style={styles.counterText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={styles.counterButton}>
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Visa totalvärde */}
        <Text style={{ marginTop: 10 }}>
          Totalt värde: {(quantity * stockDetails.c).toFixed(2)} USD
        </Text>

        <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 10 }}>
          Tillgängligt kapital: {capital.toFixed(2)} USD
        </Text>

        <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
          <Text style={styles.buyButtonText}>Köp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  symbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  marketStatus: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: '500',
    color: '#555',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  buyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quantityContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  counterButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  counterText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
