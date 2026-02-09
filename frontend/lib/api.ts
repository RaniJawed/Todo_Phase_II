import { TaskCreateRequest, TaskUpdateRequest, TaskResponse, TaskListResponse } from '@/types/task';

// API client for the task management application
const API_BASE_URL = "https://codershub12-ai-powered-todo-chatbot.hf.space";


/**
 * Get current authenticated user
 * @returns Promise resolving to user info or null if not authenticated
 */
export async function getCurrentUser(): Promise<ApiResponse<{user_id: string, email: string}> | null> {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies as fallback
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } else {
      // If we get a 401, it means we're not authenticated
      if (response.status === 401) {
        // Clear invalid token from localStorage
        localStorage.removeItem('access_token');
        return null;
      }
      
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || 'Failed to get user info',
      };
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

interface RegisterCredentials {
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  email: string;
}

interface AuthResponse {
  user: UserResponse;
  access_token: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Register a new user
 * @param credentials User registration credentials (email and password)
 * @returns Promise resolving to API response
 */
export async function register(credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Include cookies in the request
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        error: data.detail || 'Registration failed',
      };
    }
  } catch (_error) {
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}

/**
 * Login a user
 * @param credentials User login credentials (email and password)
 * @returns Promise resolving to API response
 */
export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
  try {
 const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Include cookies in the request
    });

    const data = await response.json();

    if (response.ok) {
      // Store the token in localStorage for subsequent requests
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
      }
      
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        error: data.detail || 'Login failed',
      };
    }
  } catch (_error) {
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}

/**
 * List user's tasks
 * @param userId The ID of the user whose tasks to retrieve
 * @returns Promise resolving to task list response
 */
export async function listTasks(userId?: string): Promise<ApiResponse<TaskListResponse>> {
  try {
    // In a real app, we'd get the user ID from the auth context
    // For now, we'll use a placeholder or require it as a parameter
    const userIdToUse = userId; // In a real app, get from auth context if not provided

    if (!userIdToUse) {
      return {
        success: false,
        error: 'User ID is required to list tasks'
      };
    }

    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/api/${userIdToUse}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies as fallback
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        error: data.detail || 'Failed to load tasks',
      };
    }
  } catch (_error) {
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}

/**
 * Create a new task
 * @param userId The ID of the user creating the task
 * @param taskData The task data to create
 * @returns Promise resolving to create task response
 */
export async function createTask(userId: string, taskData: TaskCreateRequest): Promise<ApiResponse<TaskResponse>> {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies as fallback
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        error: data.detail || 'Failed to create task',
      };
    }
  } catch (_error) {
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}

/**
 * Update a task partially (e.g., toggle completion status)
 * @param userId The ID of the user who owns the task
 * @param taskId The ID of the task to update
 * @param taskData The partial task data to update
 * @returns Promise resolving to updated task response
 */
export async function patchTask(userId: string, taskId: number, taskData: { completed?: boolean }): Promise<ApiResponse<TaskResponse>> {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies as fallback
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        error: data.detail || 'Failed to update task',
      };
    }
  } catch (_error) {
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}

/**
 * Update a task completely (full replacement)
 * @param userId The ID of the user who owns the task
 * @param taskId The ID of the task to update
 * @param taskData The complete task data to update
 * @returns Promise resolving to updated task response
 */
export async function updateTask(userId: string, taskId: number, taskData: TaskUpdateRequest): Promise<ApiResponse<TaskResponse>> {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies as fallback
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        error: data.detail || 'Failed to update task',
      };
    }
  } catch (_error) {
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}

/**
 * Delete a task
 * @param userId The ID of the user who owns the task
 * @param taskId The ID of the task to delete
 * @returns Promise resolving to API response
 */
export async function deleteTask(userId: string, taskId: number): Promise<ApiResponse<void>> {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', // Include cookies as fallback
    });

    // For DELETE, we expect 204 No Content on success
    if (response.status === 204) {
      return {
        success: true,
      };
    } else {
      const data = await response.json();
      return {
        success: false,
        error: data.detail || 'Failed to delete task',
      };
    }
  } catch (_error) {
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}

// Add other API methods as needed for tasks