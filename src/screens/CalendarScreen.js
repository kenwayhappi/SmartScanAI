import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, useTheme, Surface, Card, Title, Paragraph, List, Divider, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const TEMPLATE_STAGES = [
  {
    id: 1,
    title: 'Croissance',
    durationMonths: 0,
    description: 'Développement de la plante avant la première production.',
    recommendations: [
      'Maintenir un ombrage adéquat (50-70%).',
      'Désherbage régulier autour des jeunes plants.',
      'Taille de formation pour encourager une bonne structure.'
    ],
    weather_advice: 'Attention aux fortes chaleurs, assurez un bon arrosage ou paillage.',
    products: 'Engrais riche en azote et phosphore, fongicides préventifs.'
  },
  {
    id: 2,
    title: 'Floraison',
    durationMonths: 36, // floraison commence vers 3 ans
    description: 'Apparition des fleurs sur le tronc et les branches principales.',
    recommendations: [
      'Éviter les traitements chimiques agressifs qui pourraient tuer les insectes pollinisateurs (moucherons).',
      'Maintenir une bonne aération de la plantation.'
    ],
    weather_advice: 'Une forte pluie peut faire tomber les fleurs. Surveillez la météo.',
    products: 'Produits biologiques pour protéger sans nuire aux pollinisateurs.'
  },
  {
    id: 3,
    title: 'Développement des Cabosses',
    durationMonths: 41, // 5 mois après floraison
    description: 'Grossissement des cabosses de cacao après pollinisation.',
    recommendations: [
      'Surveillance accrue de la pourriture brune (Phytophthora).',
      'Retrait systématique des cabosses malades ou momifiées.',
      'Lutte contre les mirides (insectes piqueurs).'
    ],
    weather_advice: 'Période très sensible à l\'humidité. Les fortes pluies favorisent les champignons.',
    products: 'Fongicides à base de cuivre (bouillie bordelaise), insecticides spécifiques si attaque.'
  },
  {
    id: 4,
    title: 'Première Récolte',
    durationMonths: 43, // 7 mois après floraison environ
    description: 'Maturité des cabosses (jaunes ou oranges selon la variété).',
    recommendations: [
      'Récolter avec un outil tranchant et propre (sécateur) sans blesser le coussinet floral.',
      'Écabossage rapide après récolte (dans les 2 à 4 jours).',
      'Fermentation (5-7 jours) et séchage soigné.'
    ],
    weather_advice: 'Le séchage nécessite beaucoup de soleil. Préparez des abris en cas de pluie soudaine.',
    products: 'Sacs propres pour le stockage, traitement post-récolte des fèves si nécessaire.'
  }
];

export default function CalendarScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [calendar, setCalendar] = useState(null);
  const [plantationDate, setPlantationDate] = useState('');
  const [expandedId, setExpandedId] = useState(1);

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const docRef = doc(db, 'user_calendars', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setCalendar(docSnap.data());
      }
    } catch (error) {
      console.error("Erreur chargement calendrier:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendar = async () => {
    if (!plantationDate) {
      Alert.alert("Erreur", "Veuillez entrer une date de plantation (ex: 2024-05-10)");
      return;
    }

    setGenerating(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Non authentifié");

      const startDate = new Date(plantationDate);
      if (isNaN(startDate.getTime())) {
        Alert.alert("Erreur", "Format de date invalide. Utilisez AAAA-MM-JJ");
        setGenerating(false);
        return;
      }

      // Génération des étapes basées sur la date
      const generatedStages = TEMPLATE_STAGES.map(stage => {
        const stageDate = new Date(startDate);
        stageDate.setMonth(stageDate.getMonth() + stage.durationMonths);
        return {
          ...stage,
          estimatedDate: stageDate.toISOString().split('T')[0]
        };
      });

      const calendarData = {
        userId: user.uid,
        plantationDate: startDate.toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        stages: generatedStages
      };

      // Sauvegarde dans Firebase Firestore
      await setDoc(doc(db, 'user_calendars', user.uid), calendarData);
      setCalendar(calendarData);
      Alert.alert("Succès", "Votre calendrier personnalisé a été généré et sauvegardé avec succès !");
    } catch (error) {
      console.error("Erreur génération calendrier:", error);
      Alert.alert("Erreur", "Impossible de générer le calendrier.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!calendar) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Générer un Calendrier</Title>
        </View>
        <View style={[styles.content, styles.centerContent]}>
          <Paragraph style={styles.textCenter}>
            Entrez la date de plantation de votre champ (ou la date estimée) pour générer un calendrier de suivi sanitaire complet.
          </Paragraph>
          
          <TextInput
            mode="outlined"
            label="Date de plantation (AAAA-MM-JJ)"
            placeholder="2024-05-10"
            value={plantationDate}
            onChangeText={setPlantationDate}
            style={styles.input}
            activeOutlineColor={theme.colors.primary}
          />
          
          <Button 
            mode="contained" 
            onPress={generateCalendar} 
            loading={generating} 
            disabled={generating} 
            buttonColor={theme.colors.primary}
            style={styles.btn}
          >
            Générer avec l'IA et Sauvegarder
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Title style={styles.headerTitle}>Suivi Sanitaire</Title>
              <Paragraph style={styles.headerSubtitle}>
                Plantation : {calendar.plantationDate}
              </Paragraph>
            </View>
            <Button 
              mode="text" 
              onPress={() => {
                Alert.alert(
                  "Refaire le calendrier",
                  "Attention, cela effacera votre calendrier actuel de l'écran. Vous devrez entrer une nouvelle date. Voulez-vous continuer ?",
                  [
                    { text: "Annuler", style: "cancel" },
                    { text: "Oui, refaire", onPress: () => setCalendar(null), style: "destructive" }
                  ]
                );
              }} 
              textColor="#2E7D32"
            >
              Refaire
            </Button>
          </View>
        </View>
        
        <View style={styles.content}>

        {calendar.stages.map((stage, index) => (
          <Card key={stage.id} style={styles.card} elevation={3}>
            <List.Accordion
              title={`Étape ${index + 1}: ${stage.title} (${stage.estimatedDate})`}
              description={stage.description}
              left={props => <List.Icon {...props} icon="calendar-check" color={theme.colors.primary} />}
              expanded={expandedId === stage.id}
              onPress={() => setExpandedId(expandedId === stage.id ? 0 : stage.id)}
              titleStyle={styles.accordionTitle}
            >
              <View style={styles.stageContent}>
                <Text style={styles.sectionTitle}>Recommandations :</Text>
                {stage.recommendations.map((rec, i) => (
                  <Text key={i} style={styles.bulletPoint}>• {rec}</Text>
                ))}

                <Divider style={styles.divider} />
                
                <Text style={styles.sectionTitle}>⛅ Conseil Météo :</Text>
                <Text style={styles.textContent}>{stage.weather_advice}</Text>

                <Divider style={styles.divider} />

                <Text style={styles.sectionTitle}>🧪 Produits Recommandés :</Text>
                <Text style={styles.textContent}>{stage.products}</Text>
              </View>
            </List.Accordion>
          </Card>
        ))} 
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  btn: {
    paddingVertical: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  accordionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  stageContent: {
    padding: 15,
    backgroundColor: '#F9FBE7',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  bulletPoint: {
    marginLeft: 10,
    marginBottom: 3,
    color: '#555',
  },
  textContent: {
    color: '#555',
  },
  divider: {
    marginVertical: 10,
  }
});
