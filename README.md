# 🇲🇬 Salaire Mada - Calculateur Salarial & Charges Patronales (Madagascar 2026)

**Salaire Mada** est une application web moderne, réactive et complète dédiée au calcul du salaire brut, du salaire net et du coût total employeur conformément au **Code du Travail** et au **Barème Fiscal IRSA 2026** à Madagascar.

L'application intègre une **architecture hybride résiliente** : elle fonctionne en direct avec une API backend **FastAPI & SQLite**, tout en basculant de manière fluide et transparente en mode calcul local hors-ligne si l'API n'est pas démarrée.

---

## 🚀 Fonctionnalités Principales

- **Calcul Bi-directionnel Haute Précision** :
  - **Brut → Net** : Calcul immédiat du salaire net à payer après déduction des cotisations et de l'IRSA.
  - **Net → Brut** : Estimation automatique du salaire brut de base à partir du salaire net souhaité par algorithme de dichotomie au centime d'Ariary.
- **Gestion Complète des Cotisations Sociales** :
  - **Cotisations Salariales (2%)** : CNAPS Salarié (1%) et OSTIE/Santé (1%) plafonnés à 2 400 000 MGA (soit 24 000 MGA max chacune).
  - **Cotisations Patronales (18%)** : CNAPS Employeur (13%) et OSTIE/Santé Employeur (5%) plafonnés à 2 400 000 MGA (soit 312 000 MGA et 120 000 MGA max).
- **Calculateur d'IRSA (Impôt sur le Revenu Synthétique / Salarial)** :
  - Application du barème progressif par tranches (0%, 5%, 10%, 15%, 20%, 25%).
  - Déduction pour charges familiales (2 000 MGA par personne à charge).
  - Prise en compte de l'impôt IRSA minimum légal (3 000 MGA).
- **Double Vue Analytique** :
  - **Vue Salarié** : Détail du net en poche, cotisations sociales et impôts retenus à la source.
  - **Vue Coût Employeur** : Vision complète de la masse salariale entreprise (Brut + Cotisations Patronales).
- **Fonctionnalités & Ergonomie Avancées** :
  - ⚡ **Préréglages Rapides** : Boutons SMIG (262 680 MGA), 500k, 1.2M, 2.5M, 4M MGA.
  - 🪙 **Convertisseur MGA / FMG** : Conversion instantanée entre Ariary (MGA) et Francs Malgaches (1 MGA = 5 FMG).
  - 📊 **Graphiques Interactifs** : Diagramme circulaire Recharts de la répartition du salaire.
  - 📄 **Exportation Fiche de Paie PDF** : Génération d'une simulation officielle de bulletin de paie au format PDF via `jsPDF`.
  - 📋 **Copie Presse-Papier** : Résumé textuel formaté pour envoi rapide par message ou email.
  - 💾 **Historique Synchronisé** : Sauvegarde en base de données SQLite et persistance locale (`localStorage`).
  - 🌓 **Mode Sombre / Clair** : Interface utilisateur moderne avec TailwindCSS v4 et animations Framer Motion.

---

## 🛠️ Stack Technique

### Backend
- **Framework** : [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **ORM & Base de données** : [SQLAlchemy 2.0](https://www.sqlalchemy.org/) avec SQLite
- **Validation & Schémas** : [Pydantic V2](https://docs.pydantic.dev/) avec aliasing bidirectionnel `camelCase` / `snake_case`
- **Serveur ASGI** : [Uvicorn](https://www.uvicorn.org/)

### Frontend
- **Framework** : [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool** : [Vite 8](https://vitejs.dev/)
- **Gestion de l'État & API** : [TanStack React Query v5](https://tanstack.com/query/latest)
- **Formulaires & Validation** : React Hook Form + Zod
- **Design & UI** : TailwindCSS v4, Lucide React, Framer Motion
- **Visualisation & Export** : Recharts, jsPDF

---

## 📋 Prérequis

Assurez-vous d'avoir installé les outils suivants sur votre système :
- **Python** 3.10 ou supérieur
- **Node.js** 18.0 ou supérieur (avec `npm`)

---

## 🚀 Démarrage Rapide (Installation & Lancement)

### 1. Cloner le Projet

```bash
git clone https://github.com/EmmanuelRazakarison/Salaire.git
cd "Salaire Mada"
```

---

### 2. Démarrer le Backend (FastAPI)

Dans un terminal dédié :

```bash
# Accéder au dossier backend
cd backend

# Créer un environnement virtuel Python
python -m venv .venv

# Activer l'environnement virtuel
# Sur Windows (PowerShell) :
.venv\Scripts\Activate.ps1
# Sur Linux/macOS :
# source .venv/bin/activate

# Installer les dépendances Python
pip install -r requirements.txt

# Démarrer le serveur API Uvicorn
uvicorn main:app --reload --port 8000
```

L'API Backend est désormais opérationnelle sur `http://localhost:8000`.
- **Documentation interactive Swagger UI** : `http://localhost:8000/docs`
- **Documentation ReDoc** : `http://localhost:8000/redoc`

---

### 3. Démarrer le Frontend (React / Vite)

Dans un autre terminal :

```bash
# Accéder au dossier frontend
cd frontend

# Installer les dépendances Node.js
npm install

# Démarrer le serveur de développement Vite
npm run dev
```

L'application Web est désormais accessible sur `http://localhost:5173`.

> 💡 **Remarque sur la Synchronisation** :
> Le Frontend détecte automatiquement si le serveur FastAPI est actif (`http://localhost:8000`). Un badge lumineux dans l'en-tête indique le statut en temps réel :
> - 🟢 **Serveur API** : Les calculs et l'historique sont synchronisés avec la base de données SQLite backend.
> - 🟡 **Mode Local** : Si le backend est éteint, l'application continue de fonctionner à 100% en local grâce à son moteur de calcul JavaScript autonome.

---

## 📁 Structure du Projet

```text
Salaire Mada/
├── .gitignore              # Exclusion des fichiers temporaires, venv, node_modules, DB
├── README.md               # Documentation générale du projet
├── backend/                # API REST Python FastAPI
│   ├── main.py             # Point d'entrée FastAPI & Middleware CORS
│   ├── requirements.txt    # Dépendances Python
│   ├── salaire_mada.db     # Base de données SQLite (générée automatiquement)
│   ├── api/
│   │   └── routes.py       # Endpoints REST (/calculate, /history, /stats, /health)
│   ├── core/
│   │   └── config.py       # Variables de configuration & paramètres CORS
│   ├── database/
│   │   └── session.py      # Connexion SQLAlchemy & Gestion des sessions
│   ├── models/
│   │   └── calculation.py  # Modèle SQLite SQLAlchemy (Calculation)
│   ├── schemas/
│   │   └── salary.py       # Modèles Pydantic Request/Response
│   └── services/
│       └── calculator.py   # Moteur de calcul fiscal et social Malagasy
└── frontend/               # Application Web React Vite TypeScript
    ├── package.json        # Dépendances Node.js & scripts npm
    ├── index.html          # Shell HTML principal
    ├── vite.config.ts      # Configuration Vite
    └── src/
        ├── main.tsx        # Initialisation React
        ├── App.tsx         # Composant racine & Providers (React Query, Theme)
        ├── components/     # Composants UI (Formulaire, Résultats, Graphique, Fiche PDF, Header)
        ├── hooks/          # Hooks personnalisés (useSalaryCalculation, useHistory)
        ├── pages/          # Pages principales (HomePage)
        ├── schemas/        # Schémas Zod de validation des formulaires
        ├── services/       # Service d'intégration API REST (api.ts)
        ├── types/          # Interfaces TypeScript
        └── utils/          # Moteur de calcul local (calculations.ts) et export PDF (export.ts)
```

---

## ⚖️ Barème Fiscal et Cotisations Sociales Appliquées (2026)

| Élément | Part Salarié | Part Patronale | Plafond Mensuel | Notes |
| :--- | :---: | :---: | :---: | :--- |
| **CNAPS** | 1% | 13% | 2 400 000 MGA | Cotisation Retraite & Sécurité Sociale |
| **OSTIE / AMIT** | 1% | 5% | 2 400 000 MGA | Service Médical Inter-Entreprises |
| **IRSA (Impôt)** | Progressif | 0% | Aucun | Calculé sur le Salaire Net Imposable |

### Tranches du Barème Progressif IRSA

| Tranche de Revenu Imposable (MGA) | Taux IRSA |
| :--- | :---: |
| De 0 à 350 000 MGA | 0% |
| De 350 001 à 400 000 MGA | 5% |
| De 400 001 à 500 000 MGA | 10% |
| De 500 001 à 600 000 MGA | 15% |
| De 600 001 à 4 000 000 MGA | 20% |
| Au-dessus de 4 000 000 MGA | 25% |

- **Abattement familial** : Déduction de 2 000 MGA d'IRSA par personne à charge.
- **IRSA Minimum** : 3 000 MGA pour tout salaire imposable.

---

## 🧪 Tests & Build

```bash
# Vérifier la compilation TypeScript du frontend et construire le bundle de production
cd frontend
npm run build

# Vérifier la syntaxe Python du backend
cd ../backend
python -m py_compile main.py services/calculator.py api/routes.py
```

---

## 💻 Compilation pour Android

### 1. Générer l'APK
```bash
cd frontend
npx @tauri-apps/cli android build -- --apk
```

---

## 📝 Licence

Projet développé sous licence MIT. Libre d'utilisation pour la gestion de la paie et la simulation salariale à Madagascar.
