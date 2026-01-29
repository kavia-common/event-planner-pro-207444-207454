import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { EventDetail, EventSummary, EventUpsertRequest } from '../models/event.models';

/**
 * NOTE:
 * The downloaded backend OpenAPI spec currently only exposes a health check route.
 * These endpoints are implemented according to the work-item contract and are expected
 * to exist in the FastAPI backend container.
 */
@Injectable({ providedIn: 'root' })
export class EventsService {
  constructor(private readonly api: ApiClientService) {}

  // PUBLIC_INTERFACE
  listEvents(): Observable<EventSummary[]> {
    /** List all events. */
    return this.api.get<EventSummary[]>('/events');
  }

  // PUBLIC_INTERFACE
  getEvent(id: string): Observable<EventDetail> {
    /** Get event details by id. */
    return this.api.get<EventDetail>(`/events/${encodeURIComponent(id)}`);
  }

  // PUBLIC_INTERFACE
  createEvent(payload: EventUpsertRequest): Observable<EventDetail> {
    /** Create a new event. */
    return this.api.post<EventDetail>('/events', payload);
  }

  // PUBLIC_INTERFACE
  updateEvent(id: string, payload: EventUpsertRequest): Observable<EventDetail> {
    /** Update an existing event. */
    return this.api.put<EventDetail>(`/events/${encodeURIComponent(id)}`, payload);
  }

  // PUBLIC_INTERFACE
  deleteEvent(id: string): Observable<void> {
    /** Delete an event. */
    return this.api.delete<void>(`/events/${encodeURIComponent(id)}`);
  }
}
