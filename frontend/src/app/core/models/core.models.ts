// Core data models voor de applicatie
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  isEmailConfirmed: boolean;
  lastLoginAt?: Date;
  profile?: UserProfileData;
}

export interface UserProfileData {
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

export interface UserProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  bio?: string;
  profileImageUrl?: string;
  location?: string;
  website?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  phone?: string;
  isAvailableForWork: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  repoUrl: string;
  techStack: string[];
  imageUrl?: string;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  isCompleted: boolean;
  isActive?: boolean;
  duration?: string;
  durationInDays: number;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  repoUrl: string;
  techStack: string[];
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateProjectDto {
  id: number;
  title: string;
  description: string;
  repoUrl: string;
  techStack: string[];
  imageUrl?: string;
  startDate: Date;
  endDate?: Date;
}

export enum UserRole {
  Admin = 'Admin',
  User = 'User'
}

export enum ProjectStatus {
  Planned = 'Planned',
  InProgress = 'InProgress',
  Completed = 'Completed',
  OnHold = 'OnHold'
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
