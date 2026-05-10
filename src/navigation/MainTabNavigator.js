import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ScanScreen from '../screens/ScanScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ChatBotScreen from '../screens/ChatBotScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = '🏠';
          } else if (route.name === 'Scan') {
            iconName = '📷';
          } else if (route.name === 'Calendrier') {
            iconName = '📅';
          } else if (route.name === 'ChatIA') {
            iconName = '🤖';
          } else if (route.name === 'Profil') {
            iconName = '👤';
          }

          return <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        }
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: t('tabs.home') }} />
      <Tab.Screen name="Calendrier" component={CalendarScreen} options={{ title: t('tabs.calendar') }} />
      
      {/* Bouton de scan central plus stylé */}
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{ 
          title: t('tabs.scan'),
          tabBarIcon: () => (
            <View style={{
              backgroundColor: theme.colors.primary,
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -30, // fait flotter le bouton
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}>
              <Text style={{ fontSize: 30 }}>📷</Text>
            </View>
          )
        }} 
      />
      
      <Tab.Screen name="ChatIA" component={ChatBotScreen} options={{ title: t('tabs.chat') }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: t('tabs.profile') }} />
    </Tab.Navigator>
  );
}
