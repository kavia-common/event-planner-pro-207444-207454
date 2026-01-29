/**
 * Production runtime environment configuration.
 *
 * Resolution order for API base URL:
 *  1) window.__RUNTIME_CONFIG__.NG_APP_API_BASE (runtime, no rebuild required)
 *  2) process.env.NG_APP_API_BASE (SSR/build-time injection depending on platform)
 *  3) production default: /api (typical reverse-proxy)
 */
function getApiBaseUrl(): string {
  const runtime = (globalThis as any)?.__RUNTIME_CONFIG__?.NG_APP_API_BASE;
  if (typeof runtime === 'string' && runtime.trim().length > 0) return runtime.trim();

  const injected = (globalThis as any)?.process?.env?.['NG_APP_API_BASE'];
  if (typeof injected === 'string' && injected.trim().length > 0) return injected.trim();

  return '/api';
}

export const environment = {
  production: true,
  /**
   * Base URL for the backend REST API.
   */
  apiBaseUrl: getApiBaseUrl(),
};
