# 🌱 Smart Scan AI - Assistant Intelligent pour la Culture du Cacao

Bienvenue dans le dépôt du projet **Smart Scan AI**, une application mobile développée en React Native (Expo) visant à révolutionner l'assistance agricole pour les producteurs de cacao en Afrique.

## 📱 Aperçu du Projet

Smart Scan AI est une solution numérique qui allie technologie de pointe et accessibilité terrain pour réduire les pertes agricoles dues aux maladies (comme la pourriture brune). Elle offre un diagnostic visuel, des recommandations adaptées et un suivi météo intelligent.

## 🚀 Fonctionnalités Principales

- **Authentification Sécurisée** : Inscription, connexion et gestion du profil utilisateur propulsées par Firebase Auth.
- **Diagnostic IA (Simulation experte)** : Utilisation de la caméra de l'appareil (`expo-camera`) pour analyser les plants, couplée à un arbre de décision dynamique simulant un diagnostic IA complet.
- **Météo Agricole Intelligente** : Prévisions météorologiques sur 7 jours via l'API gratuite Open-Meteo, localisées par GPS.
- **Bonnes Pratiques (Mode Hors Ligne)** : Catalogue intégré de conseils agricoles pour garantir un fonctionnement même sans internet.
- **Navigation Moderne** : Interface fluide avec une barre de navigation inférieure (Bottom Tabs).

---

# 🎓 Dossier d'Analyse et de Conception (Aide pour le rapport de stage/projet)

*Cette section est rédigée spécifiquement pour aider l'étudiant à remplir son cahier des charges et ses dossiers d'analyse, de conception (UML) et de réalisation.*

## 1. Type d'Architecture Utilisée

L'application utilise une architecture moderne adaptée aux environnements contraints :
- **Architecture Hybride / Offline-First** : L'application est conçue pour fonctionner de manière autonome sans internet (les données de diagnostic et les bonnes pratiques sont embarquées "en dur" dans le code). Seule l'authentification et la météo nécessitent une connexion.
- **Architecture de type MVC (Modèle-Vue-Contrôleur) côté client** :
  - **Modèle (Data)** : Firebase Authentication (pour les comptes) et les données locales (tableaux JSON pour les maladies et conseils).
  - **Vue (UI)** : Les écrans (Screens) codés en React Native (`react-native-paper`).
  - **Contrôleur (Logique)** : Les Hooks React (`useEffect`, `useState`) et les Services (`weatherService.js`) qui gèrent la logique métier.

## 2. Diagramme des Cas d'Utilisation (Use Case Diagram)

**Acteur principal :** L'Agriculteur / Producteur de cacao.
**Cas d'utilisation :**
1. **S'authentifier** (Connexion / Déconnexion) : Géré via Firebase.
2. **Consulter la météo locale** : Utilise le GPS du téléphone pour obtenir les prévisions.
3. **Scanner un plant (Diagnostic)** : Ouvre la caméra, puis lance le questionnaire du système expert.
4. **Consulter les bonnes pratiques** : Accéder au catalogue de conseils agricoles (Taille, ombrage, etc.).
5. **Gérer son profil** : Modifier son mot de passe ou son email (nécessite une ré-authentification de sécurité).

## 3. Diagramme de Classes (Class Diagram - Structure des Données)

Même si les données sont stockées en local pour le "Hors-ligne", l'application a été modélisée selon ces classes (Tables) :

- **Classe `Utilisateur`** (Gérée par Firebase Auth & AsyncStorage)
  - `id_user` : String (Clé primaire Firebase UID)
  - `email` : String
  - `nom_complet` : String
  - `nom_exploitation` : String
  - `mot_de_passe` : String (Crypté par Firebase)

- **Classe `Maladie`** (Gérée en base de connaissances locale)
  - `id_maladie` : Entier (Clé primaire)
  - `nom` : String (ex: Pourriture Brune)
  - `causes` : String
  - `symptomes` : String
  - `consequences` : String
  - `solutions` : Tableau de Strings (Array)

- **Classe `BonnePratique`** (Gérée en base de connaissances locale)
  - `id_pratique` : Entier (Clé primaire)
  - `titre` : String
  - `description` : String

- **Classe `Diagnostic`** *(Virtuelle, instanciée lors de l'utilisation)*
  - `id_diagnostic` : Entier
  - `date_scan` : Date
  - `reponses_utilisateur` : Tableau
  - `resultat_id_maladie` : Entier (Clé étrangère vers Maladie)

**Relations :**
- Un `Utilisateur` peut réaliser plusieurs (0..*) `Diagnostics`.
- Un `Diagnostic` identifie une (1..1) `Maladie`.

## 4. Diagramme de Séquence : Cas "Faire un Diagnostic"

Voici les étapes (la séquence) pour le rapport :
1. **L'Agriculteur** clique sur le bouton "Scan IA" sur l'**Interface Utilisateur (Vue)**.
2. La Vue demande la permission d'accès à la **Caméra**.
3. **L'Agriculteur** prend une photo de la cabosse malade.
4. La Vue appelle le **Système Expert (Contrôleur local)**.
5. Le Système Expert pose 4 questions à l'Agriculteur via l'Interface.
6. L'Agriculteur valide ses réponses.
7. Le Système Expert croise les réponses avec la **Base de connaissances (Modèle `Maladie`)**.
8. La Base retourne le résultat (Ex: Pourriture Brune).
9. L'Interface affiche le rapport complet à l'Agriculteur.

---

## 🛠️ Comment lancer le projet en local ?

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
