

## Plan : Integrer le module Lumina-Tokenizer dans le projet

### Contexte
Le repo `Lumina-Tokenizer` contient un pipeline PII complet (detection NER + regex + Presidio, decoupage, extraction de fichiers, chiffrement AES-GCM, stockage IndexedDB). Il remplace le module PII existant qui est plus basique.

### Fichiers a creer (sous `src/lib/pii/`)

| Fichier | Contenu |
|---------|---------|
| `types.ts` | Types partages : `EntitePII`, `CarteTokensChiffree`, `EnregistrementTableTokens` |
| `decoupeur.ts` | Decoupage du texte en morceaux de ~300 mots avec chevauchement |
| `detecteur-pii.ts` | Detection NER (BERT multilingue) + 20+ regex FR/CH + Presidio optionnel |
| `extracteur-texte.ts` | Extraction texte de PDF, DOCX, XLSX, PPTX, TXT, CSV, MD |
| `crypto.ts` | Chiffrement/dechiffrement AES-GCM via WebCrypto + PBKDF2 |
| `tokenizer.ts` | Censure du texte + chiffrement du mapping + restauration |
| `token-table.ts` | Stockage IndexedDB via `idb` |
| `presidio-client.ts` | Client Presidio optionnel |
| `index.ts` | Barrel export |

### Fichiers a modifier

| Fichier | Changement |
|---------|------------|
| `src/lib/pii/piiDetector.ts` | Supprime (remplace par `detecteur-pii.ts`) |
| `src/lib/pii/tokenStore.ts` | Supprime (remplace par `token-table.ts` + `crypto.ts`) |
| `src/hooks/usePIIDetector.ts` | Adapter les imports vers le nouveau module, mapper `EntitePII` vers l'interface attendue par `PIIPreviewDialog` |
| `src/components/PIIPreviewDialog.tsx` | Adapter les imports/types pour le nouveau format d'entites |
| `src/pages/Documents.tsx` | Aucun changement (consomme via le hook) |

### Dependances a ajouter
- `idb` (IndexedDB typee)
- `pdfjs-dist` (extraction PDF)
- `mammoth` (extraction DOCX)
- `xlsx` (extraction Excel)
- `jszip` (extraction PPTX)

**Note** : le modele NER passe de `@huggingface/transformers` v3 a `@xenova/transformers` v2 (utilise par le repo source). On gardera `@xenova/transformers` dans `detecteur-pii.ts` comme prevu par l'auteur.

### Adaptation technique
Le hook `usePIIDetector` servira d'adaptateur : il continuera a exposer la meme API (`detect`, `isLoading`, `modelReady`, etc.) mais appelera en interne `détecterPII()` du nouveau module et convertira les `EntitePII` en format compatible avec `PIIPreviewDialog`.

