import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { EventSummary } from '../../models/event.models';
import { toUserMessage } from '../../shared/http-error';

@Component({
  selector: 'app-event-list-page',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, DatePipe],
  templateUrl: './event-list-page.component.html',
})
export class EventListPageComponent implements OnInit {
  loading = false;
  error: string | null = null;
  events: EventSummary[] = [];

  constructor(private readonly eventsApi: EventsService) {}

  ngOnInit(): void {
    this.refresh();
  }

  // PUBLIC_INTERFACE
  refresh(): void {
    /** Reload the event list. */
    this.loading = true;
    this.error = null;

    this.eventsApi
      .listEvents()
      .pipe(
        catchError((e) => {
          this.error = toUserMessage(e);
          return of([] as EventSummary[]);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe((data) => (this.events = data ?? []));
  }
}
