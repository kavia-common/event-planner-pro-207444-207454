/**
 * Runtime configuration injected at request/runtime time (no rebuild required).
 *
 * How it works:
 * - The app reads `window.__RUNTIME_CONFIG__.NG_APP_API_BASE` first.
 * - This file can be replaced/rewritten by the hosting environment (container/platform)
 *   to change API target without rebuilding the Angular bundle.
 *
 * Defaults:
 * - If not overridden, we default to http://localhost:3001 for preview/dev convenience.
 *
 * Notes:
 * - If you prefer same-origin reverse proxy, set this to "/api".
 */
(function () {
  // You can override this file at runtime if your platform supports it.
  // For local preview, we default to the FastAPI backend on port 3001.
  window.__RUNTIME_CONFIG__ = window.__RUNTIME_CONFIG__ || {};
  window.__RUNTIME_CONFIG__.NG_APP_API_BASE =
    window.__RUNTIME_CONFIG__.NG_APP_API_BASE || "http://localhost:3001";
})();
