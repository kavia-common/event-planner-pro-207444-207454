export type ISODateTimeString = string;

export interface EventSummary {
  id: string;
  title: string;
  start_at: ISODateTimeString;
  end_at: ISODateTimeString;
  location?: string | null;
}

export interface EventDetail extends EventSummary {
  description?: string | null;
  created_at?: ISODateTimeString;
  updated_at?: ISODateTimeString;
}

export interface EventUpsertRequest {
  title: string;
  description?: string | null;
  start_at: ISODateTimeString;
  end_at: ISODateTimeString;
  location?: string | null;
}

export type RSVPStatus = 'going' | 'maybe' | 'not_going';

export interface RSVP {
  id: string;
  event_id: string;
  attendee_name: string;
  attendee_email?: string | null;
  status: RSVPStatus;
  created_at?: ISODateTimeString;
}

export interface RSVPUpsertRequest {
  attendee_name: string;
  attendee_email?: string | null;
  status: RSVPStatus;
}
