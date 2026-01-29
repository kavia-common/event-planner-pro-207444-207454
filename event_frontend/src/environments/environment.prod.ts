/**
 * Production runtime environment configuration.
 *
 * In production you typically reverse-proxy the backend to `/api`, but we still allow
 * overriding via NG_APP_API_BASE for deployments where the backend is on a separate origin.
 */
export const environment = {
  production: true,
  /**
   * Base URL for the backend REST API.
   */
  apiBaseUrl: (globalThis as any)?.process?.env?.['NG_APP_API_BASE'] || '/api',
};
