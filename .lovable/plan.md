

## Analyse de cohérence : Vision Frontend vs. Implémentation actuelle

### Verdict : Cohérent et compatible — avec un correctif build + des modules à compléter

---

### 1. Mapping Vision → Code existant

| Module décrit | Statut | Fichiers existants |
|---|---|---|
| **UI Browser (connexion + interaction)** | Fait | `Landing.tsx`, `Login.tsx`, `RoleContext.tsx`, `DashboardLayout.tsx` |
| **Prompt IA (requêtes serveur)** | Partiellement fait (UI mock) | `Documents.tsx` — section chat avec input, mais réponses simulées côté client |
| **Upload documents (RAG)** | UI seulement | `Documents.tsx` — zone drag & drop, pas encore connecté à un backend |
| **Anonymizer (PII + Tokenizer)** | Fait | `piiDetector.ts` (Transformers.js NER), `tokenStore.ts` (IndexedDB) |
| **Table locale de tokens** | Fait | `tokenStore.ts` — IndexedDB avec `saveTokenMap`, `getTokenMap`, `deanonymize` |
| **Chiffrement AES-GCM** | Non implémenté | Prévu dans le schéma, pas encore codé |
| **Communication HTTPS avec backend** | Non implémenté | Pas de couche API/service, pas de backend connecté |

### 2. Ce qui est déjà aligné

- Le pipeline PII fonctionne **entièrement dans le browser** (Transformers.js) — conforme à la vision
- Les tokens sont stockés **localement** dans IndexedDB par document — conforme
- L'utilisateur ne voit que l'UI, la logique PII est transparente via `usePIIDetector` hook + `PIIPreviewDialog`
- L'architecture est 100% React/Vite côté client — compatible browser-only

### 3. Ce qu'il reste à implémenter

1. **Chiffrement AES-GCM** (WebCrypto API) : chiffrer les tokens dans IndexedDB avec une clé utilisateur dérivée via PBKDF2
2. **Couche API/Services** : module de communication HTTPS avec le backend (upload documents, prompt IA, authentification réelle)
3. **Upload réel de documents** : connecter la zone drag & drop à un endpoint backend pour le RAG
4. **Authentification réelle** : remplacer le système de rôles simulé par Supabase Auth ou un backend réel

### 4. Correctif build requis

Il y a une erreur de syntaxe dans `Documents.tsx` ligne 79 : un `};` en trop après la fonction `send()`. Ce sera corrigé en supprimant cette ligne.

### Plan d'action immédiat

**Fichier modifié :**
- `src/pages/Documents.tsx` — supprimer le `};` superflu à la ligne 79

---

### Résumé

La pensée architecturale est **cohérente et compatible** avec le code existant. Les modules UI, PII et stockage local sont en place. Il manque principalement la couche de communication serveur (API HTTPS), le chiffrement AES-GCM, et la connexion réelle au backend — ce qui est logique car ces modules dépendent de l'API définie avec l'équipe backend.

