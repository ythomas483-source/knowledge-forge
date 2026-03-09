

## Ajustement des permissions Formations

Modification unique dans `src/hooks/usePermissions.ts` :

- **Collaborateur (user)** : `canGenerateFormation` reste `false` (admin-only confirmé), `canEditFormation` reste `false`
- **Admin** : conserve `canGenerateFormation: true` et `canEditFormation: true`
- **Invité** : aucun changement (déjà restreint)

En relisant le code actuel, les permissions sont **déjà correctement configurées** selon ta demande :

| Permission | Admin | Collaborateur | Invité |
|---|---|---|---|
| `canGenerateFormation` | ✓ | ✗ | ✗ |
| `canEditFormation` | ✓ | ✗ | ✗ |

Et dans `Formations.tsx`, le bouton "Générer" est déjà conditionné par `canGenerateFormation`, et les invités ne voient que les formations actives.

**Aucune modification n'est nécessaire** — le système est déjà aligné avec ta gouvernance. Le collaborateur ne peut ni générer ni modifier de formations, seul l'admin le peut.

