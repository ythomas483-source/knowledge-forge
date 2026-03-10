// ============================================================
// crypto.ts — chiffrement et déchiffrement de la carte de tokens
// AES-GCM via WebCrypto + PBKDF2
// ============================================================

import { CarteTokensChiffree } from './types';

async function dériverClé(jwt: string, sel: Uint8Array): Promise<CryptoKey> {
  const materiau = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(jwt),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: sel, iterations: 100_000, hash: 'SHA-256' },
    materiau,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function chiffrerCarteTokens(
  carteTokens: Record<string, string>,
  jwt: string
): Promise<CarteTokensChiffree> {
  const sel = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cle = await dériverClé(jwt, sel);
  const texteClair = new TextEncoder().encode(JSON.stringify(carteTokens));
  const texteCiphere = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cle, texteClair);
  return { texteCiphere, iv, sel };
}

export async function déchiffrerCarteTokens(
  chiffre: CarteTokensChiffree,
  jwt: string
): Promise<Record<string, string>> {
  const cle = await dériverClé(jwt, chiffre.sel);
  const texteClair = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: chiffre.iv },
    cle,
    chiffre.texteCiphere
  );
  return JSON.parse(new TextDecoder().decode(texteClair));
}
