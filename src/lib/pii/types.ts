// ============================================================
// types.ts — types partagés entre les trois blocs
// ============================================================

export interface EntitePII {
  id: string;       // identifiant unique du token, ex: "PII_001"
  valeur: string;   // le texte PII réel, ex: "Jean Dupont"
  debut: number;    // position du premier caractère dans le texte original
  fin: number;      // position du dernier caractère dans le texte original
  type: string;     // catégorie de l'entité : "PER", "LOC", "ORG", "EMAIL", etc.
}

export interface CarteTokensChiffree {
  texteCiphere: ArrayBuffer;
  iv: Uint8Array;
  sel: Uint8Array;
}

export interface EnregistrementTableTokens extends CarteTokensChiffree {
  documentId: string;
  creeA: Date;
}
