import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface, Avatar, SegmentedButtons } from 'react-native-paper';
import { signOut, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  // États locaux (Profil utilisateur)
  const [nom, setNom] = useState('Happi');
  const [exploitation, setExploitation] = useState('Plantation de la Mé');

  // États de sécurité (Authentification)
  const [currentEmail, setCurrentEmail] = useState(auth.currentUser?.email || '');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Langue
  const [language, setLanguage] = useState(i18n.language.startsWith('fr') ? 'fr' : 'en');

  const handleLanguageChange = (val) => {
    setLanguage(val);
    i18n.changeLanguage(val);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      navigation.replace('Login');
    }
  };

  const reauthenticate = async (password) => {
    const user = auth.currentUser;
    if (!user) return false;
    const credential = EmailAuthProvider.credential(user.email, password);
    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      Alert.alert("Erreur", t('profile.error_auth_failed'));
      return false;
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // 1. Réauthentification si on veut changer email ou mot de passe
      if (newEmail !== '' || newPassword !== '') {
        if (!oldPassword) {
          Alert.alert("Requis", t('profile.error_req_old_pass'));
          setLoading(false);
          return;
        }

        const isAuth = await reauthenticate(oldPassword);
        if (!isAuth) {
          setLoading(false);
          return;
        }

        // 2. Mise à jour de l'Email
        if (newEmail !== '' && newEmail !== currentEmail) {
          if (auth.currentUser) {
            await updateEmail(auth.currentUser, newEmail);
            setCurrentEmail(newEmail);
          }
        }

        // 3. Mise à jour du mot de passe
        if (newPassword !== '') {
          if (auth.currentUser) {
            await updatePassword(auth.currentUser, newPassword);
          }
        }
      }

      Alert.alert("Succès", t('profile.success_update'));
      setIsEditing(false);
      setOldPassword('');
      setNewPassword('');
      setNewEmail('');

    } catch (error) {
      Alert.alert("Erreur", t('profile.error_update'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.header}>
        <Avatar.Text size={80} label={nom.charAt(0)} style={{ backgroundColor: theme.colors.primary }} />
        <Text style={styles.name}>{nom}</Text>
        <Text style={styles.email}>{currentEmail}</Text>
      </View>

      <Surface style={styles.surface} elevation={2}>
        <Text style={styles.sectionTitle}>{t('profile.my_info')}</Text>

        <TextInput
          label={t('profile.full_name')}
          value={nom}
          onChangeText={setNom}
          disabled={!isEditing}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label={t('profile.farm_name')}
          value={exploitation}
          onChangeText={setExploitation}
          disabled={!isEditing}
          mode="outlined"
          style={styles.input}
        />

        {isEditing && (
          <View style={styles.securitySection}>
            <Text style={styles.securityTitle}>{t('profile.security')}</Text>

            <TextInput
              label={t('profile.new_email')}
              value={newEmail}
              onChangeText={setNewEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              label={t('profile.new_password')}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              right={
                <TextInput.Icon 
                  icon={showNewPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowNewPassword(!showNewPassword)} 
                />
              }
              mode="outlined"
              style={styles.input}
            />

            {(newEmail !== '' || newPassword !== '') && (
              <TextInput
                label={t('profile.old_password')}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showOldPassword}
                right={
                  <TextInput.Icon 
                    icon={showOldPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowOldPassword(!showOldPassword)} 
                  />
                }
                mode="outlined"
                style={[styles.input, { borderColor: theme.colors.error }]}
              />
            )}
          </View>
        )}

        {isEditing ? (
          <View style={styles.actionButtons}>
            <Button mode="outlined" onPress={() => setIsEditing(false)} style={{ flex: 1, marginRight: 10 }}>
              {t('profile.cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={loading}
              buttonColor={theme.colors.success}
              style={{ flex: 1 }}
            >
              {t('profile.save')}
            </Button>
          </View>
        ) : (
          <Button
            mode="outlined"
            onPress={() => setIsEditing(true)}
            textColor={theme.colors.primary}
            style={styles.button}
            icon="pencil"
          >
            {t('profile.edit_profile')}
          </Button>
        )}
      </Surface>

      {/* Préférences de langue */}
      <Surface style={styles.surface} elevation={2}>
        <Text style={styles.sectionTitle}>{t('profile.language_pref')}</Text>
        <Text style={{ marginBottom: 10, color: '#666' }}>{t('profile.select_language')}</Text>
        <SegmentedButtons
          value={language}
          onValueChange={handleLanguageChange}
          buttons={[
            { value: 'fr', label: 'Français' },
            { value: 'en', label: 'English' },
          ]}
          theme={{ colors: { secondaryContainer: theme.colors.primaryContainer } }}
        />
      </Surface>

      <Button
        mode="text"
        onPress={handleLogout}
        textColor={theme.colors.error}
        style={styles.logoutButton}
        icon="logout"
      >
        {t('profile.logout')}
      </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 15 },
  email: { fontSize: 14, color: '#666', marginTop: 5 },
  surface: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFF',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  securitySection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  securityTitle: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 15 },
  input: { marginBottom: 15, backgroundColor: '#FFF' },
  button: { marginTop: 10 },
  actionButtons: { flexDirection: 'row', marginTop: 10 },
  logoutButton: { marginHorizontal: 20, marginBottom: 40 }
});
