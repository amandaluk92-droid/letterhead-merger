import { Document, Paragraph } from 'docx';

export interface FormattingOptions {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  characterSpacing?: number;
  textAlignment?: 'left' | 'center' | 'right' | 'justify';
  lineSpacing?: number;
  paragraphSpacing?: {
    before?: number;
    after?: number;
  };
  scaling?: number;
}

export interface DocumentFile {
  file: File;
  name: string;
  size: number;
}

export interface MergedDocument {
  name: string;
  blob: Blob;
  document: Document;
}

export interface MergeProgress {
  current: number;
  total: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
  message?: string;
}

export interface ExtractedImage {
  src: string; // base64 data URI
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  base64Data?: string; // Just the base64 part without data URI prefix
}

export interface ParsedDocument {
  paragraphs: Paragraph[];
  sections: any[];
  images?: ExtractedImage[];
  metadata?: {
    creator?: string;
    title?: string;
    description?: string;
  };
}


