export interface TaskResponse {
  id: number;
  user_id: string; // UUID as string
  title: string;
  description?: string | null;
  completed: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface TaskListResponse {
  tasks: TaskResponse[];
  total: number;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
}

export interface TaskUpdateRequest {
  title: string;
  description?: string;
  completed: boolean;
}