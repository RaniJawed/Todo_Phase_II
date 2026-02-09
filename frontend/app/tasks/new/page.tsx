import { serverAuth } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import Link from 'next/link';
import { cookies } from 'next/headers';

// Server action for signing out
async function signOut() {
  'use server';

  // Delete the access token cookie
  const cookieStore = await cookies();
  cookieStore.delete('access_token');

  // Redirect to home page after sign out
  redirect('/');
}

export default async function NewTaskPage() {
  // For server components, we can't access localStorage, so we'll render the page
  // and let the client components handle authentication
  // The TaskForm component will handle authentication on the client side
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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

      <div className="relative min-h-screen">
        <header className="bg-gray-900/70 backdrop-blur-2xl border-b border-gray-800/30 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              Create New Task
            </h1>
            <nav className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                href="/tasks"
                className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                My Tasks
              </Link>
              <form action={signOut} className="inline">
                <button
                  type="submit"
                  className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        </header>

        <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black mb-4">
              <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Create a New Task
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent text-xl mt-2">
                Add a new item to your productivity workflow
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mt-4">
              Fill in the details below to create a new task. Make sure to provide a clear title and description for better organization.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <TaskForm />
          </div>
        </main>

        <footer className="bg-gray-900/70 backdrop-blur-2xl border-t border-gray-800/30 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </footer>
      </div>


    </div>
  );
}