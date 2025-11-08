# FinX Academy

Plateforme premium orientée finance qui combine parcours de formation, simulations d’entretien IA et progression gamifiée. L’objectif : permettre aux étudiants et jeunes professionnels de pratiquer la finance corporate & marché dans une interface inspirée des dashboards fintech haut de gamme.

## 🚀 Stack & Design

- **Next.js 14** (App Router) + **React 18**
- **TypeScript**, **Tailwind CSS**, **Framer Motion**
- **Supabase** (auth, SQL, storage) pour les données utilisateurs, interviews et wallet
- **OpenAI** (GPT‑4o mini) pour la transcription, l’analyse verbale et visuelle des entretiens
- Identité visuelle : fond clair, accents bleu FinX `#3F76FF`, or `#F5B700`, typographie Inter

## ✨ Fonctionnalités principales

- **Parcours de formation** : modules corporate & marché avec cartes `TrackCard`, progression verrouillée, contenu de cours, quiz et examens.
- **Dashboard personnalisé** : synthèse XP/niveau, modules en cours, badges débloqués, statistiques dynamiques, suivi weekly.
- **Entretien IA** :
  - Page `/entretien-ia` type plateforme, sélection de métiers par thèmes
  - Simulation vidéo `/entretien-ia/simulation` avec caméra, enregistrement `MediaRecorder`, compte à rebours, multiples tentatives
  - Analyse verbale + visuelle (posture, regard, attire) via endpoints `analyze-interview` & `interviews/analyze-visuals`
  - Stockage des runs, vidéos, snapshots et feedbacks dans Supabase + restitution sur `/entretien-ia/feedback`
- **FinX Wallet** : tables SQL dédiées (`wallet_accounts`, `wallet_transactions`), API (`/api/wallet/summary|transactions`), hooks SWR et UI (dashboard + page `/wallet`) pour suivre crédits/bonus.

## 📁 Structure

```
FinX Academy/
├── app/
│   ├── page.tsx                   # Landing Apple/Stripe-like
│   ├── dashboard/page.tsx         # Dashboard connecté à Supabase
│   ├── parcours/page.tsx          # Sélecteur de thèmes & modules
│   ├── entretien-ia/              # Thèmes, simulation, feedback
│   ├── wallet/page.tsx            # Pilotage du FinX Wallet
│   ├── modules/...                # Contenu pédagogique détaillé
│   └── api/...                    # Routes API (OpenAI, Supabase)
├── components/                    # UI réutilisable (TrackCard, etc.)
├── data/                          # Données statiques (jobs, quiz…)
├── hooks/                         # Hooks Supabase/SWR (progress, wallet…)
├── lib/                           # Helpers (gamification, supabase)
└── supabase/                      # Scripts SQL (interviews, wallet…)
```

## ⚙️ Prérequis & Variables

Créer un `.env.local` avec :

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...      # pour scripts/cron si nécessaire
OPENAI_API_KEY=...
```

Utiliser les scripts SQL dans `supabase/*.sql` pour provisionner les tables (interviews, wallet, progression, etc.) et créer le bucket `interview-recordings`.

## 🚦 Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### Scripts utiles

- `npm run lint` – qualité du code
- `npm run build` – build production
- `npm start` – serveur Next.js en mode production

## 🔌 Endpoints API clés

- `POST /api/transcribe` – audio → texte (OpenAI Whisper)
- `POST /api/analyze-interview` – analyse verbale structurée (JSON schema)
- `POST /api/interviews/analyze-visuals` – feedback non verbal via snapshot
- `GET /api/wallet/summary` / `GET|POST /api/wallet/transactions` – wallet Supabase RPC

## 📸 Pages principales

- `/` : landing premium
- `/parcours` : navigation par thèmes, cartes `TrackCard`
- `/entretien-ia` : sélection métiers, liens vers simulation
- `/entretien-ia/simulation` : interface style HireVue
- `/entretien-ia/feedback` : restitution feedbacks IA
- `/dashboard` : vue utilisateur personnalisée
- `/wallet` : solde, breakdown et historique crédit

---

FinX Academy – apprendre, pratiquer et performer la finance augmentée par l’IA.***

