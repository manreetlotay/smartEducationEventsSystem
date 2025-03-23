// Relation between a user and an event
export interface Ticket {
  ticketId: string;
  userId: string;
  eventId: string;
  role: USER_ROLE;
  accessCode?: string; //for virtual event
  virtualLink?: string;
  qrCode?: string; //for inPerson event
  registrationDate: Date;
  isBonusTicket: Boolean; // free ticket for the bonus feature (redeem points)
}

export enum USER_ROLE {
  ORGANIZER = "organizer",
  ATTENDEE = "attendee",
  SPEAKER = "speaker",
  SPONSOR = "sponsor",
  STAKEHOLDER = "stakeholder",
  EVENT_ADMIN = "eventAdmin",
}
