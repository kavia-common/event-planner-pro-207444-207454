import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { RsvpsService } from '../../services/rsvps.service';
import { EventDetail, RSVP, RSVPStatus, RSVPUpsertRequest } from '../../models/event.models';
import { toUserMessage } from '../../shared/http-error';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './event-detail-page.component.html',
})
export class EventDetailPageComponent implements OnInit {
  loading = false;
  error: string | null = null;

  eventId!: string;
  event: EventDetail | null = null;

  rsvps: RSVP[] = [];
  rsvpLoading = false;
  rsvpError: string | null = null;

  editingRsvpId: string | null = null;

  rsvpForm = new FormGroup({
    attendee_name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    attendee_email: new FormControl<string>(''),
    status: new FormControl<RSVPStatus>('going', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventsApi: EventsService,
    private readonly rsvpsApi: RsvpsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/events']);
      return;
    }
    this.eventId = id;
    this.refresh();
  }

  // PUBLIC_INTERFACE
  refresh(): void {
    /** Reload event details and RSVPs. */
    this.loading = true;
    this.error = null;

    forkJoin({
      event: this.eventsApi.getEvent(this.eventId),
      rsvps: this.rsvpsApi.listForEvent(this.eventId),
    })
      .pipe(
        catchError((e) => {
          this.error = toUserMessage(e);
          return of({ event: null, rsvps: [] as RSVP[] });
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe((data) => {
        this.event = data.event;
        this.rsvps = data.rsvps ?? [];
      });
  }

  // PUBLIC_INTERFACE
  startEdit(r: RSVP): void {
    /** Begin editing an existing RSVP. */
    this.editingRsvpId = r.id;
    this.rsvpForm.patchValue({
      attendee_name: r.attendee_name,
      attendee_email: r.attendee_email ?? '',
      status: r.status,
    });
  }

  // PUBLIC_INTERFACE
  cancelEdit(): void {
    /** Cancel RSVP editing and reset form. */
    this.editingRsvpId = null;
    this.rsvpForm.reset({ attendee_name: '', attendee_email: '', status: 'going' });
    this.rsvpError = null;
  }

  // PUBLIC_INTERFACE
  submitRsvp(): void {
    /** Create or update RSVP. */
    this.rsvpError = null;

    if (this.rsvpForm.invalid) {
      this.rsvpForm.markAllAsTouched();
      this.rsvpError = 'Please fill attendee name and status.';
      return;
    }

    const raw = this.rsvpForm.getRawValue();
    const payload: RSVPUpsertRequest = {
      attendee_name: raw.attendee_name,
      attendee_email: raw.attendee_email?.trim() || null,
      status: raw.status,
    };

    this.rsvpLoading = true;
    const req$ = this.editingRsvpId
      ? this.rsvpsApi.update(this.eventId, this.editingRsvpId, payload)
      : this.rsvpsApi.createForEvent(this.eventId, payload);

    req$
      .pipe(
        catchError((e) => {
          this.rsvpError = toUserMessage(e);
          return of(null);
        }),
        finalize(() => (this.rsvpLoading = false)),
      )
      .subscribe((saved) => {
        if (!saved) return;

        // Refresh the list for correctness
        this.rsvpsApi
          .listForEvent(this.eventId)
          .pipe(catchError(() => of([] as RSVP[])))
          .subscribe((list) => (this.rsvps = list));

        this.cancelEdit();
      });
  }

  // PUBLIC_INTERFACE
  deleteRsvp(r: RSVP): void {
    /** Delete an RSVP. */
    if (!globalThis.confirm(`Delete RSVP for "${r.attendee_name}"?`)) return;

    this.rsvpLoading = true;
    this.rsvpsApi
      .delete(this.eventId, r.id)
      .pipe(
        catchError((e) => {
          this.rsvpError = toUserMessage(e);
          return of(null);
        }),
        finalize(() => (this.rsvpLoading = false)),
      )
      .subscribe(() => {
        this.rsvps = this.rsvps.filter((x) => x.id !== r.id);
      });
  }

  statusLabel(s: RSVPStatus): string {
    switch (s) {
      case 'going':
        return 'Going';
      case 'maybe':
        return 'Maybe';
      case 'not_going':
        return 'Not going';
    }
  }
}
