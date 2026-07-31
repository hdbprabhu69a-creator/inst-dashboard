export interface DownloadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  reportDate?: string;
  fileSize?: number;
  downloadedAt?: Date;
  attempts: number;
  durationMs: number;
  message?: string;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  fileName: string;
  fileSize: number;
  headers?: string[];
  tradeDate?: string;
}

export interface RetryPolicy {
  enabled: boolean;
  maxAttempts: number;
  schedule: string[];
}

export interface BrowserOptions {
  headless: boolean;
  timeout: number;
  downloadPath: string;
}

export interface FailureArtifacts {
  screenshot?: string;
  html?: string;
  trace?: string;
  networkLog?: string;
}

export interface ReportInfo {
  name: string;
  expectedPattern: RegExp;
  downloadUrl?: string;
  tradeDate?: string;
}

export interface DownloadSession {
  startedAt: Date;
  completedAt?: Date;
  attempts: number;
  browserLaunched: boolean;
  reportFound: boolean;
}

