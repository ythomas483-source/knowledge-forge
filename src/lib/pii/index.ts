// ============================================================
// index.ts — point d'entrée du module de protection PII
// ============================================================

// --- Extraction de texte ---
export { extraireTexte, ACCEPT_INPUT_FILE, FORMATS_ACCEPTES } from './extracteur-texte';

// --- Types partagés ---
export type { EntitePII, CarteTokensChiffree, EnregistrementTableTokens } from './types';

// --- Bloc 1 : Détection PII ---
export { détecterPII, isModelLoaded } from './detecteur-pii';

// --- Presidio (optionnel) ---
export { configurerPresidio, presidioEstDisponible, détecterParPresidio } from './presidio-client';

// --- Bloc 2 : Tokenisation + Chiffrement ---
export { traiterDocument, restaurerRéponse, restaurerDocument } from './tokenizer';
export type { DocumentTraite } from './tokenizer';

// --- Bloc 2 (crypto) ---
export { déchiffrerCarteTokens } from './crypto';

// --- Bloc 3 : Table locale de tokens (IndexedDB) ---
export {
  sauvegarderTableTokens,
  chargerTableTokens,
  supprimerTableTokens,
  viderToutesLesTableTokens,
} from './token-table';
