

## Plan : Authentification locale avec JSON de test

### Contexte
Pas de serveur actif — on crée un fichier JSON d'utilisateurs de test et on valide email/mot de passe côté client avant d'autoriser la connexion. Temporaire avant migration vers Infomaniak.

### Fichiers à créer/modifier

**1. Créer `src/data/testUsers.json`**
Fichier JSON avec des utilisateurs de test (mots de passe en clair — acceptable pour du test local uniquement) :
```json
[
  { "email": "admin@lumina.ch", "password": "Admin123!", "role": "admin", "name": "Admin Lumina" },
  { "email": "user@lumina.ch", "password": "User123!", "role": "user", "name": "Marie Dupont" },
  { "email": "collab@lumina.ch", "password": "Collab123!", "role": "user", "name": "Jean Martin" }
]
```

**2. Modifier `src/pages/Login.tsx`**
- Importer le JSON
- Dans `handleLogin`, vérifier que l'email et le mot de passe correspondent à une entrée du JSON
- Si match : appeler `setRole(user.role)` et naviguer vers `/dashboard`
- Si pas de match : afficher un toast d'erreur "Email ou mot de passe incorrect"
- Supprimer la dépendance au `?role=` dans l'URL (le rôle vient du JSON)

**3. Modifier `src/pages/Landing.tsx`**
- Simplifier : un seul bouton "Se connecter" qui redirige vers `/login` (plus besoin de choisir admin/user sur la landing, le rôle est déterminé par les identifiants)

### Sécurité
- Un bandeau "Mode test — données locales" sera visible sur la page login
- Les mots de passe en clair dans le JSON sont acceptables car c'est du test local, pas de production

