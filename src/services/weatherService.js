// On utilise l'API gratuite Open-Meteo qui ne nécessite pas de clé d'API
export const getWeather = async (lat, lon) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la météo:", error);
    return null;
  }
};
