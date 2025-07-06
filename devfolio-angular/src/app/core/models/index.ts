// Project Model - gebaseerd op backend Project entity
export interface Project {
  id: number;
  title: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  imageUrl?: string;
  techStack: string[];
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  isHighlighted: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  PLANNED = 'Planned',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled'
}

// DTOs voor API communicatie
export interface CreateProjectDto {
  title: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  imageUrl?: string;
  techStack: string[];
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  isHighlighted: boolean;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  id: number;
}

// User Model - gebaseerd op backend User entity
export interface User {
  id: number;
  email: string;
  username: string;
  profile?: UserProfile;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  isPublic: boolean;
}

// Auth DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
