// ============================================================
// tokenizer.ts — Bloc 2 : Tokenisation + Chiffrement + Censure
// ============================================================

import { chiffrerCarteTokens, déchiffrerCarteTokens } from './crypto';
import { chargerTableTokens } from './token-table';
import { EntitePII, CarteTokensChiffree } from './types';

function censurerDocument(
  texte: string,
  entites: EntitePII[]
): { texteCensure: string; carteTokens: Record<string, string> } {
  const carteTokens: Record<string, string> = {};
  for (const entite of entites) {
    carteTokens[entite.id] = entite.valeur;
  }

  const entitesTriees = [...entites].sort((a, b) => b.debut - a.debut);
  let texteCensure = texte;
  for (const entite of entitesTriees) {
    const placeholder = `[[${entite.id}]]`;
    texteCensure =
      texteCensure.slice(0, entite.debut) +
      placeholder +
      texteCensure.slice(entite.fin);
  }

  return { texteCensure, carteTokens };
}

export interface DocumentTraite {
  texteCensure: string;
  chiffre: CarteTokensChiffree;
}

export async function traiterDocument(
  texte: string,
  entites: EntitePII[],
  jwt: string
): Promise<DocumentTraite> {
  const { texteCensure, carteTokens } = censurerDocument(texte, entites);
  const chiffre = await chiffrerCarteTokens(carteTokens, jwt);
  return { texteCensure, chiffre };
}

export async function restaurerRéponse(
  documentId: string,
  texte: string,
  jwt: string
): Promise<string> {
  const enregistrement = await chargerTableTokens(documentId);
  if (!enregistrement) return texte;
  const carteTokens = await déchiffrerCarteTokens(enregistrement, jwt);
  return restaurerDocument(texte, carteTokens);
}

export function restaurerDocument(
  texte: string,
  carteTokens: Record<string, string>
): string {
  let texteRestaure = texte;
  for (const [id, valeur] of Object.entries(carteTokens)) {
    texteRestaure = texteRestaure.replaceAll(`[[${id}]]`, valeur);
  }
  return texteRestaure;
}
