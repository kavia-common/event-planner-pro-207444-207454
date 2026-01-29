import { HttpErrorResponse } from '@angular/common/http';

// PUBLIC_INTERFACE
export function toUserMessage(err: unknown): string {
  /** Convert HTTP/unknown errors into a safe message for UI. */
  if (err instanceof HttpErrorResponse) {
    if (typeof err.error === 'string' && err.error.trim().length > 0) return err.error;
    if (err.error?.detail) return String(err.error.detail);
    if (err.status === 0) return 'Network error. Please check your connection.';
    return `Request failed (${err.status}). Please try again.`;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong. Please try again.';
}
