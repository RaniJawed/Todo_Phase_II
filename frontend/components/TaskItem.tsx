'use client';

import { useState } from 'react';
import { TaskResponse } from '@/types/task';
import { patchTask, deleteTask } from '@/lib/api';
import { clientAuth } from '@/lib/client-auth';
import Link from 'next/link';
import Dialog from '@/components/Dialog';

interface TaskItemProps {
  task: TaskResponse;
  onTaskUpdate?: (tasks: TaskResponse[]) => void; // Callback when task is updated
}

export default function TaskItem({ task, onTaskUpdate }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localTask, setLocalTask] = useState(task);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggleCompletion = async () => {
    if (isUpdating) return; // Prevent multiple clicks

    setIsUpdating(true);

    try {
      // Optimistic update: immediately update UI
      const newCompletedStatus = !localTask.completed;
      setLocalTask((prev: TaskResponse) => ({ ...prev, completed: newCompletedStatus }));

      // Get user ID from session
      const session = await clientAuth.getSession();
      if (!session || !session.user) {
        throw new Error('Not authenticated');
      }

      // Call API to update task
      const result = await patchTask(session.user.id, localTask.id, {
        completed: newCompletedStatus
      });

      if (!result.success || !result.data) {
        // If API call fails, revert the optimistic update
        setLocalTask((prev: TaskResponse) => ({ ...prev, completed: localTask.completed }));
        console.error('Failed to update task:', result.error || 'Unknown error');
      } else {
        // Update the task in the parent component if provided
        if (onTaskUpdate) {
          // This would require the parent to have all tasks to update properly
          // For now, we'll just update our local state
          // The parent component will handle the update
        }
        // Update local task state with the response data
        setLocalTask(result.data);
      }
    } catch (error) {
      // If there's an error, revert the optimistic update
      setLocalTask((prev: TaskResponse) => ({ ...prev, completed: localTask.completed }));
      console.error('Error toggling task completion:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false);
    setIsUpdating(true);

    try {
      // Get user ID from session
      const session = await clientAuth.getSession();
      if (!session || !session.user) {
        throw new Error('Not authenticated');
      }

      // Call API to delete task
      const result = await deleteTask(session.user.id, localTask.id);

      if (!result.success) {
        console.error('Failed to delete task:', result.error);
        alert('Failed to delete task: ' + result.error);
      } else {
        // Remove the task from the UI
        // We should notify the parent component to update the task list
        if (onTaskUpdate) {
          // This would require the parent to have all tasks to update properly
          // For now, we'll just rely on the parent component to refetch tasks
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isUpdating) return; // Prevent actions while updating
    handleDeleteClick();
  };

  return (
    <li className={`bg-white/80 backdrop-blur-md rounded-2xl m-2 border border-green-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-green-200 ${isUpdating ? 'opacity-75' : ''}`}>
      <div className="block p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={localTask.completed}
              onChange={toggleCompletion}
              disabled={isUpdating}
              className="h-5 w-5 rounded-full border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-grow">
                <h3 className={`text-lg font-semibold ${localTask.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {localTask.title}
                </h3>
                {localTask.description && (
                  <p className={`mt-1 text-sm text-gray-600 ${localTask.completed ? 'line-through opacity-70' : ''}`}>
                    {localTask.description}
                  </p>
                )}
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                    {new Date(localTask.created_at).toLocaleDateString()}
                  </span>
                  {localTask.completed ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={handleDelete}
                  disabled={isUpdating}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete task"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <Link href={`/tasks/${localTask.id}`} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </li>
  );
}