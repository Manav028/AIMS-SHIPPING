import { LabelMetadata } from "../types/ingestion.types";

export function parseMetadata(text: string): LabelMetadata {
  const fedexMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);

  const refMatches = [...text.matchAll(
    /REF[\s:\uFF1A-]*([0-9A-Za-z]+)/gi
  )];

  return {
    fedexTracking: fedexMatch?.[0] ?? null,
    reference: refMatches.length ? refMatches[0][1] : null,
  };
}
