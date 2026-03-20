export type CaptureType = 'text' | 'url' | 'image';

export interface CapturePayload {
  type: CaptureType;
  content: string;
  tags: string[];
  note?: string;
}

export interface ScrapedMetadata {
  title?: string;
  description?: string;
  image?: string;
  url: string;
}

export interface FormattedPayload {
  id: string;
  timestamp: string;
  originalType: CaptureType;
  content: string;
  tags: string[];
  note?: string;
  metadata?: ScrapedMetadata;
  imageUrl?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
