import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { EventSummary } from '../../models/event.models';
import { toUserMessage } from '../../shared/http-error';

type CalendarMode = 'month' | 'week' | 'day';

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function isoKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink, SlicePipe],
  templateUrl: './calendar-page.component.html',
})
export class CalendarPageComponent implements OnInit {
  mode: CalendarMode = 'month';
  anchor = startOfDay(new Date());

  loading = false;
  error: string | null = null;
  events: EventSummary[] = [];

  constructor(private readonly eventsApi: EventsService) {}

  ngOnInit(): void {
    this.refresh();
  }

  // PUBLIC_INTERFACE
  setMode(m: CalendarMode): void {
    /** Set calendar view mode. */
    this.mode = m;
  }

  // PUBLIC_INTERFACE
  today(): void {
    /** Jump to today. */
    this.anchor = startOfDay(new Date());
  }

  // PUBLIC_INTERFACE
  prev(): void {
    /** Move view backward. */
    if (this.mode === 'month') this.anchor = new Date(this.anchor.getFullYear(), this.anchor.getMonth() - 1, 1);
    else if (this.mode === 'week') this.anchor = addDays(this.anchor, -7);
    else this.anchor = addDays(this.anchor, -1);
  }

  // PUBLIC_INTERFACE
  next(): void {
    /** Move view forward. */
    if (this.mode === 'month') this.anchor = new Date(this.anchor.getFullYear(), this.anchor.getMonth() + 1, 1);
    else if (this.mode === 'week') this.anchor = addDays(this.anchor, 7);
    else this.anchor = addDays(this.anchor, 1);
  }

  // PUBLIC_INTERFACE
  refresh(): void {
    /** Reload events used to render the calendar. */
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

  get title(): string {
    if (this.mode === 'month') return this.anchor.toLocaleString(undefined, { month: 'long', year: 'numeric' });
    if (this.mode === 'week') {
      const s = this.weekStart;
      const e = addDays(s, 6);
      return `${s.toLocaleDateString()} → ${e.toLocaleDateString()}`;
    }
    return this.anchor.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  get weekStart(): Date {
    const d = startOfDay(this.anchor);
    const day = d.getDay(); // 0=Sun
    return addDays(d, -day);
  }

  get monthGridDays(): Date[] {
    const first = new Date(this.anchor.getFullYear(), this.anchor.getMonth(), 1);
    const start = addDays(first, -first.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) days.push(addDays(start, i));
    return days;
  }

  get weekDays(): Date[] {
    const s = this.weekStart;
    return Array.from({ length: 7 }, (_, i) => addDays(s, i));
  }

  eventsForDay(d: Date): EventSummary[] {
    const key = isoKey(d);
    return this.events
      .filter((e) => {
        const sd = isoKey(new Date(e.start_at));
        return sd === key;
      })
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  }
}
