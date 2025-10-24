/**
 * Centralized logging utility for ClevrSend
 * Provides consistent, colorful console logging across the app
 */

export enum LogCategory {
  APP = 'APP',
  UI = 'UI',
  QR = 'QR',
  WEBRTC = 'WEBRTC',
  SIGNALING = 'SIGNALING',
  FILE = 'FILE',
  ERROR = 'ERROR',
}

const categoryColors: Record<LogCategory, string> = {
  [LogCategory.APP]: '#00ff88',
  [LogCategory.UI]: '#00ccff',
  [LogCategory.QR]: '#ff00ff',
  [LogCategory.WEBRTC]: '#ffaa00',
  [LogCategory.SIGNALING]: '#aa00ff',
  [LogCategory.FILE]: '#00ffaa',
  [LogCategory.ERROR]: '#ff0000',
};

const categoryIcons: Record<LogCategory, string> = {
  [LogCategory.APP]: '🚀',
  [LogCategory.UI]: '🖱️',
  [LogCategory.QR]: '📱',
  [LogCategory.WEBRTC]: '🔌',
  [LogCategory.SIGNALING]: '📡',
  [LogCategory.FILE]: '📁',
  [LogCategory.ERROR]: '❌',
};

/**
 * Log a message with category, color, and icon
 */
export function log(category: LogCategory, message: string, ...args: any[]) {
  const color = categoryColors[category];
  const icon = categoryIcons[category];
  const timestamp = new Date().toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });

  console.log(
    `%c${icon} [${category}]%c ${timestamp} ${message}`,
    `color: ${color}; font-weight: bold;`,
    'color: inherit;',
    ...args
  );
}

/**
 * Log user interactions (clicks, inputs, etc.)
 */
export function logInteraction(action: string, target: string, details?: any) {
  log(
    LogCategory.UI,
    `👆 ${action}: ${target}`,
    details || ''
  );
}

/**
 * Log QR-Connect specific events
 */
export function logQR(event: string, details?: any) {
  log(LogCategory.QR, event, details || '');
}

/**
 * Log WebRTC connection events
 */
export function logWebRTC(event: string, details?: any) {
  log(LogCategory.WEBRTC, event, details || '');
}

/**
 * Log signaling events
 */
export function logSignaling(event: string, details?: any) {
  log(LogCategory.SIGNALING, event, details || '');
}

/**
 * Log file transfer events
 */
export function logFile(event: string, details?: any) {
  log(LogCategory.FILE, event, details || '');
}

/**
 * Log errors with full stack trace
 */
export function logError(error: Error | string, context?: string) {
  const message = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : '';

  log(
    LogCategory.ERROR,
    context ? `${context}: ${message}` : message,
    stack ? `\n${stack}` : ''
  );
}

/**
 * Log app lifecycle events
 */
export function logApp(event: string, details?: any) {
  log(LogCategory.APP, event, details || '');
}
