import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { API_KEY } from '@env';

export default function DetailScreen({ route }) {
  const { symbol } = route.params;
  const [stockDetails, setStockDetails] = useState(null);
  const [marketOpen, setMarketOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quoteRes = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
        );
        const quoteData = await quoteRes.json();
        setStockDetails(quoteData);

        const statusRes = await fetch(
          `https://finnhub.io/api/v1/stock/market-status?token=${API_KEY}`
        );
        const statusData = await statusRes.json();
        setMarketOpen(statusData.market === 'open');
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.symbol}>{symbol}</Text>

        {marketOpen !== null && (
          <View style={styles.marketStatus}>
            <Text style={{ color: marketOpen ? 'green' : 'red' }}>
              {marketOpen ? 'Marknaden är öppen' : 'Marknaden är stängd'}
            </Text>
            <Text>(Öppettid 16.30–23.00)</Text>
          </View>
        )}

        <Text style={styles.price}>💲 {stockDetails.c} USD</Text>

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
  symbol: {
    fontSize: 28,
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
});
