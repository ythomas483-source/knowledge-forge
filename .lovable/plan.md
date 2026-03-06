

## Plan : Supprimer le rôle Invité de la landing + Ajouter un système d'invitation par lien

### 1. Supprimer la carte "Invité" de la Landing Page (`src/pages/Landing.tsx`)
- Retirer l'entrée `guest` du tableau `roles` (lignes 58-66)
- Passer la grille de `md:grid-cols-3` à `md:grid-cols-2` pour 2 cartes centrées
- Supprimer le type `"guest"` de la fonction `selectRole`

### 2. Supprimer le flux login Guest (`src/pages/Login.tsx`)
- Retirer la config `guest` de `roleConfig`
- Supprimer le bloc conditionnel `isGuest` (accès sans identifiants)
- Rediriger vers `/` si `role=guest` dans les query params

### 3. Nettoyer les traductions Guest (`src/contexts/LanguageContext.tsx`)
- Supprimer les clés `guest_title`, `guest_desc`, `login_guest_continue`, `login_guest_info` dans les 4 langues

### 4. Nettoyer le RoleContext (`src/contexts/RoleContext.tsx`)
- Retirer `"guest"` du type `Role` (garder `"admin" | "user"`)
- Mettre le rôle par défaut à `"user"` au lieu de `"guest"`

### 5. Ajouter une fonctionnalité "Inviter un participant" dans le Dashboard
- **Nouveau composant `src/components/InviteDialog.tsx`** : dialog modal avec :
  - Génération d'un lien d'invitation unique (simulé côté client pour l'instant)
  - Bouton "Copier le lien" avec feedback (toast)
  - Champ email optionnel pour envoi direct (UI seulement)
- **Visible uniquement pour Admin et Collaborateur** (pas de restriction guest puisque ce rôle est supprimé)
- **Ajout dans la sidebar** (`AppSidebar.tsx`) : nouveau lien "Inviter" avec icône `UserPlus`, visible pour admin et user
- **Ajout dans le Dashboard** (`Index.tsx`) : bouton d'action rapide "Inviter un participant" dans la section Quick Actions

### Fichiers modifiés
- `src/pages/Landing.tsx` -- suppression carte guest, grille 2 colonnes
- `src/pages/Login.tsx` -- suppression flux guest
- `src/contexts/LanguageContext.tsx` -- nettoyage traductions + ajout clés invitation
- `src/contexts/RoleContext.tsx` -- suppression type guest
- `src/components/AppSidebar.tsx` -- ajout lien "Inviter"
- `src/pages/Index.tsx` -- bouton invitation dans Quick Actions
- `src/components/InviteDialog.tsx` -- nouveau composant dialog d'invitation

