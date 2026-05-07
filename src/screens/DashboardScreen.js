import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { Text, useTheme, Surface, Card, ActivityIndicator } from 'react-native-paper';
import * as Location from 'expo-location';
import { getWeather } from '../services/weatherService';
import { useTranslation } from 'react-i18next';

export default function DashboardScreen({ navigation }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        fetchWeather(5.30966, -4.01266); // Abidjan par défaut
        return;
      }
      try {
        let loc = await Location.getCurrentPositionAsync({});
        fetchWeather(loc.coords.latitude, loc.coords.longitude);
      } catch (err) {
        fetchWeather(5.30966, -4.01266);
      }
    })();
  }, []);

  const fetchWeather = async (lat, lon) => {
    const data = await getWeather(lat, lon);
    if (data && data.current_weather) {
      setWeather(data.current_weather);
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code > 0 && code < 4) return '⛅';
    if (code >= 50 && code < 70) return '🌧️';
    if (code >= 80) return '⛈️';
    return '🌥️';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{t('dashboard.welcome')}</Text>
        <Text style={styles.subText}>{t('dashboard.welcome_sub')}</Text>
      </View>

      <View style={styles.content}>
        {/* Widget Météo Rapide */}
        <TouchableOpacity onPress={() => navigation.navigate('Meteo')}>
          <Surface style={styles.weatherWidget} elevation={3}>
            {weather ? (
              <View style={styles.weatherRow}>
                <Text style={styles.weatherIcon}>{getWeatherIcon(weather.weathercode)}</Text>
                <View>
                  <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
                  <Text style={styles.weatherDesc}>{t('dashboard.quick_weather')}</Text>
                </View>
              </View>
            ) : (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            )}
          </Surface>
        </TouchableOpacity>

        {/* CTA Principal */}
        <Text style={styles.sectionTitle}>{t('dashboard.what_to_do')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Scan')}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1611077541295-2d4e8c156644?q=80&w=600&auto=format&fit=crop' }} 
            style={styles.ctaCard}
            imageStyle={{ borderRadius: 15 }}
          >
            <View style={styles.ctaOverlay}>
              <Text style={styles.ctaIcon}>📷</Text>
              <Text style={styles.ctaTitle}>{t('dashboard.new_scan')}</Text>
              <Text style={styles.ctaSubtitle}>{t('dashboard.scan_desc')}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Astuce du jour */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{t('dashboard.tip_of_day')}</Text>
        <Card style={styles.tipCard} elevation={2} onPress={() => navigation.navigate('Conseils')}>
          <Card.Content style={styles.tipContent}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>{t('dashboard.tip_title')}</Text>
              <Text style={styles.tipDesc} numberOfLines={2}>{t('dashboard.tip_desc')}</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' },
  subText: { fontSize: 16, color: '#666', marginTop: 5 },
  content: { padding: 20 },
  weatherWidget: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  weatherRow: { flexDirection: 'row', alignItems: 'center' },
  weatherIcon: { fontSize: 40, marginRight: 15 },
  weatherTemp: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  weatherDesc: { fontSize: 12, color: '#888' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  ctaCard: {
    height: 160,
    borderRadius: 15,
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  ctaOverlay: {
    backgroundColor: 'rgba(46, 125, 50, 0.8)',
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'column',
  },
  ctaIcon: { fontSize: 24, marginBottom: 5 },
  ctaTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  ctaSubtitle: { fontSize: 14, color: '#E8F5E9' },
  tipCard: { borderRadius: 15, backgroundColor: '#fff' },
  tipContent: { flexDirection: 'row', alignItems: 'center' },
  tipIcon: { fontSize: 30, marginRight: 15 },
  tipTextContainer: { flex: 1 },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  tipDesc: { fontSize: 13, color: '#666', lineHeight: 18 },
});
