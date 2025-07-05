export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  isEmailConfirmed: boolean;
  lastLoginAt?: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  fullName: string;
  bio?: string;
  profilePictureUrl?: string;
  location?: string;
  dateOfBirth?: Date;
  age?: number;
  websiteUrl?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
  fullName: string;
  isEmailConfirmed: boolean;
  token: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  id: number;
  email: string;
  username: string;
  fullName: string;
  role: string;
  token: string;
  expiresAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
