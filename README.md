# 🌱 Smart Scan AI - Assistant Intelligent pour la Culture du Cacao

Bienvenue dans le dépôt du projet **Smart Scan AI**, une application mobile développée en React Native (Expo) visant à révolutionner l'assistance agricole pour les producteurs de cacao en Afrique.

## 📱 Aperçu du Projet

Smart Scan AI est une solution numérique qui allie technologie de pointe et accessibilité terrain pour réduire les pertes agricoles dues aux maladies (comme la pourriture brune). Elle offre un diagnostic visuel, des recommandations adaptées et un suivi météo intelligent.

## 🚀 Fonctionnalités Principales

- **Authentification Sécurisée** : Inscription, connexion et gestion du profil utilisateur propulsées par Firebase Auth.
- **Diagnostic IA (Simulation experte)** : Utilisation de la caméra de l'appareil (`expo-camera`) pour analyser les plants, couplée à un arbre de décision dynamique simulant un diagnostic IA complet (maladie, causes, conséquences, solutions).
- **Météo Agricole Intelligente** : Prévisions météorologiques sur 7 jours (température, probabilité de pluie) via l'API gratuite Open-Meteo, avec des recommandations agricoles adaptées (ex: alerte forte chaleur).
- **Bonnes Pratiques (Mode Hors Ligne)** : Catalogue intégré de conseils agricoles pour garantir un fonctionnement même dans les zones rurales sans connexion internet.
- **Navigation Moderne** : Interface fluide avec une barre de navigation inférieure (Bottom Tabs) et un design premium (`react-native-paper`).

## 🛠️ Technologies Utilisées

- **Frontend** : React Native / Expo
- **UI/UX** : React Native Paper & React Navigation (Stack & Bottom Tabs)
- **Backend / Auth** : Firebase Authentication & Firestore
- **Localisation & API** : `expo-location`, Open-Meteo API
- **Stockage Local** : AsyncStorage (persistance de session)

## 🏗️ Architecture et Choix Techniques (Soutenance)

Pour répondre aux contraintes du monde agricole (zones isolées, connexion instable), l'application adopte une **architecture hybride (Offline-First)** :
1. **En Ligne (Firebase)** : Utilisé exclusivement pour l'authentification et la gestion sécurisée du profil.
2. **Hors Ligne (Local)** : Les données de diagnostic expert et les bonnes pratiques sont stockées dans le code de l'application. Cela permet d'offrir le **"Mode hors ligne complet"** exigé par le cahier des charges, garantissant que l'agriculteur a toujours accès aux solutions même sans réseau.

## 📂 Structure du Projet

```text
SmartScanAI/
├── src/
│   ├── components/     # Composants réutilisables de l'interface
│   ├── config/         # Fichiers de configuration (ex: firebase.js)
│   ├── navigation/     # Configuration de la barre d'onglets (MainTabNavigator.js)
│   ├── screens/        # Vues de l'application (Login, Home, Scan, Weather, etc.)
│   ├── services/       # Appels aux API (Météo, Firebase)
│   └── theme/          # Couleurs et styles globaux (theme.js)
├── App.js            # Point d'entrée et routeur principal
└── package.json      # Dépendances du projet
```

## ⚙️ Comment lancer le projet en local ?

### Prérequis
- [Node.js](https://nodejs.org/) installé sur votre machine.
- L'application **Expo Go** installée sur votre smartphone (iOS ou Android).
- Un compte Firebase avec un projet configuré (Authentification Email/Mot de passe activée).

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-nom/SmartScanAI.git
   cd SmartScanAI
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Firebase**
   Allez dans le fichier `src/config/firebase.js` et remplacez les valeurs de `firebaseConfig` par les clés de votre propre projet Firebase.

4. **Lancer l'application**
   ```bash
   npx expo start --clear
   ```

5. **Tester sur votre téléphone**
   Scannez le QR Code qui s'affiche dans votre terminal avec l'application Expo Go.

> **Comptes de test (Démonstration) :**
> Pour tester l'interface de connexion, vous pouvez utiliser l'utilisateur configuré dans Firebase :
> - **Email** : `test@cacao.cm`
> - **Mot de passe** : `123456`

---
*Projet réalisé dans le cadre de la soutenance en développement mobile et assistance agricole.*
