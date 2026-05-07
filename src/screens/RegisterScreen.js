import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme, Surface } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';

export default function RegisterScreen({ navigation }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError(t('auth.error_fill_fields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.error_password_mismatch'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Succès", "Votre compte a été créé avec succès.");
      // Après l'inscription, on renvoie vers le login
      navigation.replace('Login');
    } catch (err) {
      setError(t('auth.error_register_failed') + " (" + err.message + ")");
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
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>{t('auth.app_title')}</Text>
          <Text style={styles.subtitle}>{t('auth.app_subtitle')}</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000}>
          <Surface style={styles.surface} elevation={4}>
            <Text style={styles.loginTitle}>{t('auth.register_title')}</Text>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
              label={t('auth.email_label')}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <TextInput
              label={t('auth.password_label')}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <TextInput
              label={t('auth.confirm_password_label')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />

            <Button 
              mode="contained" 
              onPress={handleRegister} 
              loading={loading}
              style={styles.button}
              buttonColor={theme.colors.primary}
              textColor="#FFF"
            >
              {t('auth.register_button')}
            </Button>

            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Login')}
              textColor={theme.colors.primary}
              style={styles.onboardingLink}
            >
              {t('auth.back_to_login')}
            </Button>
          </Surface>
        </Animatable.View>
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
  onboardingLink: {
    marginTop: 10,
  }
});
