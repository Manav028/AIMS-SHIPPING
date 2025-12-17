export interface LabelMetadata {
  reference: string | null;
  fedexTracking: string | null;
}

export function parseMetadata(text: string): LabelMetadata {
  const fedexMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
  const refMatch = [...text.matchAll(/REF[\s:\uFF1A-]*([0-9A-Za-z]+)/gi)];

  return {
    fedexTracking: fedexMatch ? fedexMatch[0] : null,
    reference: refMatch.length ? refMatch[0][1] : null
  };
}
