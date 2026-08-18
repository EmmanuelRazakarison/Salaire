# 🗂️ Arborescence du Projet — Salaire Mada (Karamako)

> Application de calcul de salaire malgache (CNAPS, OSTIE, IRSA) disponible sur **Desktop** (Tauri/Windows) et **Mobile** (Android/iOS).
> Stack : **React 19 + TypeScript** (frontend) · **FastAPI + SQLite** (backend) · **Tauri v2 + Rust** (desktop/mobile shell)

---

## 📁 Structure Générale

```
Salaire Mada/
├── 📄 .gitignore                   # Fichiers ignorés par Git (venv, node_modules, target…)
├── 📄 README.md                    # Documentation principale du projet
├── 📄 Structure.md                 # Ce fichier — arborescence détaillée du projet
├── 📁 backend/                     # API REST Python (FastAPI)
└── 📁 frontend/                    # Application React + Tauri (desktop & mobile)
```

---

## 📁 backend/ — API REST FastAPI

> Serveur Python qui expose les endpoints de calcul de salaire et de persistance des données.
> Base de données SQLite locale. Environnement virtuel Python inclus.

```
backend/
├── 📄 .env                         # Variables d'environnement (DATABASE_URL, etc.)
├── 📄 main.py                      # Point d'entrée FastAPI — création de l'app, inclusion des routes, CORS
├── 📄 requirements.txt             # Dépendances Python (fastapi, uvicorn, sqlalchemy, alembic…)
├── 📄 salaire_mada.db              # Base de données SQLite (générée automatiquement)
│
├── 📁 api/                         # Couche Routes HTTP
│   ├── 📄 __init__.py
│   └── 📄 routes.py                # Endpoints REST : /calculate, /history, /stats…
│
├── 📁 core/                        # Configuration globale de l'application
│   ├── 📄 __init__.py
│   └── 📄 config.py                # Settings (CORS origins, paramètres app via pydantic-settings)
│
├── 📁 database/                    # Gestion de la base de données
│   ├── 📄 __init__.py
│   └── 📄 session.py               # Création du moteur SQLAlchemy et session factory
│
├── 📁 models/                      # Modèles ORM SQLAlchemy
│   ├── 📄 __init__.py
│   └── 📄 calculation.py           # Modèle `Calculation` — historique des calculs en BDD
│
├── 📁 schemas/                     # Schémas Pydantic (validation entrée/sortie)
│   ├── 📄 __init__.py
│   └── 📄 salary.py                # SalaryInput, SalaryResult, HistoryEntry — DTOs de l'API
│
├── 📁 services/                    # Logique métier
│   ├── 📄 __init__.py
│   └── 📄 calculator.py            # Moteur de calcul : CNAPS, OSTIE, IRSA, brut↔net
│
└── 📁 venv/  (.venv/)              # [IGNORÉ] Environnement virtuel Python
```

---

## 📁 frontend/ — Application React + Tauri

> Interface utilisateur React 19 packagée avec Tauri v2 pour les plateformes Desktop (Windows/macOS/Linux) et Mobile (Android/iOS).

```
frontend/
├── 📄 .gitignore                   # Fichiers ignorés (dist, node_modules, target…)
├── 📄 .oxlintrc.json               # Configuration du linter OxLint
├── 📄 index.html                   # Racine HTML (point d'entrée Vite)
├── 📄 package.json                 # Dépendances npm et scripts (dev, build, tauri, lint)
├── 📄 package-lock.json            # Lock file npm
├── 📄 README.md                    # Documentation frontend
├── 📄 tsconfig.json                # Configuration TypeScript racine
├── 📄 tsconfig.app.json            # Config TS pour le code applicatif
├── 📄 tsconfig.node.json           # Config TS pour les outils Node (vite.config…)
├── 📄 vite.config.ts               # Configuration Vite + plugin React + plugin Tauri
│
├── 📁 public/                      # Ressources statiques servies directement
│   ├── 📄 favicon.svg              # Favicon de l'application
│   └── 📄 icons.svg                # Sprite SVG d'icônes
│
├── 📁 src/                         # Code source principal React
│   ├── 📄 main.tsx                 # Point d'entrée React — ReactDOM.createRoot, providers globaux
│   ├── 📄 App.tsx                  # Composant racine — routing (react-router-dom), layout global
│   ├── 📄 App.css                  # Styles globaux de l'application
│   ├── 📄 index.css                # Variables CSS, thème clair/sombre, reset, utilitaires Tailwind
│   │
│   ├── 📁 assets/                  # Ressources statiques importées dans le code
│   │   ├── 📄 hero.png             # Image principale (hero section)
│   │   ├── 📄 react.svg            # Logo React (placeholder)
│   │   └── 📄 vite.svg             # Logo Vite (placeholder)
│   │
│   ├── 📁 components/              # Composants React réutilisables
│   │   ├── 📄 CalculatorForm.tsx   # Formulaire principal de saisie du salaire (react-hook-form + zod)
│   │   ├── 📄 CompareModal.tsx     # Modal de comparaison entre deux calculs de salaire
│   │   ├── 📄 Header.tsx           # En-tête de l'application (logo, navigation, ThemeToggle)
│   │   ├── 📄 HistoryPanel.tsx     # Panneau latéral de l'historique des calculs
│   │   ├── 📄 PayReminderModal.tsx # Modal de rappel de fiche de paie (PDF / partage)
│   │   ├── 📄 ResultsPanel.tsx     # Panneau d'affichage des résultats du calcul
│   │   ├── 📄 ResultsSkeleton.tsx  # Skeleton loader pendant le chargement des résultats
│   │   ├── 📄 SalaryChart.tsx      # Graphique de décomposition du salaire (Recharts)
│   │   ├── 📄 SecurityModal.tsx    # Modal de verrouillage par PIN / sécurité
│   │   ├── 📄 ThemeToggle.tsx      # Bouton bascule thème clair ↔ sombre
│   │   │
│   │   └── 📁 ui/                  # Composants UI primitifs (Design System interne)
│   │       ├── 📄 badge.tsx        # Composant Badge (étiquette colorée)
│   │       ├── 📄 button.tsx       # Composant Button (variants : primary, ghost, outline…)
│   │       ├── 📄 card.tsx         # Composant Card (conteneur avec ombre et radius)
│   │       ├── 📄 input.tsx        # Composant Input (champ de saisie stylisé)
│   │       ├── 📄 label.tsx        # Composant Label (étiquette de formulaire)
│   │       ├── 📄 separator.tsx    # Composant Separator (ligne de séparation)
│   │       └── 📄 skeleton.tsx     # Composant Skeleton (animation de chargement)
│   │
│   ├── 📁 contexts/                # Contextes React globaux
│   │   └── 📄 ThemeContext.tsx     # Contexte du thème (light/dark) — persistance localStorage
│   │
│   ├── 📁 hooks/                   # Hooks React personnalisés
│   │   ├── 📄 useHistory.ts        # Gestion de l'historique des calculs (CRUD via API)
│   │   ├── 📄 useMobileHardwareBack.ts  # Interception du bouton retour Android (Tauri)
│   │   ├── 📄 useSalaryCalculation.ts   # Logique d'appel API calcul salaire + état résultat
│   │   └── 📄 useSecurityLock.ts   # Gestion du verrouillage PIN (activation, vérification)
│   │
│   ├── 📁 pages/                   # Pages de l'application (routes)
│   │   └── 📄 HomePage.tsx         # Page principale — assemblage CalculatorForm + ResultsPanel
│   │
│   ├── 📁 schemas/                 # Schémas de validation formulaires (Zod)
│   │   └── 📄 salaryForm.ts        # Schema Zod du formulaire de calcul (validation champs)
│   │
│   ├── 📁 services/                # Couche d'accès à l'API
│   │   └── 📄 api.ts               # Fonctions fetch vers le backend FastAPI (calculate, history…)
│   │
│   ├── 📁 types/                   # Types TypeScript partagés
│   │   └── 📄 index.ts             # Interfaces : SalaryInput, SalaryResult, HistoryEntry,
│   │                               #              TaxBracketDetail, StatsData, CurrencyMode
│   │
│   └── 📁 utils/                   # Fonctions utilitaires pures
│       ├── 📄 calculations.ts      # Calculs côté client (CNAPS, OSTIE, IRSA, tranches IRSA)
│       ├── 📄 cn.ts                # Utilitaire className (clsx + tailwind-merge)
│       └── 📄 export.ts            # Export PDF (jsPDF) et partage des fiches de paie
│
└── 📁 src-tauri/                   # Shell natif Tauri v2 (Rust)
    ├── 📄 .gitignore               # Fichiers ignorés côté Rust (target/)
    ├── 📄 build.rs                 # Script de build Rust (pré-compilation Tauri)
    ├── 📄 Cargo.toml               # Manifeste Rust — dépendances (tauri, tauri-plugin-log…)
    ├── 📄 Cargo.lock               # Lock file des dépendances Rust
    ├── 📄 tauri.conf.json          # Configuration Tauri (nom app, identifiant, fenêtre,
    │                               #                    permissions, plugins…)
    ├── 📄 README.md                # Documentation Tauri
    │
    ├── 📁 capabilities/            # Permissions et capacités Tauri v2
    │   └── 📄 default.json         # Déclaration des permissions IPC (shell, fs, dialog…)
    │
    ├── 📁 icons/                   # Icônes de l'application (toutes plateformes)
    │   ├── 📄 icon.png             # Icône principale (1024x1024)
    │   ├── 📄 icon.ico             # Icône Windows (.ico multi-taille)
    │   ├── 📄 128x128.png          # Icône Linux 128px
    │   ├── 📄 128x128@2x.png       # Icône Linux 256px (HiDPI)
    │   ├── 📄 32x32.png            # Icône Linux 32px
    │   ├── 📄 64x64.png            # Icône Linux 64px
    │   ├── 📄 Karamako.png         # Logo Karamako (splash / about)
    │   └── 📁 ios/                 # Icônes iOS (AppIcon — toutes résolutions requises)
    │       ├── 📄 AppIcon-20x20@1x.png
    │       ├── 📄 AppIcon-20x20@2x.png
    │       ├── 📄 AppIcon-20x20@3x.png
    │       ├── 📄 AppIcon-29x29@1x.png
    │       ├── 📄 AppIcon-29x29@2x.png
    │       ├── 📄 AppIcon-29x29@3x.png
    │       ├── 📄 AppIcon-40x40@1x.png
    │       ├── 📄 AppIcon-40x40@2x.png
    │       ├── 📄 AppIcon-40x40@3x.png
    │       ├── 📄 AppIcon-60x60@2x.png
    │       ├── 📄 AppIcon-60x60@3x.png
    │       ├── 📄 AppIcon-76x76@1x.png
    │       ├── 📄 AppIcon-76x76@2x.png
    │       ├── 📄 AppIcon-83.5x83.5@2x.png
    │       └── 📄 AppIcon-512@2x.png
    │
    └── 📁 src/                     # Code source Rust (backend natif Tauri)
        ├── 📄 lib.rs               # Bibliothèque Rust — déclaration des commandes Tauri (IPC)
        └── 📄 main.rs              # Point d'entrée Rust — initialisation de l'app Tauri
```

---

## 🔗 Relations entre les modules

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │  src-tauri/     │  ← Shell natif Rust (Tauri v2)
              │  (Desktop / App)│     Android APK / iOS IPA / .exe
              └────────┬────────┘
                       │ WebView
              ┌────────▼────────┐
              │   frontend/src/ │  ← React 19 + TypeScript
              │                 │
              │  pages/         │  ← Routes de l'app
              │  components/    │  ← UI (CalculatorForm, ResultsPanel…)
              │  hooks/         │  ← Logique réactive
              │  utils/         │  ← Calculs et export PDF
              │  services/api   │  ← Appels HTTP
              └────────┬────────┘
                       │ HTTP REST (fetch)
              ┌────────▼────────┐
              │   backend/      │  ← FastAPI + Python
              │                 │
              │  api/routes     │  ← Endpoints REST
              │  services/      │  ← Logique calcul salaire
              │  models/        │  ← ORM SQLAlchemy
              │  schemas/       │  ← Validation Pydantic
              └────────┬────────┘
                       │ SQLAlchemy ORM
              ┌────────▼────────┐
              │ salaire_mada.db │  ← Base SQLite locale
              └─────────────────┘
```

---

## 📦 Technologies utilisées

| Couche         | Technologie                 | Version     | Rôle                              |
|----------------|-----------------------------|-------------|-----------------------------------|
| UI Framework   | React                       | ^19.2       | Interface utilisateur             |
| Language       | TypeScript                  | ~6.0        | Typage statique frontend          |
| Build Tool     | Vite                        | ^8.1        | Bundler + serveur dev             |
| Styling        | TailwindCSS                 | ^4.3        | Utilitaires CSS                   |
| Forms          | React Hook Form + Zod       | ^7.8 / ^4.4 | Formulaires + validation          |
| HTTP Client    | TanStack Query + fetch      | ^5.10       | Cache requêtes API                |
| Charts         | Recharts                    | ^3.9        | Graphiques de décomposition       |
| Animations     | Framer Motion               | ^12.4       | Animations UI                     |
| PDF Export     | jsPDF                       | ^4.2        | Export fiche de paie              |
| Icons          | Lucide React                | ^1.24       | Bibliothèque d'icônes             |
| Desktop/Mobile | Tauri                       | v2 (^2.11)  | Shell natif cross-platform        |
| Rust           | Rust (stable)               | —           | Backend natif Tauri               |
| API Backend    | FastAPI                     | —           | API REST Python                   |
| ORM            | SQLAlchemy                  | —           | Accès base de données             |
| DB             | SQLite                      | —           | Stockage local historique         |
| Linter         | OxLint                      | ^1.71       | Linting TypeScript ultra-rapide   |

---

## 🚀 Scripts disponibles

### Frontend (dans `frontend/`)
```bash
npm run dev       # Démarrage serveur dev Vite (localhost:1420)
npm run build     # Build production (tsc + vite build)
npm run lint      # Linting avec OxLint
npm run preview   # Prévisualisation du build
npm run tauri     # Commandes Tauri CLI (dev, build, android, ios…)
```

### Backend (dans `backend/`)
```bash
uvicorn main:app --reload   # Démarrage serveur FastAPI (localhost:8000)
```

---

*Dernière mise à jour : 18 août 2026*
