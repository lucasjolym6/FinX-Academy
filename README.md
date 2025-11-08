# FinX Academy

Plateforme web gamifiée d'apprentissage de la finance d'entreprise, de la finance de marché et de la stratégie.

## 🚀 Technologies

- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **React 18** pour l'interface utilisateur

## 🎨 Design

- **Palette de couleurs** :
  - Primary: `#0A2540` (bleu foncé)
  - Accent: `#F5B301` (or)
  - Background: `#F9FAFB` (fond clair)
- **Police** : Inter / Poppins
- **Style** : Minimaliste, épuré, professionnel et motivant

## 📁 Structure du Projet

```
FinX Academy/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── parcours/          # Pages parcours
│   ├── lecon/             # Pages leçons
│   ├── dashboard/         # Dashboard utilisateur
│   └── profil/            # Profil et badges
├── components/            # Composants réutilisables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CourseCard.tsx
│   ├── ModuleAccordion.tsx
│   ├── LessonContent.tsx
│   ├── Quiz.tsx
│   ├── ProgressBar.tsx
│   └── LevelIndicator.tsx
├── data/                  # Données et contenu
├── types/                 # Types TypeScript
└── public/                # Assets statiques
```

## 🚦 Démarrage

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📝 Pages Disponibles

- `/` - Page d'accueil avec présentation de la plateforme
- `/parcours` - Liste de tous les parcours disponibles
- `/parcours/[slug]` - Détails d'un parcours spécifique
- `/lecon/[lessonId]` - Contenu d'une leçon avec quiz
- `/dashboard` - Tableau de bord utilisateur avec progression
- `/profil` - Profil utilisateur, badges et statistiques

## 🎯 Fonctionnalités

- ✅ Système de parcours avec modules et leçons
- ✅ Quiz interactifs pour valider les connaissances
- ✅ Système de progression et XP
- ✅ Badges et récompenses
- ✅ Dashboard pour suivre l'avancement
- ✅ Design responsive et moderne
- ✅ Animations et transitions douces

## 🎨 Composants Principaux

- **Navbar** : Navigation principale avec liens vers les différentes sections
- **Footer** : Pied de page avec liens et informations
- **CourseCard** : Carte présentant un parcours
- **ModuleAccordion** : Module avec leçons dépliables
- **LessonContent** : Contenu d'une leçon avec sections
- **Quiz** : Quiz interactif avec validation
- **ProgressBar** : Barre de progression
- **LevelIndicator** : Indicateur de niveau et XP

## 📦 Build

```bash
npm run build
npm start
```

## 🔧 Développement

- Linter : `npm run lint`
- Build : `npm run build`
- Production : `npm start`

---

Créé avec ❤️ pour l'apprentissage de la finance de manière gamifiée

