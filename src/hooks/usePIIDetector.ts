import { useState, useCallback, useRef } from "react";
import { detectPII, loadNERModel, isModelLoaded, type DetectionResult, type PIIEntity } from "@/lib/pii/piiDetector";
import { saveTokenMap } from "@/lib/pii/tokenStore";

interface UsePIIDetectorReturn {
  detect: (text: string, documentId?: string) => Promise<DetectionResult>;
  isLoading: boolean;
  modelReady: boolean;
  loadProgress: number;
  lastResult: DetectionResult | null;
  preloadModel: () => Promise<void>;
}

export function usePIIDetector(): UsePIIDetectorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [modelReady, setModelReady] = useState(isModelLoaded());
  const [loadProgress, setLoadProgress] = useState(0);
  const [lastResult, setLastResult] = useState<DetectionResult | null>(null);

  const preloadModel = useCallback(async () => {
    if (isModelLoaded()) { setModelReady(true); return; }
    setIsLoading(true);
    try {
      await loadNERModel((p) => setLoadProgress(p));
      setModelReady(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const detect = useCallback(async (text: string, documentId?: string) => {
    setIsLoading(true);
    try {
      const result = await detectPII(text, (p) => setLoadProgress(p));
      setLastResult(result);
      setModelReady(true);

      if (documentId && result.tokenMap.size > 0) {
        await saveTokenMap(documentId, result.tokenMap);
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { detect, isLoading, modelReady, loadProgress, lastResult, preloadModel };
}
