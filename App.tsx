import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GirisEkrani from './screens/auth/GirisEkrani';
import KayitEkrani from './screens/auth/KayitEkrani';
import OnboardingEkrani from './screens/onboarding/OnboardingEkrani';
import MainNavigator from './screens/main/MainNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Giris"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Giris" component={GirisEkrani} />
        <Stack.Screen name="Kayit" component={KayitEkrani} />
        <Stack.Screen name="Onboarding" component={OnboardingEkrani} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}