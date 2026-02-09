'use client';

import { useState, useEffect } from 'react';
import { TaskResponse } from '@/types/task';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';
import { listTasks } from '@/lib/api';
import { clientAuth } from '@/lib/client-auth';

export default function TaskList() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the current user session to extract user ID
        const session = await clientAuth.getSession();

        if (!session || !session.user) {
          // Redirect to login if not authenticated
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return;
        }

        // Extract user ID from session
        const userId = session.user.id; // Get user ID from the decoded JWT token

        const result = await listTasks(userId);

        if (result.success && result.data) {
          setTasks(result.data.tasks || []);
        } else {
          setError(result.error || 'Failed to load tasks');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-green-100 p-12 text-center shadow-sm">
        <div className="relative inline-flex mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-100 p-6 shadow-sm">
        <div className="flex items-center justify-center text-red-600">
          <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-green-100 overflow-hidden shadow-sm p-4">
      <div className="pb-4 px-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Your Tasks <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{tasks.length}</span>
        </h3>
      </div>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}