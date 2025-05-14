import React, { useEffect, useState } from 'react';
import { API_KEY } from '@env';
import { TouchableOpacity, View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCapital, setCapital, reset, getPurchases } from '../storage/DataStorage';
import { updatePrices } from '../component/UpdatePrice';

export default function StartScreen({ navigation }) {
  const [capital, setCapitalState] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState(null);
  const [marketOpen, setMarketOpen] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const storedCapital = await getCapital();
          const storedPurchases = await getPurchases();

          if (storedCapital !== null) {
            setCapitalState(storedCapital);
          } else {
            await setCapital(10000);
            setCapitalState(10000);
          }

          setPurchases(storedPurchases);
        } catch (e) {
          setError('Kunde inte ladda data.');
          console.error(e);
        }
      };

      loadData();
    }, [])
  );

  useEffect(() => {
    updatePrices(setPurchases);
    const interval = setInterval(() => updatePrices(setPurchases), 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${API_KEY}`);
        const data = await response.json();
        setMarketOpen(data.isOpen);
      } catch (error) {
        console.error('Kunde inte hämta marknadsstatus:', error);
      }
    };

    fetchMarketStatus();
  }, []);

  const handleReset = () => {
    Alert.alert(
      'Bekräfta återställning',
      'Är du säker på att du vill återställa allt?',
      [
        {
          text: 'Avbryt',
          style: 'cancel',
        },
        {
          text: 'Ja, återställ',
          style: 'destructive',
          onPress: async () => {
            try {
              await reset();
              setCapitalState(10000);
              setPurchases([]);
              alert('Kapitalet har återställts till 10,000 USD');
            } catch (error) {
              console.error('Fel vid återställning:', error);
              alert('Kunde inte återställa kapitalet.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  //Grupperar köp
  const groupedPurchases = purchases.reduce((acc, item) => {
    const key = item.symbol;
    if (!acc[key]) {
      acc[key] = { ...item };
    } else {
      acc[key].quantity += item.quantity;
      acc[key].total += item.total;
      acc[key].price = acc[key].total / acc[key].quantity;
    }
    return acc;
  }, {});

  const groupedList = Object.values(groupedPurchases);

  const totalValue = groupedList.reduce((total, item) => {
    if (item.latestPrice === undefined || isNaN(item.latestPrice)) return total;
    return total + (item.latestPrice * item.quantity);
  }, 0);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.purchaseItem}
      onPress={() => navigation.navigate('Sälj aktie', { item })}
    >
      <Text style={styles.symbol}>{item.symbol} ({item.name})</Text>
      {item.latestPrice !== undefined ? (
        <Text>
          {item.quantity} st för totalt {(item.latestPrice * item.quantity).toFixed(2)} USD
        </Text>
      ) : (
        <Text>Laddar in...</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Överblick</Text>
      <View style={styles.marketStatus}>
        <Text style={[styles.marketStatusText, { color: marketOpen ? 'green' : 'red' }]}>
          {marketOpen ? 'Marknaden är öppen' : 'Marknaden är stängd'}
        </Text>
        <Text style={styles.marketStatusText}>
          (Öppettid 16.30–23.00 mån–fre)
        </Text>
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.capital}>Tillgängligt kapital: {capital.toFixed(2)} USD </Text>
      )}
      <Text style={styles.totalStockValue}>Totalt aktie värde: {totalValue.toFixed(2)} USD</Text>
      <Text style={styles.portfolio}>Portföljens värde: {(capital + totalValue).toFixed(2)} USD</Text>
      <Text style={styles.sectionTitle}>Köpta aktier:</Text>
      <Text style={styles.stockLimit}>
        {groupedList.length} / 6 
      </Text>
      {groupedList.length === 0 ? (
        <Text style={styles.noData}>Inga köp.</Text>
      ) : (
        <FlatList
          data={groupedList}
          keyExtractor={(item) => item.symbol}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <View style={styles.bottomButtons}>
        <Button title="Sök aktie" onPress={() => navigation.navigate('Sök aktie')} />
        <Button title="Återställ" color="red" onPress={handleReset} />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 10,
  },
  capital: {
    marginTop: 12,
    fontSize: 16,
    color: 'blue',
  },
  totalStockValue: {
    fontSize: 16,
    color: 'green',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginVertical: 10,
  },
  bottomButtons: {
    marginBottom: 30,
    flexDirection: 'row',
    gap: 170, 
    marginVertical: 20,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  noData: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#777',
    marginTop: 10,
  },
  listContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  purchaseItem: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  symbol: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  portfolio: {
    fontSize: 18,
    marginTop: 2,
  },
  stockLimit: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  marketStatus: {
    marginBottom: 10,
    fontWeight: '500',
  },
  marketStatusText: {
  fontSize: 14, 
  fontWeight: '500',
},
});