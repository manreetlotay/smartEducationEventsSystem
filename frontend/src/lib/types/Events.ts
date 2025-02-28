export interface EventPreview {
  title: string;
  startDateTime: string; // ISO 8601 format
  endDateTime: string; // ISO 8601 format
  format: eventFormat;
  imageSrc: string;
}

export enum eventFormat {
  ONLINE = "online",
  PERSON = "in-person",
  HYBRID = "hybrid",
}

export interface Event extends Agenda {
  eventId: string;
  imageSrc: string;
  location?: string;
  virtualMeetingUrl?: string;
  fee: "paid";
  speakers: string;
  tags: string[];
  organizedBy: string;
  sponsoredBy: string;
  price: string;
}

export interface Agenda {
  title: string;
  startDateTime: string; // ISO 8601 format
  endDateTime: string; // ISO 8601 format
  description: string;
  type: string;
}
