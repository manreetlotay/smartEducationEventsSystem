export interface EventPreview {
  name: string;
  date: string;
  location?: string;
  description: string;
  format: eventFormat;
  tags: string[];
  imageSrc: string;
}

export enum eventFormat {
  ONLINE = "online",
  PERSON = "in-person",
  HYBRID = "hybrid",
}
