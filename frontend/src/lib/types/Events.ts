import { User } from "./User";

export enum EVENT_FORMAT {
  ONLINE = "online",
  PERSON = "in-person",
  HYBRID = "hybrid",
}

export interface Event {
  id: string;
  name: string;
  description: string;
  format: EVENT_FORMAT;
  tags: string[];
  bannerImage: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  registrationDeadline?: Date;
  address?: string;
  virtualPlatformLink?: string;
  isFree: boolean;
  price?: number;
  agenda: String; // Who speaks and the order + time they speak in

  //Have them here for simplicity, but also have them in UserEvent table
  organizers: User[];
  sponsors: User[];
  speakers: User[];
  attendees: User[];
  stakeholders: User[];

  // resources: Resource[];
  // marketing: MarketingCampaign[];
  // analytics: Analytics;
  eventAdmin: User;
}
