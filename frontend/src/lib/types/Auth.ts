export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  isSystemAdmin: boolean;
}

export interface LoginUser {
  email: string;
  password: string;
}
