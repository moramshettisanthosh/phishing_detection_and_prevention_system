export interface PhishingFeature {
  name: string;
  value: string | number;
  description: string;
  status: 'safe' | 'warning' | 'danger';
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  confusionMatrix: [[number, number], [number, number]]; // [TN, FP], [FN, TP]
  rocCurve: { fpr: number; tpr: number }[];
}

export interface MLComparison {
  'Random Forest': ModelMetrics;
  'XGBoost': ModelMetrics;
  'Decision Tree': ModelMetrics;
  'Logistic Regression': ModelMetrics;
  'Support Vector Machine': ModelMetrics;
}

export interface URLScanResult {
  id: string;
  url: string;
  timestamp: string;
  classification: 'safe' | 'suspicious' | 'phishing';
  riskScore: number; // 0-100
  probability: number; // percentage
  features: PhishingFeature[];
  bestModel: string;
  aiReport: string;
  modelComparison: MLComparison;
}

export interface EmailScanResult {
  id: string;
  subject: string;
  sender: string;
  body: string;
  timestamp: string;
  classification: 'safe' | 'suspicious' | 'phishing';
  riskScore: number;
  probability: number;
  detectedIndicators: string[];
  fullReport: string;
}

export interface QRScanResult {
  id: string;
  imageUrl: string;
  timestamp: string;
  extractedUrl: string;
  urlAnalysis: URLScanResult | null;
  error?: string;
}

export interface ScreenshotScanResult {
  id: string;
  imageUrl: string;
  timestamp: string;
  extractedText: string;
  classification: 'safe' | 'suspicious' | 'phishing';
  riskScore: number;
  detectedBrand?: string;
  aiReport: string;
}

export interface SecBotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  username: string;
  status: string;
}
