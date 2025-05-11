import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from './screens/StartScreen';
import SearchScreen from './screens/SearchScreen';
import BuyScreen from './screens/BuyScreen';

import SellScreen from './screens/SellScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Portfölj">
        <Stack.Screen name="Portfölj" component={StartScreen} />
        <Stack.Screen name="Sök aktie" component={SearchScreen} />
        <Stack.Screen name="Köp aktie" component={BuyScreen} />
        <Stack.Screen name="Sälj aktie" component={SellScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}