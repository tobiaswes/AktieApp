import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCapital, setCapital, reset, getPurchases } from '../storage/DataStorage';
import { fetchLatestPrice } from '../component/GetLatestPrice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StartScreen({ navigation }) {
  const [capital, setCapitalState] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState(null);

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
    updatePrices(); 
    const interval = setInterval(() => {
      updatePrices(); 
    }, 30000);

    return () => clearInterval(interval); 
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

  const updatePrices = async () => {
  try {
    const oldPurchases = await getPurchases();

    const updated = await Promise.all(
      oldPurchases.map(async (item) => {
        const latestPrice = await fetchLatestPrice(item.symbol);
        return latestPrice
          ? { ...item, latestPrice }
          : item; 
      })
    );

    await AsyncStorage.setItem('purchases', JSON.stringify(updated));
    setPurchases(updated);
  } catch (error) {
    console.error('Fel vid uppdatering av priser:', error);
  }
};

  // Gruppera köp baserat på symbol
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
  const priceToUse = item.latestPrice || item.price;
  return total + (priceToUse * item.quantity);
}, 0);

  const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.purchaseItem}
    onPress={() => navigation.navigate('Sälj aktie', { item })}
  >
    <Text style={styles.symbol}>{item.symbol} ({item.name})</Text>
    <Text>Köpt {item.quantity} st för totalt {item.total.toFixed(2)} USD</Text>
    <Text>Snittpris/st: {item.price.toFixed(2)} USD</Text>
    {item.latestPrice && (
      <Text>Nuvarande pris: {item.latestPrice.toFixed(2)} USD</Text>
    )}
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Överblick</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.capital}>Tillgängligt kapital: {capital.toFixed(2)} USD </Text>
      )}
      <Text style={styles.totalStockValue}>Totalt aktie värde: {totalValue.toFixed(2)} USD</Text>
      <Text style={styles.portfolio}>Portföljens värde: {(capital + totalValue).toFixed(2)} USD</Text>
      <Text style={styles.sectionTitle}>Köpta aktier:</Text>
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
    fontSize: 24,
    marginTop: 40,
  },
  capital: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  totalStockValue: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 2,
  }
});