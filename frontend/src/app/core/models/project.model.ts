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
  isActive: boolean;
  duration?: string;
  durationInDays: number;
}

export enum ProjectStatus {
  Planning = 0,
  InProgress = 1,
  Completed = 2,
  OnHold = 3,
  Cancelled = 4
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  repoUrl: string;
  techStack: string[];
  imageUrl?: string;
  startDate: Date;
  endDate?: Date;
}

export interface UpdateProjectRequest {
  id: number;
  title: string;
  description: string;
  repoUrl: string;
  techStack: string[];
  imageUrl?: string;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
}
