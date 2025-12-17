export interface SplitPdfPage {
  path: string;
  buffer: Buffer;
  pageNumber: number;
}

export interface LabelMetadata {
  reference: string | null;
  fedexTracking: string | null;
}

export interface PersistLabelInput {
  pdfPath: string;
  metadata: LabelMetadata;
}