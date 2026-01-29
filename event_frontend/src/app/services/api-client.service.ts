import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class ApiClientService {
  /** Lightweight REST client with baseUrl + basic helpers. */
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

  private url(path: string): string {
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${p}`;
  }

  // PUBLIC_INTERFACE
  get<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
    /** HTTP GET with optional query params. */
    let params = new HttpParams();
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null) continue;
        params = params.set(k, String(v));
      }
    }
    return this.http.get<T>(this.url(path), { params });
  }

  // PUBLIC_INTERFACE
  post<T>(path: string, body: unknown) {
    /** HTTP POST. */
    return this.http.post<T>(this.url(path), body);
  }

  // PUBLIC_INTERFACE
  put<T>(path: string, body: unknown) {
    /** HTTP PUT. */
    return this.http.put<T>(this.url(path), body);
  }

  // PUBLIC_INTERFACE
  patch<T>(path: string, body: unknown) {
    /** HTTP PATCH. */
    return this.http.patch<T>(this.url(path), body);
  }

  // PUBLIC_INTERFACE
  delete<T>(path: string) {
    /** HTTP DELETE. */
    return this.http.delete<T>(this.url(path));
  }
}
