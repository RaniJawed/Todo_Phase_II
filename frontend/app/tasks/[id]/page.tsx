'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TaskResponse } from '@/types/task';
import TaskForm from '@/components/TaskForm';
import { listTasks } from '@/lib/api';
import { clientAuth } from '@/lib/client-auth';

export default function TaskEditPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = parseInt(params.id as string);
  const [task, setTask] = useState<TaskResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const session = await clientAuth.getSession();
        if (!session || !session.user) {
          setError('You must be logged in to edit tasks');
          setLoading(false);
          return;
        }

        const userId = session.user.id;
        const result = await listTasks(userId);

        if (!result.success || !result.data) {
          setError(result.error || 'Failed to load tasks');
          setLoading(false);
          return;
        }

        // Find the specific task by ID
        const foundTask = result.data.tasks?.find((t: TaskResponse) => t.id === taskId);
        if (!foundTask) {
          setError('Task not found');
          setLoading(false);
          return;
        }

        setTask(foundTask);
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error loading task:', err);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden py-8">
        {/* Animated gradient background */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(to right, #8b5cf6 1px, transparent 1px),
                               linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
          
          {/* Animated orbs */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-orb-1" />
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-orb-2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl animate-orb-3" />
        </div>

        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/30 p-8">
            <div className="animate-pulse flex flex-col items-center justify-center py-12">
              <div className="h-8 bg-gray-800 rounded w-1/3 mb-6"></div>
              <div className="h-4 bg-gray-800 rounded w-1/4 mb-8"></div>
              <div className="h-12 bg-gray-800 rounded w-3/4 mb-6"></div>
              <div className="h-32 bg-gray-800 rounded w-full"></div>
              <div className="mt-8 text-gray-500">Loading task details...</div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes orb-1 {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
              opacity: 0.1;
            }
            33% { 
              transform: translate(100px, -150px) scale(1.1);
              opacity: 0.15;
            }
            66% { 
              transform: translate(-80px, 100px) scale(0.9);
              opacity: 0.05;
            }
          }
          
          @keyframes orb-2 {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
              opacity: 0.1;
            }
            33% { 
              transform: translate(-120px, 80px) scale(1.2);
              opacity: 0.15;
            }
            66% { 
              transform: translate(60px, -100px) scale(0.8);
              opacity: 0.05;
            }
          }
          
          @keyframes orb-3 {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.05;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.1;
            }
          }
          
          .animate-orb-1 {
            animation: orb-1 20s ease-in-out infinite;
          }
          
          .animate-orb-2 {
            animation: orb-2 25s ease-in-out infinite;
            animation-delay: -5s;
          }
          
          .animate-orb-3 {
            animation: orb-3 15s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden py-8">
        {/* Animated gradient background */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(to right, #8b5cf6 1px, transparent 1px),
                               linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
          
          {/* Animated orbs */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-orb-1" />
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-orb-2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl animate-orb-3" />
        </div>

        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/30 p-8">
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 backdrop-blur-xl mb-8">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-red-300">{error}</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/tasks')}
              className="inline-flex items-center px-5 py-2.5 border border-gray-700 text-sm font-medium rounded-xl text-gray-300 bg-gray-800/30 hover:bg-gray-700/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tasks
            </button>
          </div>
        </div>

        <style jsx global>{`
          @keyframes orb-1 {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
              opacity: 0.1;
            }
            33% { 
              transform: translate(100px, -150px) scale(1.1);
              opacity: 0.15;
            }
            66% { 
              transform: translate(-80px, 100px) scale(0.9);
              opacity: 0.05;
            }
          }
          
          @keyframes orb-2 {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
              opacity: 0.1;
            }
            33% { 
              transform: translate(-120px, 80px) scale(1.2);
              opacity: 0.15;
            }
            66% { 
              transform: translate(60px, -100px) scale(0.8);
              opacity: 0.05;
            }
          }
          
          @keyframes orb-3 {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.05;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.1;
            }
          }
          
          .animate-orb-1 {
            animation: orb-1 20s ease-in-out infinite;
          }
          
          .animate-orb-2 {
            animation: orb-2 25s ease-in-out infinite;
            animation-delay: -5s;
          }
          
          .animate-orb-3 {
            animation: orb-3 15s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden py-8">
        {/* Animated gradient background */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(to right, #8b5cf6 1px, transparent 1px),
                               linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
          
          {/* Animated orbs */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-orb-1" />
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-orb-2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl animate-orb-3" />
        </div>

        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/30 p-8 text-center py-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/30 mb-6">
              <svg
                className="h-10 w-10 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Task not found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              The task you're looking for doesn't exist or may have been deleted.
            </p>
            <button
              onClick={() => router.push('/tasks')}
              className="inline-flex items-center px-5 py-2.5 border border-gray-700 text-sm font-medium rounded-xl text-gray-300 bg-gray-800/30 hover:bg-gray-700/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tasks
            </button>
          </div>
        </div>

        <style jsx global>{`
          @keyframes orb-1 {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
              opacity: 0.1;
            }
            33% { 
              transform: translate(100px, -150px) scale(1.1);
              opacity: 0.15;
            }
            66% { 
              transform: translate(-80px, 100px) scale(0.9);
              opacity: 0.05;
            }
          }
          
          @keyframes orb-2 {
            0%, 100% { 
              transform: translate(0, 0) scale(1);
              opacity: 0.1;
            }
            33% { 
              transform: translate(-120px, 80px) scale(1.2);
              opacity: 0.15;
            }
            66% { 
              transform: translate(60px, -100px) scale(0.8);
              opacity: 0.05;
            }
          }
          
          @keyframes orb-3 {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.05;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.1;
            }
          }
          
          .animate-orb-1 {
            animation: orb-1 20s ease-in-out infinite;
          }
          
          .animate-orb-2 {
            animation: orb-2 25s ease-in-out infinite;
            animation-delay: -5s;
          }
          
          .animate-orb-3 {
            animation: orb-3 15s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden py-8">
      {/* Animated gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, #8b5cf6 1px, transparent 1px),
                             linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
        
        {/* Animated orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-orb-1" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-orb-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-3xl animate-orb-3" />
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black mb-4">
            <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              Edit Task
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent text-xl mt-2">
              Modify your task details
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4">
            Update the details of your task below. Make sure to save your changes when you're done.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <TaskForm
            initialData={{
              id: task.id,
              title: task.title,
              description: task.description || '',
              completed: task.completed
            }}
            isEdit={true}
          />
        </div>
      </div>


    </div>
  );
}