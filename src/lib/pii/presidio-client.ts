// ============================================================
// presidio-client.ts — Client Presidio optionnel pour la détection PII
// ============================================================

import { EntitePII } from './types';

let PRESIDIO_URL = 'http://localhost:5002';
let SCORE_THRESHOLD = 0.4;
let TIMEOUT_MS = 15_000;

export function configurerPresidio(options: {
  url?: string;
  scoreThreshold?: number;
  timeoutMs?: number;
}): void {
  if (options.url) PRESIDIO_URL = options.url;
  if (options.scoreThreshold !== undefined) SCORE_THRESHOLD = options.scoreThreshold;
  if (options.timeoutMs !== undefined) TIMEOUT_MS = options.timeoutMs;
}

const MAPPING_TYPES: Record<string, string> = {
  PERSON: 'PER', LOCATION: 'LOC', ORGANIZATION: 'ORG', NRP: 'MISC',
  DATE_TIME: 'DATE', EMAIL_ADDRESS: 'EMAIL', PHONE_NUMBER: 'TELEPHONE',
  IBAN_CODE: 'IBAN', IP_ADDRESS: 'ADRESSE_IP', URL: 'URL',
  FR_SECU: 'SECU', FR_SIRET_SIREN: 'SIRET_SIREN', FR_IBAN: 'IBAN',
  FR_TELEPHONE: 'TELEPHONE', FR_CODE_POSTAL: 'CODE_POSTAL', FR_ADRESSE: 'ADRESSE',
  FR_URSSAF: 'URSSAF', FR_MUTUELLE: 'MUTUELLE', FR_CNI: 'CNI',
  FR_DATE_NAISSANCE: 'DATE_NAISSANCE', FR_MONTANT: 'MONTANT', FR_REFERENCE: 'REFERENCE',
  CH_AVS: 'AVS', CH_IBAN: 'IBAN', CH_TELEPHONE: 'TELEPHONE',
  CH_NPA: 'CODE_POSTAL', CH_IDE: 'IDE', CH_MONTANT: 'MONTANT',
};

function convertirType(typePresidio: string): string {
  return MAPPING_TYPES[typePresidio] ?? typePresidio;
}

interface PresidioEntity {
  entity_type: string;
  start: number;
  end: number;
  score: number;
  text: string;
}

export async function presidioEstDisponible(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${PRESIDIO_URL}/health`, { signal: controller.signal });
    clearTimeout(timer);
    return response.ok;
  } catch {
    return false;
  }
}

export async function détecterParPresidio(
  texte: string,
  langue: string = 'fr'
): Promise<Omit<EntitePII, 'id'>[]> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const response = await fetch(`${PRESIDIO_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texte, language: langue, score_threshold: SCORE_THRESHOLD }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      console.warn(`[Presidio] Erreur ${response.status} : ${response.statusText}`);
      return [];
    }

    const entities: PresidioEntity[] = await response.json();
    return entities.map((e) => ({
      valeur: e.text,
      debut: e.start,
      fin: e.end,
      type: convertirType(e.entity_type),
    }));
  } catch (err) {
    console.warn('[Presidio] Serveur inaccessible, détection Presidio ignorée.', err);
    return [];
  }
}
