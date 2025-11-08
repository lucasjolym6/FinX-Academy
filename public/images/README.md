# Logo FinX Academy

Placez votre image de logo dans ce dossier.

## 📋 Instructions

1. **Copiez votre image de logo** dans ce dossier (`public/images/`)
2. **Nommez-la `logo.png`** (ou `logo.svg` si c'est un SVG)
3. Le logo sera automatiquement utilisé dans :
   - La barre de navigation (Navbar)
   - Le pied de page (Footer)

## 📁 Format attendu

- **Nom du fichier** : `logo.png` (recommandé) ou `logo.svg`
- **Emplacement** : `/public/images/logo.png`
- **Dimensions recommandées** : 
  - Largeur : ~180px (pour un logo horizontal)
  - Hauteur : ~60px
  - Format : PNG avec transparence ou SVG

## 🔧 Formats supportés

- **PNG** (`.png`) - ✅ Recommandé pour logos avec transparence
- **SVG** (`.svg`) - ✅ Recommandé pour logos vectoriels (meilleure qualité)
- **JPG/JPEG** (`.jpg`, `.jpeg`) - ⚠️ Moins recommandé (pas de transparence)
- **WebP** (`.webp`) - ✅ Bon format moderne

## 💡 Note

Si vous utilisez un format différent de PNG, modifiez le chemin dans `components/Logo.tsx` :
- Ligne 19 : `src="/images/logo.png"` → changez l'extension selon votre format

Le logo sera automatiquement optimisé par Next.js Image pour de meilleures performances.

## 🎨 Fallback

Si l'image n'existe pas encore, un fallback temporaire sera affiché (logo avec "F" + texte "FinX Academy").

