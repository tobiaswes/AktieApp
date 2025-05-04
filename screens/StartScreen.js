import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Startsidan</Text>

      <View style={styles.bottomButtons}>
        <Button title="Sök aktie" onPress={() => navigation.navigate('Search')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'space-between', 
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginTop: 40,
  },
  bottomButtons: {
    marginBottom: 30,
  },
});