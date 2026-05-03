import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Text, useTheme, Surface, Divider } from 'react-native-paper';
import * as Location from 'expo-location';
import { getWeather } from '../services/weatherService';

export default function WeatherScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Position refusée. Météo de démo.');
        fetchWeather(5.30966, -4.01266); // Abidjan
        return;
      }
      try {
        let loc = await Location.getCurrentPositionAsync({});
        fetchWeather(loc.coords.latitude, loc.coords.longitude);
      } catch (err) {
        setErrorMsg("Impossible d'obtenir la position.");
        fetchWeather(5.30966, -4.01266);
      }
    })();
  }, []);

  const fetchWeather = async (lat, lon) => {
    const data = await getWeather(lat, lon);
    if (data) {
      setWeatherData(data);
    } else {
      setErrorMsg("Erreur météo.");
    }
    setLoading(false);
  };

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code > 0 && code < 4) return '⛅';
    if (code >= 50 && code < 70) return '🌧️';
    if (code >= 80) return '⛈️';
    return '🌥️';
  };

  const getDayName = (dateString, index) => {
    if (index === 0) return "Aujourd'hui";
    if (index === 1) return "Demain";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <Text style={styles.pageTitle}>Météo Agricole</Text>

      {weatherData && weatherData.current_weather && (
        <Surface style={styles.mainCard} elevation={4}>
          <Text style={styles.mainCardTitle}>Actuellement</Text>
          <View style={styles.currentWeatherRow}>
            <Text style={styles.bigIcon}>{getWeatherIcon(weatherData.current_weather.weathercode)}</Text>
            <View style={styles.currentDetails}>
              <Text style={styles.bigTemp}>{weatherData.current_weather.temperature}°C</Text>
              <Text style={styles.wind}>Vent: {weatherData.current_weather.windspeed} km/h</Text>
            </View>
          </View>
        </Surface>
      )}

      <Text style={styles.sectionTitle}>Prévisions sur 7 jours</Text>
      
      {weatherData && weatherData.daily && (
        <View style={styles.forecastContainer}>
          {weatherData.daily.time.map((time, index) => (
            <Surface key={index} style={styles.dailyCard} elevation={2}>
              <Text style={styles.dayName}>{getDayName(time, index)}</Text>
              <Text style={styles.dailyIcon}>{getWeatherIcon(weatherData.daily.weathercode[index])}</Text>
              <View style={styles.tempRange}>
                <Text style={styles.minTemp}>{Math.round(weatherData.daily.temperature_2m_min[index])}°</Text>
                <Text style={styles.maxTemp}>{Math.round(weatherData.daily.temperature_2m_max[index])}°</Text>
              </View>
              <Text style={styles.rainProb}>💧 {weatherData.daily.precipitation_probability_max[index]}%</Text>
            </Surface>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#B00020', textAlign: 'center', marginBottom: 10 },
  pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#2E7D32', marginBottom: 20, marginTop: 50 },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },
  mainCardTitle: { fontSize: 16, color: '#666', marginBottom: 10 },
  currentWeatherRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  bigIcon: { fontSize: 80 },
  currentDetails: { alignItems: 'flex-start' },
  bigTemp: { fontSize: 48, fontWeight: 'bold', color: '#333' },
  wind: { fontSize: 16, color: '#666' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  forecastContainer: { marginBottom: 30 },
  dailyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  dayName: { flex: 2, fontSize: 16, fontWeight: '500', textTransform: 'capitalize' },
  dailyIcon: { flex: 1, fontSize: 24, textAlign: 'center' },
  tempRange: { flex: 1.5, flexDirection: 'row', justifyContent: 'center' },
  minTemp: { fontSize: 16, color: '#888', marginRight: 10 },
  maxTemp: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  rainProb: { flex: 1, fontSize: 14, color: '#0277BD', textAlign: 'right' }
});
