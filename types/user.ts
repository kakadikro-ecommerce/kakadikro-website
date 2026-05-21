export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
}

export interface AuthUser extends User {
  id?: string;
}

export interface UserState {
  currentUser: AuthUser | null;
  accessToken: string | null;
  isAuthReady: boolean;
  isAuthChecking: boolean;
}
