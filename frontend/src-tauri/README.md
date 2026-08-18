# 🇲🇬 Salaire Mada (Karamako) - Calculateur Salarial & Charges Patronales

[![Version](https://img.shields.io/badge/version-1.1.0-emerald.svg)](https://github.com/EmmanuelRazakarison/Salaire)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android-blue.svg)](https://tauri.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Madagascar 2026](https://img.shields.io/badge/R%C3%A9glementation-Madagascar%202026-red.svg)](https://www.cnaps.mg)
[![Tauri v2](https://img.shields.io/badge/Tauri-v2.11-orange.svg)](https://tauri.app/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)

**Salaire Mada** (nom de package application : **Karamako**) est une solution applicative moderne, complète et multiplateforme (Desktop, Mobile Android et Web) dédiée à la **simulation salariale**, au **calcul des charges patronales** et à l'**édition de fiches de paie prévisionnelles** conformément à la législation du travail et au **barème fiscal IRSA 2026 en vigueur à Madagascar**.

---

## 📌 Sommaire

1. [Présentation de l'Application](#-présentation-de-lapplication)
2. [Propos et Vision du Projet](#-propos-et-vision-du-projet)
3. [Fonctionnalités Principales](#-fonctionnalités-principales)
4. [Réglementation Sociale & Fiscale Appliquée (2026)](#-réglementation-sociale--fiscale-appliquée-2026)
5. [Utilisateurs et Cas d'Usage](#-utilisateurs-et-cas-dusage)
6. [Pages et Modules de l'Application](#-pages-et-modules-de-lapplication)
7. [Parcours Utilisateur Types](#-parcours-utilisateur-types)
8. [Technologies Utilisées](#-technologies-utilisées)
9. [Installation et Lancement](#-installation-et-lancement)
10. [Configuration & Fonctionnement Hybride](#-configuration--fonctionnement-hybride)
11. [État du Projet](#-état-du-projet)
12. [Perspectives & Évolutions](#-perspectives--évolutions)

---

## 📖 Présentation de l'Application

### Qu'est-ce que Salaire Mada ?
**Salaire Mada** est un outil d'aide à la décision et de calcul de paie destiné aux entreprises, responsables des ressources humaines, comptables et travailleurs à Madagascar.

Il permet d'obtenir instantanément :
- Le **salaire net à payer** perçu par le collaborateur après retenues sociales et fiscales.
- Le **coût global employeur** (masse salariale réelle incluant les cotisations patronales).
- Le **décompte précis de l'IRSA** (Impôt sur les Revenus Salariaux et Assimilés) selon le barème progressif par tranches.
- La **recherche inverse exacte** du salaire brut nécessaire pour garantir un salaire net souhaité.

### Problème résolu
À Madagascar, le calcul de la paie implique des plafonnements spécifiques (plafond CNAPS et OSTIE fixé à 2 400 000 MGA), un barème d'IRSA progressif à 6 tranches (0%, 5%, 10%, 15%, 20%, 25%), des abattements pour charges familiales (2 000 MGA / personne) et un impôt minimum légal (3 000 MGA). 

Réaliser ces calculs à la main ou sur des tableurs non vérifiés engendre des erreurs récurrentes. **Salaire Mada** automatise ces règles avec une précision au centime d'Ariary tout en proposant une conversion instantanée en Francs Malgaches (FMG).

---

## 🎯 Propos et Vision du Projet

### La vision
Apporter une **transparence totale et une accessibilité universelle** sur les calculs de rémunération à Madagascar. L'application a été conçue pour fonctionner aussi bien sur un poste de travail d'entreprise (Windows / macOS / Linux), sur smartphone (Android) que dans un navigateur web standard.

### Les piliers de valeur
- ⚖️ **Conformité juridique et fiscale** : Respect strict du Code du Travail malgache et de la Loi de Finances 2026.
- ⚡ **Instantanéité & Ergonomie** : Calcul réactif à chaque frappe, sans latence ni rechargement.
- 📶 **Fonctionnement Hybride & Résilience Hors-Ligne** : L'application fonctionne à 100% de manière autonome en local sans nécessiter de connexion internet constante, tout en se synchronisant avec un serveur API centralisé lorsqu'il est disponible.
- 📄 **Prêt pour la gestion RH** : Exportation de bulletins de paie clairs en PDF et comparateur de scénarios salariaux en temps réel.

---

## ✨ Fonctionnalités Principales

### 1. 🧮 Calcul Bi-directionnel Haute Précision
- **Mode Brut → Net** : Saisie du salaire de base brut, calcul immédiat des retenues salariales (CNAPS, OSTIE), de l'IRSA progressif et du net en poche.
- **Mode Net → Brut** : Recherche inversée automatisée (algorithme de dichotomie de précision) permettant de déterminer le brut contractuel correspondant exactement au net souhaité.

### 2. 💼 Prise en Compte Complète des Éléments de Rémunération
- **Primes et gratifications** : Ajout de primes de rendement ou de fin d'année.
- **Indemnités et avantages** : Indemnités de fonction, de déplacement, etc.
- **Autres gains imposables** : Heures supplémentaires ou majorations.
- **Charges familiales** : Prise en compte du nombre d'enfants/personnes à charge avec réduction d'IRSA de 2 000 MGA par personne.
- **Boutons Préréglages Rapides** : Accès direct en 1 clic aux montants usuels :
  - **SMIG Malagasy** : 262 680 MGA
  - **500 000 MGA**
  - **1 200 000 MGA**
  - **2 500 000 MGA**
  - **4 000 000 MGA**

### 3. 👥 Double Vue Salarié & Employeur
- **Vue Salarié** : Détail du net perçu, des cotisations salariales (2%) et de l'impôt IRSA prélevé à la source.
- **Vue Coût Employeur** : Vision complète du coût entreprise (Brut + Cotisations Patronales CNAPS 13% + OSTIE 5%).

### 4. 🪙 Convertisseur Instantané MGA / FMG
- Bascule dynamique d'affichage entre **Ariary (MGA)** et **Francs Malgaches (FMG)** au ratio officiel :
  $$\text{1 MGA} = \text{5 FMG}$$

### 5. ⚖️ Comparateur de Scénarios Salariaux
- Fenêtre interactive permettant de comparer deux propositions (Scénario A actuel vs Scénario B proposé).
- Calcul automatique des écarts :
  - Delta du net salarié ($\Delta\text{ Net}$)
  - Delta du coût entreprise ($\Delta\text{ Coût Patronal}$)

### 6. 📊 Visualisation Graphique Interactive
- Diagramme circulaire dynamique (**Recharts**) affichant la répartition du salaire (Net vs Charges sociales vs Impôt ou Brut vs Cotisations patronales).

### 7. 📄 Exportation & Partage Professionnel
- **Génération de Fiche de Paie PDF** : Export propre et structuré au format PDF d'un bulletin de simulation officiel via `jsPDF`.
- **Copie Presse-Papier Formatée** : Résumé textuel prêt à être partagé par e-mail, messagerie ou note de synthèse.

### 8. 💾 Historique & Persistance
- Enregistrement automatique des simulations effectuées.
- Rechargement instantané d'un calcul antérieur dans le formulaire.
- Suppression ciblée ou vidage complet de l'historique.
- Double persistance : locale (`localStorage`) et serveur centralisé (`SQLite / FastAPI`).

### 9. 🌓 Interface Utilisateur Moderne & Responsive
- Thème sombre (**Dark Mode**) et thème clair (**Light Mode**) automatiques et persistants.
- Animations fluides via **Framer Motion**.
- Interface adaptée à tous les formats d'écrans (Desktop, Tablettes, Mobiles).

---

## ⚖️ Réglementation Sociale & Fiscale Appliquée (2026)

### Synthèse des Cotisations Sociales

| Organisme | Rôle / Couverture | Part Salarié | Part Patronale | Plafond Mensuel de Calcul |
| :--- | :--- | :---: | :---: | :---: |
| **CNAPS** | Caisse Nationale de Prévoyance Sociale | **1%** | **13%** | 2 400 000 MGA |
| **OSTIE / Médical** | Service Médical Inter-Entreprises | **1%** | **5%** | 2 400 000 MGA |
| **Total Cotisations** | Protection sociale complète | **2%** | **18%** | *Plafonné à 24 000 MGA (salarié) & 432 000 MGA (employeur)* |

### Barème Progressif IRSA (Impôt sur le Revenu des Salariés)

| Tranche de Revenu Net Imposable (MGA) | Taux Applicable |
| :--- | :---: |
| De 0 à 350 000 MGA | **0%** (Exonéré) |
| De 350 001 à 400 000 MGA | **5%** |
| De 400 001 à 500 000 MGA | **10%** |
| De 500 001 à 600 000 MGA | **15%** |
| De 600 001 à 4 000 000 MGA | **20%** |
| Au-delà de 4 000 000 MGA | **25%** |

- **Abattement pour charge familiale** : Réduction d'impôt de **2 000 MGA par personne à charge** par mois.
- **Minimum de perception IRSA** : **3 000 MGA** obligatoires pour tout revenu imposable.

---

## 👥 Utilisateurs et Cas d'Usage

| Profil Utilisateur | Objectifs & Bénéfices |
| :--- | :--- |
| **Dirigeant & Chef d'Entreprise** | Budgétiser précisément les recrutements, anticiper la masse salariale réelle et maîtriser les charges patronales. |
| **Responsable RH & Gestionnaire de Paie** | Vérifier la conformité des bulletins, préparer les négociations d'embauche et éditer des simulations claires. |
| **Salarié & Candidat à l'Embauche** | Comprendre les déductions sur fiche de paie, négocier un salaire brut à partir d'un salaire net désiré. |
| **Expert-Comptable & Consultant** | Fournir un conseil fiscal et social rapide, précis et documenté avec export PDF à leurs clients. |

---

## 📱 Pages et Modules de l'Application

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              HEADER                                    │
│  Logo Salaire Mada · Statut API (🟢 Connecté / 🟡 Local) · Thème 🌓    │
├───────────────────────────────────┬────────────────────────────────────┤
│         COLONNE GAUCHE            │          COLONNE DROITE            │
│                                   │                                    │
│  📝 Formulaire de Calcul          │  💳 Résumé Salarié / Coût Employeur│
│   • Saisie Brut ou Net            │   • Net en poche / Coût Total      │
│   • Préréglages Rapides (SMIG...) │   • Ratios de cotisations & IRSA   │
│   • Primes, Indemnités, Gains     │                                    │
│   • Personnes à charge            │  📊 Graphique de Répartition       │
│   • Bascule Brut ↔ Net            │   • Anneau interactif (Recharts)   │
│                                   │                                    │
│  🕒 Historique des Simulations    │  📋 Décompte Détaillé              │
│   • Liste des derniers calculs    │   • Gains · Retenues · IRSA        │
│   • Rechargement en 1 clic        │   • Charges patronales détaillées  │
│   • Suppression sélective/totale  │                                    │
│                                   │  ⚡ Actions Rapides                │
│                                   │   • 📄 Bulletin PDF · ⚖️ Comparer  │
│                                   │   • 📋 Copier · 💾 Sauvegarder     │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 🚶‍♂️ Parcours Utilisateur Types

### Scénario 1 : Calcul direct d'un salaire (Brut → Net)
1. **Saisie** : L'utilisateur saisit le salaire brut (ex: `1 800 000 MGA`) ou clique sur un préréglage rapide.
2. **Ajustement** : Ajout éventuel de primes et du nombre d'enfants à charge.
3. **Résultat immédiat** : L'application affiche le salaire net en poche, les retenues et le coût employeur.
4. **Action** : Téléchargement du bulletin de paie au format PDF ou copie du résumé.

### Scénario 2 : Négociation salariale (Net → Brut)
1. **Bascule** : L'utilisateur clique sur **"Passer en mode Net → Brut"**.
2. **Objectif** : Saisie du montant net désiré (ex: `1 500 000 MGA`).
3. **Calcul** : L'algorithme résout l'équation fiscale et indique le brut exact à faire figurer sur le contrat d'embauche.

### Scénario 3 : Comparaison d'une proposition d'augmentation
1. **Calcul initial** : Simulation du salaire actuel (Scénario A).
2. **Ouverture** : Clic sur le bouton **"Comparateur"**.
3. **Scénario B** : Saisie du nouveau salaire brut proposé.
4. **Analyse** : Visualisation instantanée du gain net réel pour le salarié vs le surcoût pour l'entreprise.

---

## 💻 Technologies Utilisées

### Application Client (Desktop / Mobile / Web)
- **Tauri v2** (`src-tauri`) : Moteur de bureau et mobile ultra-léger, sécurisé et performant écrit en Rust.
- **React 19** & **TypeScript** : Architecture front-end réactive, modulaire et typée.
- **Vite 8** : Environnement de développement et bundler ultra-rapide.
- **TailwindCSS v4** : Système de design moderne, thémable et hautement optimisé.
- **Framer Motion** : Animations et transitions fluides de l'interface.
- **TanStack React Query v5** : Gestion de l'état asynchrone et synchronisation réseau.
- **Recharts** : Visualisation graphique des données de paie.
- **jsPDF** : Moteur de génération vectorielle de documents PDF côté client.
- **Lucide React** : Iconographie moderne et cohérente.

### Backend API (Optionnel / Centralisé)
- **FastAPI** (Python 3.10+) : API REST haute performance pour le calcul et la persistance.
- **SQLAlchemy 2.0 & SQLite** : Modélisation et persistance relationnelle de l'historique et des statistiques.
- **Pydantic v2** : Validation des schémas de données et sérialisation bilingue (`camelCase` / `snake_case`).

---

## 🚀 Installation et Lancement

### Prérequis Généraux
- [Node.js](https://nodejs.org/) (version 18.0 ou supérieure)
- [Rust & Cargo](https://www.rust-lang.org/) (nécessaire pour exécuter ou compiler l'application native Tauri)
- [Python](https://www.python.org/) 3.10+ (uniquement si vous souhaitez exécuter le backend FastAPI)

---

### 1. Mode Desktop (Tauri)

Depuis la racine du projet ou depuis le dossier `frontend` :

```bash
# Se placer dans le dossier frontend
cd frontend

# Installer les dépendances JavaScript
npm install

# Lancer l'application en mode bureau (Tauri Dev)
npm run tauri dev
```

Pour compiler l'exécutable autonome de production (Windows `.exe`/`.msi`, macOS `.dmg` ou Linux `.deb`/`.AppImage`) :

```bash
npm run tauri build
```

Les exécutables générés se trouvent dans `frontend/src-tauri/target/release/bundle/`.

---

### 2. Mode Mobile Android (APK)

Pour compiler l'application au format APK Android via Tauri v2 :

```bash
cd frontend

# Compiler l'APK Android (Debug ou Release)
npx @tauri-apps/cli android build -- --apk
```

---

### 3. Mode Web Classique (Navigateur)

Pour tester l'application directement dans un navigateur web sans couche native :

```bash
cd frontend
npm install
npm run dev
```
L'application est disponible sur `http://localhost:5173`.

---

### 4. Démarrage de l'API Backend (Optionnel)

Si vous souhaitez activer la persistance centrale SQLite et le suivi des statistiques globales :

```bash
# Dans un terminal séparé
cd backend

# Créer et activer l'environnement virtuel
python -m venv .venv

# Sur Windows :
.venv\Scripts\activate
# Sur Linux/macOS :
# source .venv/bin/activate

# Installer les dépendances Python
pip install -r requirements.txt

# Lancer le serveur API FastAPI
uvicorn main:app --reload --port 8000
```
- Swagger UI : `http://localhost:8000/docs`
- Statut de santé : `http://localhost:8000/api/v1/health`

---

## ⚙️ Configuration & Fonctionnement Hybride

L'application intègre une détection automatique de l'environnement :

```text
[Interface Client React / Tauri]
       │
       ├──► 🟢 Backend FastAPI détecté (http://localhost:8000)
       │       └─► Les calculs et l'historique sont persistés dans la base SQLite backend.
       │
       └──► 🟡 Mode Autonome / Hors-Ligne (Backend absent)
               └─► L'application utilise son moteur JavaScript local ultra-rapide
                   et sauvegarde l'historique dans le stockage local (localStorage).
```

Aucune configuration complexe n'est requise. L'utilisateur bénéficie d'une continuité de service totale, même sans réseau internet.

---

## 📊 État du Projet

| Critère | Statut | Commentaire |
| :--- | :---: | :--- |
| **État global** | 🟢 **Fonctionnel & Finalisé** | L'application est complètement opérationnelle et validée sur le barème fiscal 2026. |
| **Calculs & Fiscalité** | ✅ **Complet** | CNAPS, OSTIE, Barème IRSA 6 tranches, abattements et charges patronales 100% conformes. |
| **Cibles de déploiement** | ✅ **Multiplateforme** | Web (Vite), Desktop (Windows/macOS/Linux via Tauri), Mobile (Android APK). |
| **Export & Reporting** | ✅ **Complet** | Export PDF et partage presse-papier opérationnels. |

---

## 🔮 Perspectives & Évolutions

Bien que l'application soit aujourd'hui complète et prête à l'emploi, les évolutions suivantes sont envisageables dans des versions ultérieures :
- 🏥 **Prise en charge d'autres mutuelles privées** : Ajout de paramètres pour les organismes spécifiques (ex: FUNRECO, assurances santé privées d'entreprise).
- 💱 **Mode Multi-Devises Internationales** : Affichage comparatif automatique des équivalents en Euros (EUR) et Dollars (USD) pour les prestataires et entreprises off-shore.
- 📊 **Export de l'Historique en CSV / Excel** : Exportation groupée de l'ensemble des simulations pour intégration comptable.

---

## 📄 Licence

Ce projet est distribué sous la licence **MIT**. Vous êtes libre de l'utiliser, de le modifier et de l'intégrer dans vos processus d'entreprise.
