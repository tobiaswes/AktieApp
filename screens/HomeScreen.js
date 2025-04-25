import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Startsidans innehåll</Text>
      <Button
        title="Gå till detaljer"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}