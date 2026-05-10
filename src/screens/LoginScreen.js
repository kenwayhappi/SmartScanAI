import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme, Surface } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t('auth.error_fill_fields'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('MainTabs');
    } catch (err) {
      setError(t('auth.error_login_failed'));
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
            <Text style={styles.loginTitle}>{t('auth.login_title')}</Text>
            
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

            <Button 
              mode="contained" 
              onPress={handleLogin} 
              loading={loading}
              style={styles.button}
              buttonColor={theme.colors.primary}
              textColor="#FFF"
            >
              {t('auth.login_button')}
            </Button>

            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('Register')}
              style={[styles.button, { marginTop: 15 }]}
              textColor={theme.colors.primary}
            >
              {t('auth.create_account_button')}
            </Button>

            <Button 
              mode="text" 
              onPress={() => navigation.navigate('Onboarding')}
              textColor={theme.colors.primary}
              style={styles.onboardingLink}
            >
              {t('auth.tutorial_link')}
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
    padding: 20,
    paddingTop: 80,
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
    marginTop: 20,
  }
});
