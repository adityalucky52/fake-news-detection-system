export type PredictionLabel = 'REAL' | 'FAKE' | 'MISLEADING';

export interface PredictionResult {
  id: string;
  label: PredictionLabel;
  confidence: number;
  explanation?: string;
  createdAt: string;
}

export interface RecentScan {
  id: string;
  text_preview: string;
  label: PredictionLabel;
  confidence: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}
