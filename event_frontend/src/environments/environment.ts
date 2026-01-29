/**
 * Runtime environment configuration.
 *
 * Resolution order for API base URL:
 *  1) window.__RUNTIME_CONFIG__.NG_APP_API_BASE (runtime, no rebuild required)
 *  2) process.env.NG_APP_API_BASE (SSR/build-time injection depending on platform)
 *  3) default for preview/dev: http://localhost:3001
 *
 * IMPORTANT:
 * - For same-origin reverse proxy setups, set NG_APP_API_BASE="/api"
 *   (either via runtime-config.js or environment injection).
 */
function getApiBaseUrl(): string {
  const runtime = (globalThis as any)?.__RUNTIME_CONFIG__?.NG_APP_API_BASE;
  if (typeof runtime === 'string' && runtime.trim().length > 0) return runtime.trim();

  const injected = (globalThis as any)?.process?.env?.['NG_APP_API_BASE'];
  if (typeof injected === 'string' && injected.trim().length > 0) return injected.trim();

  // Preview/dev default (requested): target the FastAPI backend on port 3001.
  return 'http://localhost:3001';
}

export const environment = {
  production: false,
  /**
   * Base URL for the backend REST API.
   */
  apiBaseUrl: getApiBaseUrl(),
};
