// ============================================================
// token-table.ts — Bloc 3 : Table locale de tokens (IndexedDB)
// ============================================================

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { EnregistrementTableTokens, CarteTokensChiffree } from './types';

const NOM_BDD = 'pii-privacy';
const VERSION_BDD = 1;
const NOM_STORE = 'table-tokens' as const;

interface PIIPrivacyDB extends DBSchema {
  'table-tokens': {
    key: string;
    value: EnregistrementTableTokens;
  };
}

async function ouvrirBaseDeDonnees(): Promise<IDBPDatabase<PIIPrivacyDB>> {
  return openDB<PIIPrivacyDB>(NOM_BDD, VERSION_BDD, {
    upgrade(db) {
      db.createObjectStore(NOM_STORE, { keyPath: 'documentId' });
    },
  });
}

export async function sauvegarderTableTokens(
  documentId: string,
  chiffre: CarteTokensChiffree
): Promise<void> {
  const db = await ouvrirBaseDeDonnees();
  await db.put(NOM_STORE, {
    documentId,
    texteCiphere: chiffre.texteCiphere,
    iv: chiffre.iv,
    sel: chiffre.sel,
    creeA: new Date(),
  });
}

export async function chargerTableTokens(
  documentId: string
): Promise<EnregistrementTableTokens | undefined> {
  const db = await ouvrirBaseDeDonnees();
  return db.get(NOM_STORE, documentId);
}

export async function supprimerTableTokens(documentId: string): Promise<void> {
  const db = await ouvrirBaseDeDonnees();
  await db.delete(NOM_STORE, documentId);
}

export async function viderToutesLesTableTokens(): Promise<void> {
  const db = await ouvrirBaseDeDonnees();
  await db.clear(NOM_STORE);
}
