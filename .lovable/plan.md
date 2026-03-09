

## Audit RBAC : Admin / Collaborateur / Invité

### Constat actuel

Le système ne gère que 2 rôles (`admin` | `user`) sans aucune restriction réelle sur les pages. Voici l'état par page :

| Page | Restriction actuelle | Problème |
|------|---------------------|----------|
| Dashboard | Aucune | Tout le monde voit les mêmes KPIs et l'activité des autres |
| Documents | `isRestricted = false` (hardcodé) | Upload, import, chat IA accessibles à tous |
| Formations | Aucune | Bouton "Générer" visible pour tous |
| Evaluations | Aucune | OK pour tous les rôles |
| Roleplay | Aucune | OK pour tous les rôles |
| Analytics | Aucune | Données sensibles visibles par tous |
| Sidebar | `adminOnly` sur "Utilisateurs" uniquement | Inviter visible pour tous |

Le rôle "Invité" n'existe pas du tout.

---

### Matrice d'accès cible

```text
┌─────────────────────┬──────────┬──────────────┬────────────┐
│ Fonctionnalité      │  Admin   │ Collaborateur│   Invité   │
├─────────────────────┼──────────┼──────────────┼────────────┤
│ Dashboard KPIs      │ Tous     │ Son service  │ Ses stats  │
│ Dashboard activité  │ Toutes   │ Son service  │ ✗ masqué   │
│ Quick actions       │ Toutes   │ Sans "Inviter"│ ✗ masqué  │
├─────────────────────┼──────────┼──────────────┼────────────┤
│ Documents - voir    │ ✓ tous   │ ✓ son service│ ✓ assignés │
│ Documents - upload  │ ✓        │ ✓            │ ✗          │
│ Documents - chat IA │ ✓        │ ✓            │ ✗          │
│ Documents - download│ ✓        │ ✓            │ ✗ (🔒)     │
├─────────────────────┼──────────┼──────────────┼────────────┤
│ Formations - voir   │ ✓ toutes │ ✓ toutes     │ ✓ assignées│
│ Formations - générer│ ✓        │ ✗            │ ✗          │
│ Formations - éditer │ ✓        │ ✗            │ ✗          │
├─────────────────────┼──────────┼──────────────┼────────────┤
│ Évaluations         │ ✓ + stats│ ✓ passer     │ ✓ passer   │
│ Jeu de rôle         │ ✓ + créer│ ✓ jouer      │ ✓ jouer    │
├─────────────────────┼──────────┼──────────────┼────────────┤
│ Analytics           │ ✓ global │ ✓ son service│ ✗ masqué   │
├─────────────────────┼──────────┼──────────────┼────────────┤
│ Utilisateurs (page) │ ✓        │ ✗            │ ✗          │
│ Paramètres          │ ✓ tout   │ ✓ profil seul│ ✗          │
│ Inviter             │ ✓        │ ✓            │ ✗          │
│ Logout              │ ✓        │ ✓            │ ✓          │
└─────────────────────┴──────────┴──────────────┴────────────┘
```

---

### Plan d'implémentation

#### 1. Etendre le système de rôles
- **`RoleContext.tsx`** : Ajouter `"guest"` au type `Role` (→ `"admin" | "user" | "guest"`)
- **`testUsers.json`** : Ajouter un utilisateur invité test
- **`AppSidebar.tsx`** : Masquer Analytics, Paramètres, Inviter pour les invités. Masquer Utilisateurs pour non-admins (déjà fait)

#### 2. Créer un hook `usePermissions`
Un hook centralisé qui expose des booléens clairs basés sur le rôle :
- `canUpload`, `canGenerateFormation`, `canViewAnalytics`, `canInvite`, `canManageUsers`, `canUseAIChat`, `canDownloadDocs`, `canEditSettings`
- Elimine les `role === "admin"` éparpillés dans le code

#### 3. Appliquer les restrictions par page

- **Dashboard** : Masquer "Activité récente" et "Quick actions" (sauf évaluations/roleplay) pour les invités
- **Documents** : Masquer upload zone, chat IA, et bouton download pour invités. Afficher le cadenas 🔒
- **Formations** : Masquer bouton "Générer" pour non-admins. Invités voient une liste réduite
- **Analytics** : Rediriger les invités vers Dashboard. Collaborateurs voient uniquement leur service
- **Sidebar** : Filtrage dynamique selon le rôle (plus de liens que nécessaire = masqués)

#### 4. Composant `<RestrictedBadge />`
Petit composant réutilisable qui affiche un tooltip 🔒 "Accès restreint" quand une action est interdite, au lieu de masquer brutalement les éléments (meilleure UX).

#### 5. Login - Support du rôle Invité
Le login via lien d'invitation attribuera automatiquement le rôle `guest`. Le formulaire login classique reste pour admin/collaborateur.

---

### Résumé des fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `src/contexts/RoleContext.tsx` | Ajouter `"guest"` au type Role |
| `src/hooks/usePermissions.ts` | Nouveau hook centralisé RBAC |
| `src/components/RestrictedBadge.tsx` | Nouveau composant 🔒 |
| `src/data/testUsers.json` | Ajouter invité test |
| `src/components/AppSidebar.tsx` | Filtrage nav par rôle |
| `src/pages/Index.tsx` | Restrictions invité |
| `src/pages/Documents.tsx` | Restrictions invité (upload, chat, download) |
| `src/pages/Formations.tsx` | Masquer "Générer" pour non-admins |
| `src/pages/Analytics.tsx` | Restreindre accès invité |

