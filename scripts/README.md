# Scripts d'optimisation

## 📸 Optimisation du logo pour la navbar

### Installation

```bash
npm install --save-dev sharp
```

### Utilisation

```bash
node scripts/optimize-logo.js
```

ou

```bash
npm run optimize-logo
```

### Ce que fait le script

1. **Recadre automatiquement** le logo pour supprimer les marges blanches autour
2. **Garde le fond transparent** (alpha channel)
3. **Optimise le poids** du PNG avec compression sans perte (niveau 9)
4. **Génère** `finx-logo-navbar.png` optimisé pour la navbar

### Fichiers requis

- **Source** : `public/images/Logo.png` (doit exister)
- **Sortie** : `public/images/finx-logo-navbar.png` (généré automatiquement)

### Résultat

Le logo optimisé sera automatiquement utilisé dans la navbar grâce au composant `NavbarLogo.tsx`.

