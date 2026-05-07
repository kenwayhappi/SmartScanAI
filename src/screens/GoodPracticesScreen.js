import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, useTheme, Surface, Card, Title, Paragraph } from 'react-native-paper';
import { getBonnesPratiques } from '../services/firebaseService';
import { useTranslation } from 'react-i18next';

// Données de secours si Firebase n'est pas configuré
const fallbackPratiques = [
  {
    id: '1',
    titre: 'Taille d\'entretien et sanitaire',
    description: 'La taille permet d\'aérer la plantation, favorisant l\'ensoleillement et limitant l\'humidité. Retirez systématiquement les branches mortes ou malades (gourmands, rameaux secs) pour éviter la prolifération des champignons.',
  },
  {
    id: '2',
    titre: 'Gestion de l\'ombrage',
    description: 'Le cacaoyer a besoin d\'un ombrage régulé (30% à 50%). Utilisez des arbres forestiers ou fruitiers (bananiers, agrumes) pour protéger les jeunes plants des rayons directs du soleil, surtout en saison sèche.',
  },
  {
    id: '3',
    titre: 'Récolte fréquente et sanitaire',
    description: 'Récoltez les cabosses mûres tous les 10 à 15 jours. Retirez impérativement les cabosses noires ou pourries (atteintes de la Pourriture Brune) et enterrez-les loin de la plantation.',
  },
  {
    id: '4',
    titre: 'Désherbage manuel régulier',
    description: 'Gardez la base des cacaoyers propre (sarclage) pour éviter la concurrence en nutriments et détruire les nids de rongeurs ou d\'insectes ravageurs. Le désherbage chimique est déconseillé pour la santé du sol.',
  },
  {
    id: '5',
    titre: 'Lutte intégrée contre les insectes',
    description: 'Privilégiez les méthodes naturelles (comme les fourmis tisserandes qui chassent les punaises) avant d\'utiliser des pesticides. Si l\'usage chimique est inévitable, respectez les dosages et les périodes ciblées.',
  },
  {
    id: '6',
    titre: 'Fertilisation organique',
    description: 'Utilisez les coques de cacao compostées comme engrais naturel. C\'est une excellente méthode pour recycler la matière organique et enrichir le sol en potassium et azote.',
  }
];

export default function GoodPracticesScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
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
      <Text style={styles.headerTitle}>{t('tips.title')}</Text>
      <Text style={styles.headerSubtitle}>{t('dashboard.welcome_sub')}</Text>

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
