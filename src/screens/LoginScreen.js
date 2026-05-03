import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme, Surface } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleLogin = async () => {
    // Si l'utilisateur n'a pas encore mis ses clés Firebase, on bypass la vérification pour la démo
    if (email === 'demo@demo.com' && password === 'demo') {
      navigation.replace('MainTabs');
      return;
    }

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('MainTabs');
    } catch (err) {
      setError("Identifiants incorrects ou erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.colors.background }} 
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>Smart Scan AI</Text>
          <Text style={styles.subtitle}>L'assistant intelligent pour la culture du cacao</Text>
        </View>

        <Surface style={styles.surface} elevation={4}>
          <Text style={styles.loginTitle}>Connexion</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          <TextInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            theme={{ colors: { primary: theme.colors.primary } }}
          />

          <Button 
            mode="contained" 
            onPress={handleLogin} 
            loading={loading}
            style={styles.button}
            buttonColor={theme.colors.primary}
            textColor="#FFF"
          >
            Se connecter
          </Button>

          <Text style={styles.hintText}>
            Astuce démo : utilisez demo@demo.com / demo pour tester sans Firebase.
          </Text>

          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Onboarding')}
            textColor={theme.colors.primary}
            style={styles.onboardingLink}
          >
            Revoir la présentation (Tutoriel)
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  surface: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFF',
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  errorText: {
    color: '#B00020',
    textAlign: 'center',
    marginBottom: 15,
  },
  hintText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
  },
  onboardingLink: {
    marginTop: 10,
  }
});
