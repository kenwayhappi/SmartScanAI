import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Surface, Button, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

// Données simulées en attendant Firestore
const mockQuestions = [
  {
    id: 1,
    question: "Sur quelle partie du plant avez-vous pris la photo ?",
    options: ["La cabosse", "Les jeunes feuilles", "Le tronc ou les branches"]
  },
  {
    id: 2,
    question: "Quelle est l'apparence précise du symptôme ?",
    options: ["Tache brune/noire qui s'étend", "Feuilles qui rougissent/gonflent", "Trous ou morsures d'insectes"]
  },
  {
    id: 3,
    question: "Quelle est la texture ou l'odeur du problème ?",
    options: ["Dure, moisie avec duvet blanc", "Sèche et craquante", "Rien de particulier"]
  },
  {
    id: 4,
    question: "Le problème se propage-t-il aux plantes voisines ?",
    options: ["Oui, très rapidement", "Non, c'est isolé", "Je ne sais pas"]
  }
];

const mockResult = {
  maladie: "Pourriture Brune des Cabosses (Phytophthora)",
  causes: "Maladie fongique causée par le champignon Phytophthora palmivora. Très virulente pendant la saison des pluies (forte humidité) ou dans les champs mal entretenus et trop ombragés.",
  symptomes: "Apparition de taches brunes qui noircissent rapidement sur la cabosse. Parfois accompagnée d'un duvet blanc sporulé au centre. Les fèves à l'intérieur pourrissent totalement.",
  consequences: "Sans intervention, cette maladie peut décimer entre 30% et 80% de votre récolte. Elle contamine extrêmement vite les autres arbres via l'eau de pluie ou les outils non désinfectés.",
  solutions: [
    "Action curative : Retirez immédiatement toutes les cabosses atteintes, sortez-les de la plantation et enterrez-les.",
    "Entretien : Ébranchez (taillez) les arbres pour permettre à l'air de circuler et au soleil de sécher les plants.",
    "Hygiène : Désinfectez régulièrement vos sécateurs et machettes à l'eau de Javel.",
    "Traitement : En cas de forte épidémie, pulvérisez un fongicide à base de cuivre (bouillie bordelaise) au début des pluies."
  ]
};

export default function DiagnosticScreen({ navigation }) {
  const theme = useTheme();
  const { t } = useTranslation();
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
            {q.options.map((opt, j) => {
              const isSelected = answers[q.id] === opt;
              return (
                <TouchableOpacity 
                  key={j}
                  style={[
                    styles.radioRow, 
                    isSelected && { borderColor: theme.colors.primary, backgroundColor: '#E8F5E9' }
                  ]}
                  onPress={() => setAnswers({ ...answers, [q.id]: opt })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioCircle, isSelected && { borderColor: theme.colors.primary }]}>
                    {isSelected && <View style={[styles.selectedRb, { backgroundColor: theme.colors.primary }]} />}
                  </View>
                  <Text style={[styles.radioText, isSelected && { color: theme.colors.primary, fontWeight: 'bold' }]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
        <Text style={[styles.title, { color: theme.colors.error }]}>{t('diagnostic.found_disease')}</Text>
      </View>
      
      <Text style={styles.diseaseName}>{mockResult.maladie}</Text>
      
      <Divider style={styles.divider} />
      
      <Text style={styles.sectionTitle}>{t('diagnostic.symptoms')}</Text>
      <Text style={styles.text}>{mockResult.symptomes}</Text>

      <Text style={styles.sectionTitle}>Causes :</Text>
      <Text style={styles.text}>{mockResult.causes}</Text>

      <Text style={styles.sectionTitle}>Conséquences :</Text>
      <Text style={styles.text}>{mockResult.consequences}</Text>

      <Text style={styles.sectionTitle}>{t('diagnostic.treatment')}</Text>
      {mockResult.solutions.map((sol, idx) => (
        <Text key={idx} style={styles.listItem}>• {sol}</Text>
      ))}

      <Button 
        mode="outlined" 
        onPress={() => navigation.navigate('MainTabs')} 
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
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
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
