import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { RSVP, RSVPUpsertRequest } from '../models/event.models';

@Injectable({ providedIn: 'root' })
export class RsvpsService {
  constructor(private readonly api: ApiClientService) {}

  // PUBLIC_INTERFACE
  listForEvent(eventId: string): Observable<RSVP[]> {
    /** List RSVPs for a given event. */
    return this.api.get<RSVP[]>(`/events/${encodeURIComponent(eventId)}/rsvps`);
  }

  // PUBLIC_INTERFACE
  createForEvent(eventId: string, payload: RSVPUpsertRequest): Observable<RSVP> {
    /** Create RSVP for event. */
    return this.api.post<RSVP>(`/events/${encodeURIComponent(eventId)}/rsvps`, payload);
  }

  // PUBLIC_INTERFACE
  update(eventId: string, rsvpId: string, payload: RSVPUpsertRequest): Observable<RSVP> {
    /** Update RSVP for event. */
    return this.api.put<RSVP>(
      `/events/${encodeURIComponent(eventId)}/rsvps/${encodeURIComponent(rsvpId)}`,
      payload,
    );
  }

  // PUBLIC_INTERFACE
  delete(eventId: string, rsvpId: string): Observable<void> {
    /** Delete RSVP for event. */
    return this.api.delete<void>(
      `/events/${encodeURIComponent(eventId)}/rsvps/${encodeURIComponent(rsvpId)}`,
    );
  }
}
