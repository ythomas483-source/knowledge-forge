

## Plan : Interface plus en relief, ludique et professionnelle

### Diagnostic actuel
L'interface utilise un style "glass-card" plat avec des ombres subtiles et un fond sombre uniforme. Les cartes manquent de profondeur visuelle et l'ensemble est fonctionnel mais assez "flat".

### Modifications proposées

#### 1. Système d'ombres et de relief amélioré (`src/index.css`)
- Ajouter des ombres **multi-couches** sur les cartes (inner highlight + ombre portée profonde) pour créer un vrai effet de profondeur/élévation
- Ajouter une classe `.card-elevated` avec un léger dégradé vertical (plus clair en haut, plus sombre en bas) simulant un éclairage 3D
- Renforcer l'effet `glass-card` avec un reflet lumineux en haut (inset border-top blanc subtil)
- Ajouter une classe `.card-hover-lift` avec une ombre qui s'étend au hover et un léger translateY(-4px)

#### 2. Micro-interactions ludiques (`src/index.css` + composants)
- Ajouter une animation `bounce-in` pour les éléments qui apparaissent (plus dynamique que le fade actuel)
- Ajouter un effet `hover:ring` coloré subtil sur les cartes interactives
- Créer une classe `.icon-bounce` qui anime les icones au hover (petit rebond vertical)

#### 3. Cartes StatCard avec plus de relief (`src/components/StatCard.tsx`)
- Appliquer le nouveau style `card-elevated` avec un bord supérieur coloré (accent de couleur selon le type)
- Ajouter un `ring` coloré subtil au hover
- Légère rotation 3D subtile avec `perspective` au hover via framer-motion

#### 4. Landing page plus dynamique (`src/pages/Landing.tsx`)
- Cartes de rôle : ajouter un bord supérieur coloré (top border gradient) pour marquer visuellement chaque rôle
- Feature pills : ajouter un léger effet d'ombre portée et un scale plus prononcé au hover
- Renforcer la hiérarchie visuelle avec des tailles de texte plus contrastées

#### 5. Dashboard plus vivant (`src/pages/Index.tsx`)
- Appliquer `card-elevated` aux sections principales
- Quick actions : ajouter un bord gauche coloré (comme un accent bar) pour rendre les cartes plus distinctives
- Formations en cours : ajouter un hover avec légère élévation sur chaque ligne

#### 6. Sidebar avec plus de profondeur (`src/components/AppSidebar.tsx`)
- Ajouter une ombre interne douce sur le panneau latéral
- Active indicator : ajouter un léger glow derrière l'icone active

### Fichiers modifiés
- `src/index.css` -- nouvelles classes utilitaires (relief, hover-lift, icon-bounce, etc.)
- `src/components/StatCard.tsx` -- style élevé + micro-interaction hover
- `src/pages/Landing.tsx` -- cartes rôles avec bord coloré + profondeur
- `src/pages/Index.tsx` -- dashboard cards élevées + accent bars
- `src/components/AppSidebar.tsx` -- ombre interne + glow actif

### Philosophie
Tout reste professionnel : pas de couleurs criardes ni d'animations excessives. On joue sur les **ombres multi-couches**, les **micro-interactions au hover**, et les **accents de couleur subtils** pour donner du volume sans sacrifier l'élégance.

