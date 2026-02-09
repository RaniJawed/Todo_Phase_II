import { serverAuth } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import TaskList from '@/components/TaskList';
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

export default async function TasksPage() {
  // For server components, we can't access localStorage, so we'll render the page
  // and let the client components handle authentication
  // The TaskList component will handle authentication on the client side
  return (
    <div className="min-h-screen bg-green-50/50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative min-h-screen">
        <header className="bg-white/80 backdrop-blur-xl border-b border-green-100 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                TaskFlow
              </h1>
            </Link>
            <nav className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white"
              >
                Home
              </Link>
              <Link
                href="/tasks"
                className="text-white px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 shadow-md shadow-green-200"
              >
                My Tasks
              </Link>
              <form action={signOut} className="inline">
                <button
                  type="submit"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white"
                >
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12 text-center px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
              Your Tasks
            </h2>
            <p className="text-xl text-green-600 font-semibold mb-4">
              Manage your productivity
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Stay organized and boost your productivity with our intuitive task management system
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Link
              href="/tasks/new"
              className="group py-3 px-6 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Task
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <TaskList />
          </div>
        </main>

        <footer className="bg-white/80 backdrop-blur-xl border-t border-green-100 mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-center md:text-left text-sm text-gray-600">
                © {new Date().getFullYear()} TaskFlow. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-300 text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-300 text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors duration-300 text-sm">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}