'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskCreateRequest, TaskUpdateRequest, TaskResponse } from '@/types/task';
import { createTask, updateTask } from '@/lib/api';
import { clientAuth } from '@/lib/client-auth';
import Link from 'next/link';

interface TaskFormProps {
  initialData?: (TaskCreateRequest & { id?: number; completed?: boolean }) | TaskResponse; // For both create and update
  isEdit?: boolean; // Whether this is for editing or creating
}

export default function TaskForm({ initialData, isEdit = false }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Get the current user session to extract user ID
    const session = await clientAuth.getSession();

    if (!session || !session.user) {
      setError('You must be logged in to save tasks');
      setLoading(false);
      return;
    }

    const userId = session.user.id;

    try {
      let result;
      if (isEdit && initialData?.id) {
        // For update, we need to send the complete task data as required by TaskUpdateRequest
        const taskData: TaskUpdateRequest = {
          title,
          description: description || "", // TaskUpdateRequest requires description as string (can be empty)
          completed: (initialData as TaskResponse)?.completed || (initialData as TaskCreateRequest & { completed?: boolean })?.completed || false
        };
        result = await updateTask(userId, initialData.id, taskData);
      } else {
        // For create, we send TaskCreateRequest data
        const taskData: TaskCreateRequest = {
          title,
          description: description || undefined // Use undefined instead of empty string for optional field
        };
        result = await createTask(userId, taskData);
      }

      if (result.success) {
        // Redirect to tasks page on success
        router.push('/tasks');
        router.refresh();
      } else {
        setError(result.error || 'Failed to save task');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-green-100 p-8 shadow-sm">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 mb-6">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-red-600 text-sm font-medium">{error}</div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
            placeholder="Enter task title"
          />
          <div className="mt-1 flex justify-end">
            <span className="text-xs text-gray-400">
              {title.length}/200
            </span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <div className="relative group">
          <textarea
            id="description"
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 resize-none"
            placeholder="Enter task description (optional)"
          />
          <div className="mt-1 flex justify-end">
            <span className="text-xs text-gray-400">
              {description.length}/1000
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Link
          href="/tasks"
          className="inline-flex items-center px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-xl text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="group relative inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20 transition-all duration-200"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {isEdit ? 'Update Task' : 'Create Task'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}