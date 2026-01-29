import { HttpErrorResponse } from '@angular/common/http';

function isLikelyHtml(body: unknown): boolean {
  if (typeof body !== 'string') return false;
  const s = body.trim().toLowerCase();
  return s.startsWith('<!doctype html') || s.startsWith('<html') || s.includes('<head') || s.includes('<body');
}

// PUBLIC_INTERFACE
export function toUserMessage(err: unknown): string {
  /** Convert HTTP/unknown errors into a safe message for UI. */
  if (err instanceof HttpErrorResponse) {
    // Angular can surface status 200 as an HttpErrorResponse when JSON parsing fails.
    // This commonly happens when the request hit the frontend server (HTML) instead of the API.
    if (err.status === 200) {
      const raw = err.error;
      if (isLikelyHtml(raw)) {
        return 'API response was HTML instead of JSON. Check API base URL (/api proxy) and backend routing.';
      }
      // Also handle Angular's "Http failure during parsing" message
      if (typeof err.message === 'string' && err.message.toLowerCase().includes('parsing')) {
        return 'API response could not be parsed. Check API base URL and that the backend returns JSON.';
      }
    }

    if (typeof err.error === 'string' && err.error.trim().length > 0) return err.error;
    if ((err.error as any)?.detail) return String((err.error as any).detail);
    if (err.status === 0) return 'Network error. Please check your connection.';
    return `Request failed (${err.status}). Please try again.`;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong. Please try again.';
}
