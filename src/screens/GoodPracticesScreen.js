import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, useTheme, Surface, Card, Title, Paragraph } from 'react-native-paper';
import { getBonnesPratiques } from '../services/firebaseService';

// Données de secours si Firebase n'est pas configuré
const fallbackPratiques = [
  {
    id: '1',
    titre: 'Taille de formation',
    description: 'Effectuez une taille régulière pour aérer le plant et limiter l\'humidité, propice aux champignons.',
  },
  {
    id: '2',
    titre: 'Ombrage',
    description: 'Maintenez un ombrage adéquat (environ 30 à 50%) avec des arbres forestiers pour protéger les jeunes cacaoyers.',
  },
  {
    id: '3',
    titre: 'Récolte sanitaire',
    description: 'Retirez systématiquement les cabosses pourries ou malades lors de la récolte pour éviter la propagation.',
  }
];

export default function GoodPracticesScreen() {
  const theme = useTheme();
  const [pratiques, setPratiques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPratiques();
  }, []);

  const loadPratiques = async () => {
    try {
      const data = await getBonnesPratiques();
      if (data && data.length > 0) {
        setPratiques(data);
      } else {
        setPratiques(fallbackPratiques);
      }
    } catch (error) {
      setPratiques(fallbackPratiques);
    } finally {
      setLoading(false);
    }
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
      <Text style={styles.headerTitle}>Bonnes Pratiques Agricoles</Text>
      <Text style={styles.headerSubtitle}>Conseils d'experts pour optimiser votre rendement.</Text>

      {pratiques.map((pratique, index) => (
        <Card key={pratique.id || index} style={styles.card} elevation={2}>
          <Card.Content>
            <View style={styles.titleRow}>
              <Text style={styles.icon}>💡</Text>
              <Title style={[styles.title, { color: theme.colors.primary }]}>{pratique.titre}</Title>
            </View>
            <Paragraph style={styles.description}>{pratique.description}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 50,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: '#555',
    lineHeight: 22,
  }
});
