/**
 * PII Detection Pipeline using Transformers.js (NER)
 * Runs entirely in the browser — no data leaves the client.
 */

import { pipeline, type TokenClassificationPipeline } from "@huggingface/transformers";

export interface PIIEntity {
  entity: string;       // e.g. "PER", "ORG", "LOC", "MISC"
  score: number;
  word: string;
  start: number;
  end: number;
  index: number;
}

export type PIICategory = "PER" | "ORG" | "LOC" | "MISC";

const CATEGORY_LABELS: Record<PIICategory, string> = {
  PER: "Personne",
  ORG: "Organisation",
  LOC: "Lieu",
  MISC: "Divers",
};

let nerPipeline: TokenClassificationPipeline | null = null;
let loadingPromise: Promise<TokenClassificationPipeline> | null = null;

/**
 * Load the NER model (cached after first call).
 * Uses a small multilingual model suitable for browser inference.
 */
export async function loadNERModel(
  onProgress?: (progress: number) => void
): Promise<TokenClassificationPipeline> {
  if (nerPipeline) return nerPipeline;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (pipeline as any)("token-classification", "Xenova/bert-base-NER", {
    dtype: "q8",
    progress_callback: (data: any) => {
      if (data.status === "progress" && onProgress) {
        onProgress(Math.round(data.progress));
      }
    },
  }) as Promise<TokenClassificationPipeline>;

  nerPipeline = await loadingPromise;
  loadingPromise = null;
  return nerPipeline;
}

/** Normalise BIO tags to plain categories */
function normalizeEntityTag(tag: string): PIICategory {
  const clean = tag.replace(/^[BI]-/, "");
  if (["PER", "ORG", "LOC", "MISC"].includes(clean)) return clean as PIICategory;
  return "MISC";
}

/** Merge sub-word tokens produced by the NER model into full entities */
function mergeSubwords(raw: PIIEntity[]): PIIEntity[] {
  const merged: PIIEntity[] = [];
  for (const token of raw) {
    const cat = normalizeEntityTag(token.entity);
    const last = merged[merged.length - 1];

    if (last && normalizeEntityTag(last.entity) === cat && token.start === last.end) {
      // continuation — extend last entity
      last.word += token.word.replace(/^##/, "");
      last.end = token.end;
      last.score = Math.min(last.score, token.score);
    } else {
      merged.push({ ...token, entity: cat, word: token.word.replace(/^##/, "") });
    }
  }
  return merged;
}

export interface DetectionResult {
  entities: PIIEntity[];
  anonymizedText: string;
  tokenMap: Map<string, string>; // token → original value
}

const CONFIDENCE_THRESHOLD = 0.75;

/**
 * Detect PII entities in text and return anonymized version + token map.
 */
export async function detectPII(
  text: string,
  onProgress?: (progress: number) => void
): Promise<DetectionResult> {
  const model = await loadNERModel(onProgress);
  const raw = (await model(text, { ignore_labels: [] })) as unknown as PIIEntity[];

  const entities = mergeSubwords(raw).filter((e) => e.score >= CONFIDENCE_THRESHOLD);

  const tokenMap = new Map<string, string>();
  let anonymizedText = text;
  let offset = 0;

  // Sort by position (start) to replace from beginning
  const sorted = [...entities].sort((a, b) => a.start - b.start);

  for (const entity of sorted) {
    const cat = normalizeEntityTag(entity.entity);
    const tokenId = `[${cat}_${tokenMap.size + 1}]`;
    tokenMap.set(tokenId, entity.word);

    const adjustedStart = entity.start + offset;
    const adjustedEnd = entity.end + offset;
    anonymizedText =
      anonymizedText.slice(0, adjustedStart) +
      tokenId +
      anonymizedText.slice(adjustedEnd);
    offset += tokenId.length - (entity.end - entity.start);
  }

  return { entities, anonymizedText, tokenMap };
}

export function getCategoryLabel(cat: PIICategory): string {
  return CATEGORY_LABELS[cat] || cat;
}

export function isModelLoaded(): boolean {
  return nerPipeline !== null;
}
