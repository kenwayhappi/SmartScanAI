import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, Avatar, SegmentedButtons, List, Divider } from 'react-native-paper';
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
  const [loading, setLoading] = useState(false);

  // Accordeons
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [expandedSecurity, setExpandedSecurity] = useState(false);

  // Langue
  const [language, setLanguage] = useState(i18n.language.startsWith('fr') ? 'fr' : 'en');

  const handleLanguageChange = (val) => {
    setLanguage(val);
    i18n.changeLanguage(val);
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.disconnect'),
      t('profile.disconnect_confirm'),
      [
        { text: t('profile.cancel'), style: "cancel" },
        {
          text: t('profile.disconnect'),
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Login');
            } catch (error) {
              navigation.replace('Login');
            }
          }
        }
      ]
    );
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

  const handleSaveSecurity = async () => {
    if (!oldPassword) {
      Alert.alert("Requis", t('profile.error_req_old_pass'));
      return;
    }
    setLoading(true);
    try {
      const isAuth = await reauthenticate(oldPassword);
      if (!isAuth) {
        setLoading(false);
        return;
      }

      if (newEmail !== '' && newEmail !== currentEmail) {
        await updateEmail(auth.currentUser, newEmail);
        setCurrentEmail(newEmail);
      }

      if (newPassword !== '') {
        await updatePassword(auth.currentUser, newPassword);
      }

      Alert.alert("Succès", t('profile.success_update'));
      setOldPassword('');
      setNewPassword('');
      setNewEmail('');
      setExpandedSecurity(false);
    } catch (error) {
      Alert.alert("Erreur", t('profile.error_update'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = () => {
    Alert.alert("Succès", t('profile.success_update'));
    setExpandedInfo(false);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#f4f6f8' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Profil Pro */}
        <View style={styles.headerPro}>
          <Avatar.Text size={90} label={nom.charAt(0)} style={{ backgroundColor: '#fff' }} color={theme.colors.primary} />
          <Text style={styles.namePro}>{nom}</Text>
          <Text style={styles.emailPro}>{currentEmail}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('profile.farm_owner')}</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsContainer}>
          <List.Section>
            <List.Subheader style={styles.subheader}>{t('profile.account_settings')}</List.Subheader>
            
            {/* Infos Personnelles */}
            <List.Accordion
              title={t('profile.personal_info')}
              description={t('profile.edit_name_farm')}
              left={props => <List.Icon {...props} icon="account-edit" color={theme.colors.primary} />}
              expanded={expandedInfo}
              onPress={() => setExpandedInfo(!expandedInfo)}
              style={styles.accordion}
            >
              <View style={styles.accordionContent}>
                <TextInput
                  label={t('profile.full_name')}
                  value={nom}
                  onChangeText={setNom}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label={t('profile.farm_name')}
                  value={exploitation}
                  onChangeText={setExploitation}
                  mode="outlined"
                  style={styles.input}
                />
                <Button 
                  mode="contained" 
                  onPress={handleSaveInfo}
                  style={styles.saveBtn}
                  buttonColor={theme.colors.primary}
                >
                  {t('profile.save')}
                </Button>
              </View>
            </List.Accordion>
            <Divider />

            {/* Sécurité */}
            <List.Accordion
              title={t('profile.security_creds')}
              description={t('profile.email_password')}
              left={props => <List.Icon {...props} icon="shield-lock" color={theme.colors.primary} />}
              expanded={expandedSecurity}
              onPress={() => setExpandedSecurity(!expandedSecurity)}
              style={styles.accordion}
            >
              <View style={styles.accordionContent}>
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
                  right={<TextInput.Icon icon={showNewPassword ? "eye-off" : "eye"} onPress={() => setShowNewPassword(!showNewPassword)} />}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label={t('profile.old_password_req')}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry={!showOldPassword}
                  right={<TextInput.Icon icon={showOldPassword ? "eye-off" : "eye"} onPress={() => setShowOldPassword(!showOldPassword)} />}
                  mode="outlined"
                  style={[styles.input, { borderColor: theme.colors.error }]} // visual warning that it's required
                />
                <Button 
                  mode="contained" 
                  onPress={handleSaveSecurity}
                  loading={loading}
                  style={styles.saveBtn}
                  buttonColor={theme.colors.primary}
                >
                  {t('profile.update_security')}
                </Button>
              </View>
            </List.Accordion>
            <Divider />

            <List.Subheader style={styles.subheader}>{t('profile.preferences')}</List.Subheader>

            {/* Langue */}
            <List.Item
              title={t('profile.app_language')}
              description="Français / English"
              left={props => <List.Icon {...props} icon="translate" color={theme.colors.primary} />}
              style={styles.accordion}
              onPress={() => {}}
            />
            <View style={{ paddingHorizontal: 20, paddingBottom: 15, backgroundColor: '#fff' }}>
              <SegmentedButtons
                value={language}
                onValueChange={handleLanguageChange}
                buttons={[
                  { value: 'fr', label: 'Français' },
                  { value: 'en', label: 'English' },
                ]}
                theme={{ colors: { secondaryContainer: '#E8F5E9' } }}
              />
            </View>
            <Divider />

            {/* Déconnexion */}
            <List.Item
              title={t('profile.disconnect')}
              titleStyle={{ color: theme.colors.error, fontWeight: 'bold' }}
              left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
              onPress={handleLogout}
              style={styles.accordion}
            />
          </List.Section>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerPro: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#2E7D32',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  namePro: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 15,
  },
  emailPro: {
    fontSize: 15,
    color: '#E8F5E9',
    marginTop: 5,
  },
  badge: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsContainer: {
    flex: 1,
    paddingTop: 10,
  },
  subheader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 5,
  },
  accordion: {
    backgroundColor: '#FFF',
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  saveBtn: {
    marginTop: 10,
    paddingVertical: 5,
  }
});
