import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { EventDetail, EventUpsertRequest } from '../../models/event.models';
import { toUserMessage } from '../../shared/http-error';

function toLocalInputValue(iso: string): string {
  // Convert ISO string to "YYYY-MM-DDTHH:mm" (local) for datetime-local inputs.
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

function fromLocalInputValue(v: string): string {
  // Browser gives local time; convert to ISO.
  return new Date(v).toISOString();
}

@Component({
  selector: 'app-event-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './event-form-page.component.html',
})
export class EventFormPageComponent implements OnInit {
  loading = false;
  saving = false;
  error: string | null = null;

  eventId: string | null = null;
  existing: EventDetail | null = null;

  form = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>(''),
    location: new FormControl<string>(''),
    start_at: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    end_at: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventsApi: EventsService,
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (!this.eventId) return;

    this.loading = true;
    this.eventsApi
      .getEvent(this.eventId)
      .pipe(
        catchError((e) => {
          this.error = toUserMessage(e);
          return of(null);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe((evt) => {
        if (!evt) return;
        this.existing = evt;
        this.form.patchValue({
          title: evt.title,
          description: evt.description ?? '',
          location: evt.location ?? '',
          start_at: toLocalInputValue(evt.start_at),
          end_at: toLocalInputValue(evt.end_at),
        });
      });
  }

  get isEdit(): boolean {
    return !!this.eventId;
  }

  // PUBLIC_INTERFACE
  save(): void {
    /** Create or update the event based on presence of :id. */
    this.error = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Please fix the highlighted fields.';
      return;
    }

    const raw = this.form.getRawValue();
    const payload: EventUpsertRequest = {
      title: raw.title,
      description: raw.description?.trim() || null,
      location: raw.location?.trim() || null,
      start_at: fromLocalInputValue(raw.start_at),
      end_at: fromLocalInputValue(raw.end_at),
    };

    if (new Date(payload.end_at).getTime() <= new Date(payload.start_at).getTime()) {
      this.error = 'End time must be after start time.';
      return;
    }

    this.saving = true;

    const request$ = this.eventId
      ? this.eventsApi.updateEvent(this.eventId, payload)
      : this.eventsApi.createEvent(payload);

    request$
      .pipe(
        catchError((e) => {
          this.error = toUserMessage(e);
          return of(null);
        }),
        finalize(() => (this.saving = false)),
        switchMap((evt) => {
          if (!evt) return of(null);
          return this.router.navigate(['/events', evt.id]);
        }),
      )
      .subscribe();
  }
}
