import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { API_KEY } from '@env';

export default function HomeScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchStock = () => {
    if (!searchTerm) return;
    setLoading(true);
    setCompanies([]); 

    fetch(`https://finnhub.io/api/v1/search?q=${searchTerm}&exchange=US&token=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        const results = data.result.filter(item => item.symbol && item.description);
        setCompanies(results);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fel vid sökning:', error);
        setLoading(false);
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Details', { symbol: item.symbol })}
    >
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Sök aktie"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
      />
      <Button title="Sök" onPress={searchStock} />

      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}

      <FlatList
        data={companies}
        keyExtractor={(item, index) => item.symbol + index}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  symbol: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});