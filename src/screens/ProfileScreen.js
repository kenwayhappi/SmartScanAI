import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface, Avatar } from 'react-native-paper';
import { signOut, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();

  // États locaux (Profil utilisateur)
  const [nom, setNom] = useState('Happi');
  const [exploitation, setExploitation] = useState('Plantation de la Mé');

  // États de sécurité (Authentification)
  const [currentEmail, setCurrentEmail] = useState(auth.currentUser?.email || 'demo@demo.com');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!user || user.email === 'demo@demo.com') return true; // Bypass for demo
    const credential = EmailAuthProvider.credential(user.email, password);
    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      Alert.alert("Erreur", "L'ancien mot de passe est incorrect.");
      return false;
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // 1. Réauthentification si on veut changer email ou mot de passe
      if (newEmail !== '' || newPassword !== '') {
        if (!oldPassword) {
          Alert.alert("Requis", "Vous devez renseigner votre ancien mot de passe pour des raisons de sécurité.");
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
          if (auth.currentUser && auth.currentUser.email !== 'demo@demo.com') {
            await updateEmail(auth.currentUser, newEmail);
            setCurrentEmail(newEmail);
          }
        }

        // 3. Mise à jour du mot de passe
        if (newPassword !== '') {
          if (auth.currentUser && auth.currentUser.email !== 'demo@demo.com') {
            await updatePassword(auth.currentUser, newPassword);
          }
        }
      }

      // 4. (Optionnel) Mise à jour des autres infos (nom, exploitation) dans Firestore ici

      Alert.alert("Succès", "Votre profil a été mis à jour avec succès.");
      setIsEditing(false);
      setOldPassword('');
      setNewPassword('');
      setNewEmail('');

    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={nom.charAt(0)} style={{ backgroundColor: theme.colors.primary }} />
        <Text style={styles.name}>{nom}</Text>
        <Text style={styles.email}>{currentEmail}</Text>
      </View>

      <Surface style={styles.surface} elevation={2}>
        <Text style={styles.sectionTitle}>Mes informations</Text>

        <TextInput
          label="Nom complet"
          value={nom}
          onChangeText={setNom}
          disabled={!isEditing}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Nom de l'exploitation"
          value={exploitation}
          onChangeText={setExploitation}
          disabled={!isEditing}
          mode="outlined"
          style={styles.input}
        />

        {isEditing && (
          <View style={styles.securitySection}>
            <Text style={styles.securityTitle}>Sécurité (Optionnel)</Text>

            <TextInput
              label="Nouvel Email"
              value={newEmail}
              onChangeText={setNewEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              label="Nouveau Mot de passe"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
            />

            {(newEmail !== '' || newPassword !== '') && (
              <TextInput
                label="Ancien mot de passe (Requis)"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
                mode="outlined"
                style={[styles.input, { borderColor: theme.colors.error }]}
              />
            )}
          </View>
        )}

        {isEditing ? (
          <View style={styles.actionButtons}>
            <Button mode="outlined" onPress={() => setIsEditing(false)} style={{ flex: 1, marginRight: 10 }}>
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={loading}
              buttonColor={theme.colors.success}
              style={{ flex: 1 }}
            >
              Enregistrer
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
            Modifier le profil
          </Button>
        )}
      </Surface>

      <Button
        mode="text"
        onPress={handleLogout}
        textColor={theme.colors.error}
        style={styles.logoutButton}
        icon="logout"
      >
        Se déconnecter
      </Button>
    </ScrollView>
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
