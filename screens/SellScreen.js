import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Importera useFocusEffect
import { getPurchases, updateStockPurchase, removeStockPurchase, getCapital, setCapital } from '../storage/DataStorage'; // Importera lagringsfunktioner

export default function SellScreen({ route }) {
  const { item: initialItem } = route.params; 
  const [sellAmount, setSellAmount] = useState(1);
  const [capital, setCapitalState] = useState(0);
  const [item, setItem] = useState(initialItem);  
  const [purchases, setPurchases] = useState([]);

  
  useEffect(() => {
    const loadData = async () => {
      const currentPurchases = await getPurchases();
      setPurchases(currentPurchases);

      const currentCapital = await getCapital();
      setCapitalState(currentCapital);
    };

    loadData();
  }, []);

  
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const currentPurchases = await getPurchases();
        setPurchases(currentPurchases);

        const currentCapital = await getCapital();
        setCapitalState(currentCapital);
      };

      loadData();
    }, [])
  );

  const increase = () => {
    if (sellAmount < item.quantity) setSellAmount(sellAmount + 1);
  };

  const decrease = () => {
    if (sellAmount > 1) setSellAmount(sellAmount - 1);
  };

  // Funktion för att hantera försäljning
  const handleSell = async () => {
    try {
      // Uppdatera lagret med den nya mängden aktier eller ta bort aktien om mängden blir 0
      await updateStockPurchase(item.symbol, sellAmount);

      // Om mängden aktier blir 0 efter försäljning, ta bort aktien från lagret
      if (item.quantity - sellAmount <= 0) {
        await removeStockPurchase(item.symbol);
        setItem(null);  // Om aktien är helt såld, ta bort den från state
      } else {
        // Uppdatera item's quantity om aktien fortfarande finns kvar
        setItem({ ...item, quantity: item.quantity - sellAmount });
      }

      // Uppdatera kapitalet genom att addera försäljningssumman till kapitalet
      const saleAmount = item.price * sellAmount;  
      const newCapital = capital + saleAmount;
      await setCapital(newCapital);

      // Uppdatera lokalt kapital och aktieköp
      setCapitalState(newCapital);
      setPurchases(await getPurchases());  // Uppdatera aktieköp efter försäljning

      Alert.alert('Försäljning lyckades', `Du har sålt ${sellAmount} aktie${sellAmount > 1 ? 'r' : ''} av ${item.symbol}`);
    } catch (error) {
      console.error('Fel vid försäljning:', error);
      Alert.alert('Något gick fel', 'Försäljningen misslyckades, försök igen senare.');
    }
  };

  return (
    <View style={styles.container}>
      {item && (
        <View style={styles.card}>
          <Text style={styles.symbol}>{item.symbol} ({item.name})</Text>
          <Text style={styles.detail}>Antal: {item.quantity}</Text>
          <Text style={styles.detail}>Snittpris: {item.price.toFixed(2)} USD</Text>
          <Text style={styles.detail}>Totalt: {(item.quantity * item.price).toFixed(2)} USD</Text>
        </View>
      )}

      <Text style={styles.chooseLabel}>Välj antal att sälja:</Text>
      <View style={styles.counter}>
        <TouchableOpacity onPress={decrease} style={styles.counterButton}>
          <Text style={styles.counterButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{sellAmount}</Text>
        <TouchableOpacity onPress={increase} style={styles.counterButton}>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Button title={`Sälj ${sellAmount} aktie${sellAmount > 1 ? 'r' : ''}`} onPress={handleSell} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  symbol: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  chooseLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  counterButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 20,
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

