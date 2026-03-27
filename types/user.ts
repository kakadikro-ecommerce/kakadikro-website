export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
}

export interface AuthUser extends User {
  token: string;
}

export interface UserState {
  currentUser: AuthUser | null;
}