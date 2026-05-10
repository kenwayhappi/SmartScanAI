import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';

import { theme } from './src/theme/theme';
import { auth } from './src/config/firebase';

// i18n setup
import './src/i18n';

// Navigators & Screens
import MainTabNavigator from './src/navigation/MainTabNavigator';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DiagnosticScreen from './src/screens/DiagnosticScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import GoodPracticesScreen from './src/screens/GoodPracticesScreen';

const Stack = createStackNavigator();

function NavigationWrapper() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Onboarding');

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté avec Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // L'utilisateur est connecté, on l'envoie directement sur le Dashboard (MainTabs)
        setInitialRoute('MainTabs');
      } else {
        // Non connecté, on lui montre l'Onboarding / Login
        setInitialRoute('Onboarding');
      }
      setLoading(false); // Fin du chargement
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Diagnostic" 
          component={DiagnosticScreen} 
          options={{ title: 'Résultat du Diagnostic' }} 
        />
        <Stack.Screen 
          name="Meteo" 
          component={WeatherScreen} 
          options={{ title: 'Météo et Prévisions' }} 
        />
        <Stack.Screen 
          name="Conseils" 
          component={GoodPracticesScreen} 
          options={{ title: 'Bonnes Pratiques' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationWrapper />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
