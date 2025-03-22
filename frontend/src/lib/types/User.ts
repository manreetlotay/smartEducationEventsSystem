export interface User {
  id: string;
  email: string;
  password: string;
  phoneNumber: string;
  profileImage?: string;
  userType: USER_TYPE;
  profession?: string; // example: if we want to specify that a speaker is a researcher
  points: number; // for the extra feature

  firstName: string; //individual users only
  lastName: string; //individual users only
  affiliation?: string; // Optional field for individual users affiliated with an organization

  organizationName: string;
  organizationAddress: string;
}

export enum USER_TYPE {
  INDIVIDUAL = "individual",
  ORGANIZATION = "organization",
}
