// ============================================================
// detecteur-pii.ts — Bloc 1 : Détection des PII (NER locale)
//
// Trois stratégies combinées :
//   1. Modèle NER (BERT multilingue) via @huggingface/transformers
//   2. Expressions régulières (regex) FR/CH
//   3. Presidio (optionnel)
// ============================================================

import { pipeline, type TokenClassificationPipeline } from '@huggingface/transformers';
import { découperTexte } from './decoupeur';
import { EntitePII } from './types';
import { détecterParPresidio, presidioEstDisponible } from './presidio-client';

// ---------------------
// Configuration du modèle
// ---------------------

const NOM_MODELE = 'Xenova/bert-base-multilingual-cased-ner-hrl';

let pipelineNER: TokenClassificationPipeline | null = null;
let loadingPromise: Promise<TokenClassificationPipeline> | null = null;

async function obtenirPipeline(
  onProgress?: (progress: number) => void
): Promise<TokenClassificationPipeline> {
  if (pipelineNER) return pipelineNER;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (pipeline as any)('token-classification', NOM_MODELE, {
    dtype: 'q8',
    progress_callback: (data: any) => {
      if (data.status === 'progress' && onProgress) {
        onProgress(Math.round(data.progress));
      }
    },
  }) as Promise<TokenClassificationPipeline>;

  pipelineNER = await loadingPromise;
  loadingPromise = null;
  return pipelineNER;
}

export function isModelLoaded(): boolean {
  return pipelineNER !== null;
}

// ---------------------
// Regex FR/CH
// ---------------------

const PATTERNS_REGEX: { type: string; regex: RegExp }[] = [
  { type: 'EMAIL', regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g },
  { type: 'TELEPHONE', regex: /(?:\+33|0033|0)\s*[1-9](?:[\s.\-]?\d{2}){4}/g },
  { type: 'ADRESSE', regex: /\b\d{1,4}\s+(?:rue|avenue|boulevard|allée|impasse|chemin|route|place|voie)\s+[^\n,]{3,50}/gi },
  { type: 'CODE_POSTAL', regex: /\b(?:0[1-9]|[1-8]\d|9[0-5])\d{3}\b/g },
  { type: 'SECU', regex: /[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}/g },
  { type: 'CNI', regex: /\b(?:CNI|carte\s+d'identité|passeport)\s*:?\s*[A-Z0-9]{9,12}\b/gi },
  { type: 'SIRET_SIREN', regex: /\b\d{3}\s?\d{3}\s?\d{3}(?:\s?\d{5})?\b/g },
  { type: 'URSSAF', regex: /\b\d{3}\s?\d{7}\b/g },
  { type: 'MUTUELLE', regex: /\b(?:adhérent|contrat|police|mutuelle|prévoyance)\s*n?°?\s*:?\s*[A-Z0-9\-]{6,20}\b/gi },
  { type: 'IBAN', regex: /\b[A-Z]{2}\d{2}(?:\s?\d{4}){4,7}\s?\d{1,4}\b/g },
  { type: 'MONTANT', regex: /\b\d[\d\s]*(?:,\d{1,2})?\s*(?:€|EUR|euros?)(?!\w)/gi },
  { type: 'DATE_NAISSANCE', regex: /\bn[ée]e?\s+le\s+\d{1,2}[\s\/.\-]\w+[\s\/.\-]\d{4}\b/gi },
  { type: 'DATE', regex: /\b\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{4}\b/g },
  { type: 'REFERENCE', regex: /\b(?:CTR|MAT|EMP|REF|N°|NR)[\s\-_\/]?[\dA-Z]{4,}\b/gi },
  { type: 'ADRESSE_IP', regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
  { type: 'URL', regex: /https?:\/\/[^\s<>"]{4,}/gi },
  // Suisse
  { type: 'AVS', regex: /756[.\s]?\d{4}[.\s]?\d{4}[.\s]?\d{2}/g },
  { type: 'IBAN', regex: /\bCH\d{2}(?:\s?\d{4}){4}\s?\d\b/g },
  { type: 'TELEPHONE', regex: /\+41\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}/g },
  { type: 'IDE', regex: /\bCHE[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{3}\b/g },
  { type: 'MONTANT', regex: /\b\d[\d\s']*(?:\.\d{1,2})?\s*(?:CHF|Fr\.|francs?)\b/gi },
  { type: 'MONTANT', regex: /(?:CHF|Fr\.)\s*\d[\d\s']*(?:\.\d{1,2})?/g },
];

function détecterParRegex(texte: string): Omit<EntitePII, 'id'>[] {
  const résultats: Omit<EntitePII, 'id'>[] = [];
  for (const { type, regex } of PATTERNS_REGEX) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(texte)) !== null) {
      résultats.push({
        valeur: match[0],
        debut: match.index,
        fin: match.index + match[0].length,
        type,
      });
    }
  }
  return résultats;
}

// ---------------------
// Déduplication
// ---------------------

function dédupliquer(entites: Omit<EntitePII, 'id'>[]): Omit<EntitePII, 'id'>[] {
  const triées = [...entites].sort((a, b) => a.debut - b.debut);
  const résultat: Omit<EntitePII, 'id'>[] = [];
  for (const entite of triées) {
    const dernière = résultat[résultat.length - 1];
    if (dernière && entite.debut < dernière.fin) continue;
    résultat.push(entite);
  }
  return résultat;
}

function attribuerIdentifiants(entites: Omit<EntitePII, 'id'>[]): EntitePII[] {
  return entites.map((entite, index) => ({
    ...entite,
    id: `PII_${String(index + 1).padStart(3, '0')}`,
  }));
}

// ---------------------
// API publique
// ---------------------

export async function détecterPII(
  texte: string,
  rappelChargement?: (progression: number) => void
): Promise<EntitePII[]> {
  const ner = await obtenirPipeline(rappelChargement);
  const morceaux = découperTexte(texte);

  const entitésBrutes: Omit<EntitePII, 'id'>[] = [];

  for (let i = 0; i < morceaux.length; i++) {
    const morceau = morceaux[i];
    if (rappelChargement) {
      rappelChargement(Math.round((i / morceaux.length) * 100));
    }

    const résultatBrut = await ner(morceau.texte, { ignore_labels: [] }) as unknown as {
      word: string;
      entity_group?: string;
      entity?: string;
      score: number;
      start: number;
      end: number;
    }[];

    for (const entité of résultatBrut) {
      const entityType = entité.entity_group || entité.entity || 'MISC';
      // Normalize BIO tags
      const cleanType = entityType.replace(/^[BI]-/, '');
      entitésBrutes.push({
        valeur: entité.word,
        debut: morceau.offsetDebut + entité.start,
        fin: morceau.offsetDebut + entité.end,
        type: cleanType,
      });
    }
  }

  const entitésRegex = détecterParRegex(texte);

  let entitésPresidio: Omit<EntitePII, 'id'>[] = [];
  if (await presidioEstDisponible()) {
    entitésPresidio = await détecterParPresidio(texte);
  }

  const toutesLesEntités = [...entitésBrutes, ...entitésRegex, ...entitésPresidio];
  const sansDoublons = dédupliquer(toutesLesEntités);
  const avecIdentifiants = attribuerIdentifiants(sansDoublons);

  if (rappelChargement) rappelChargement(100);

  return avecIdentifiants;
}
