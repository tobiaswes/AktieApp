import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function StartScreen({ navigation }) {
  const [capital, setCapital] = useState(10000); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Överblick</Text>

      <Text style={styles.capital}>Eget kapital: {capital.toFixed(2)} USD</Text>

      <View style={styles.bottomButtons}>
        <Button title="Sök aktie" onPress={() => navigation.navigate('Search')} />
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
  },
  bottomButtons: {
    marginBottom: 30,
  },
});