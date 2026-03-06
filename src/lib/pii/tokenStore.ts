/**
 * Token Store — persists PII token mappings in IndexedDB.
 * Each document gets its own token map so originals can be restored
 * only by authorised users on the same device.
 */

const DB_NAME = "lumina_pii_tokens";
const DB_VERSION = 1;
const STORE_NAME = "token_maps";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "documentId" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export interface StoredTokenMap {
  documentId: string;
  tokenMap: Record<string, string>; // token → original
  createdAt: number;
}

/** Save a token map for a document */
export async function saveTokenMap(
  documentId: string,
  tokenMap: Map<string, string>
): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const entry: StoredTokenMap = {
    documentId,
    tokenMap: Object.fromEntries(tokenMap),
    createdAt: Date.now(),
  };
  store.put(entry);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Retrieve a token map for a document */
export async function getTokenMap(
  documentId: string
): Promise<Map<string, string> | null> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const req = store.get(documentId);
  return new Promise((resolve, reject) => {
    req.onsuccess = () => {
      const entry = req.result as StoredTokenMap | undefined;
      if (entry) {
        resolve(new Map(Object.entries(entry.tokenMap)));
      } else {
        resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

/** Delete a token map */
export async function deleteTokenMap(documentId: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(documentId);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Restore original text from anonymized text using stored tokens */
export function deanonymize(
  anonymizedText: string,
  tokenMap: Map<string, string>
): string {
  let text = anonymizedText;
  for (const [token, original] of tokenMap) {
    text = text.replaceAll(token, original);
  }
  return text;
}
