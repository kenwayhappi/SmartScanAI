import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Surface, Button, RadioButton, Divider } from 'react-native-paper';

// Données simulées en attendant Firestore
const mockQuestions = [
  {
    id: 1,
    question: "Quelle partie de la plante est affectée ?",
    options: ["Cabosse", "Feuilles", "Tronc"]
  },
  {
    id: 2,
    question: "Quelle est la couleur de la tache ou de l'anomalie ?",
    options: ["Brune/Noire", "Jaune", "Blanche"]
  }
];

const mockResult = {
  maladie: "Pourriture Brune",
  causes: "Champignon Phytophthora palmivora, favorisé par l'humidité et le manque d'ensoleillement.",
  consequences: "Perte pouvant aller jusqu'à 80% de la production si non traitée. Contamination rapide des autres cabosses.",
  solutions: [
    "Récolter fréquemment et éliminer les cabosses pourries loin du champ.",
    "Élaguer les arbres pour améliorer la circulation de l'air.",
    "Appliquer un fongicide à base de cuivre en début de saison des pluies."
  ]
};

export default function DiagnosticScreen({ navigation }) {
  const theme = useTheme();
  const [step, setStep] = useState(0); // 0 = questionnaire, 1 = résultat
  const [answers, setAnswers] = useState({});

  const handleNext = () => {
    // Si on a fini les questions
    if (Object.keys(answers).length >= mockQuestions.length) {
      setStep(1);
    }
  };

  const renderQuestionnaire = () => (
    <Surface style={styles.card} elevation={3}>
      <Text style={styles.title}>Affinez le diagnostic</Text>
      <Text style={styles.subtitle}>Aidez l'IA en répondant à ces questions :</Text>

      {mockQuestions.map((q, i) => (
        <View key={q.id} style={styles.questionBlock}>
          <Text style={styles.questionText}>{i + 1}. {q.question}</Text>
          <RadioButton.Group 
            onValueChange={value => setAnswers({ ...answers, [q.id]: value })} 
            value={answers[q.id]}
          >
            {q.options.map((opt, j) => (
              <View style={styles.radioRow} key={j}>
                <RadioButton value={opt} color={theme.colors.primary} />
                <Text>{opt}</Text>
              </View>
            ))}
          </RadioButton.Group>
        </View>
      ))}

      <Button 
        mode="contained" 
        onPress={handleNext} 
        buttonColor={theme.colors.primary}
        disabled={Object.keys(answers).length < mockQuestions.length}
        style={styles.button}
      >
        Lancer l'analyse
      </Button>
    </Surface>
  );

  const renderResult = () => (
    <Surface style={[styles.card, { borderColor: theme.colors.error, borderWidth: 1 }]} elevation={3}>
      <View style={styles.resultHeader}>
        <Text style={styles.alertIcon}>⚠️</Text>
        <Text style={[styles.title, { color: theme.colors.error }]}>Maladie détectée</Text>
      </View>
      
      <Text style={styles.diseaseName}>{mockResult.maladie}</Text>
      
      <Divider style={styles.divider} />
      
      <Text style={styles.sectionTitle}>Causes :</Text>
      <Text style={styles.text}>{mockResult.causes}</Text>

      <Text style={styles.sectionTitle}>Conséquences :</Text>
      <Text style={styles.text}>{mockResult.consequences}</Text>

      <Text style={styles.sectionTitle}>Solutions recommandées :</Text>
      {mockResult.solutions.map((sol, idx) => (
        <Text key={idx} style={styles.listItem}>• {sol}</Text>
      ))}

      <Button 
        mode="outlined" 
        onPress={() => navigation.navigate('Dashboard')} 
        textColor={theme.colors.primary}
        style={[styles.button, { marginTop: 30 }]}
      >
        Retour à l'accueil
      </Button>
    </Surface>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {step === 0 ? renderQuestionnaire() : renderResult()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFF',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  questionBlock: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  diseaseName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  divider: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginLeft: 10,
    marginBottom: 5,
  }
});
