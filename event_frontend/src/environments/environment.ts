/**
 * Runtime environment configuration.
 *
 * Angular replaces `process.env` at build time when using Vite/SSR toolchains;
 * in our deployment, the container also injects NG_APP_* variables.
 */
export const environment = {
  production: false,
  /**
   * Base URL for the backend REST API.
   *
   * In Kavia environments, NG_APP_API_BASE is set (see `.env`) to the backend origin
   * (e.g. https://...:3001). Fall back to same-origin `/api` for traditional reverse-proxy setups.
   */
  apiBaseUrl: (globalThis as any)?.process?.env?.['NG_APP_API_BASE'] || '/api',
};
