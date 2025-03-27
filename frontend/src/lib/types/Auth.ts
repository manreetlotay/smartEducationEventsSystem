import { User, USER_TYPE } from "./User";

export interface RegisterOrganizationUser {
  email: string;
  password: string;
  phoneNumber: string;
  userType: USER_TYPE;
  organizationName: string;
  organizationAddress: string;
}

export interface RegisterIndividualUser {
  email: string;
  password: string;
  phoneNumber: string;
  userType: USER_TYPE;
  profession?: string;
  firstName: string;
  lastName: string;
  affiliation?: string;
}

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    params: RegisterIndividualUser | RegisterOrganizationUser
  ) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}
