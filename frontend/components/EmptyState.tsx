import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className="text-center py-16 bg-gradient-to-br from-gray-900/40 to-gray-950/60 backdrop-blur-2xl rounded-3xl border border-gray-800/50 px-8 shadow-2xl shadow-purple-900/10 animate-fade-in">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 mb-8 relative overflow-hidden group">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-purple-500/10 blur-xl animate-ping-slow" />
        <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-pink-500/10 blur-xl animate-ping-slow delay-1000" />
        
        {/* Main icon */}
        <svg
          className="h-12 w-12 text-purple-400 relative z-10 drop-shadow-lg transition-transform duration-500 group-hover:rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
        No tasks yet
      </h3>
      
      <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        Get started by creating your first task. Organize your work and boost your productivity.
      </p>
      
      <div className="mt-6">
        <Link
          href="/tasks/new"
          className="group relative py-4 px-8 rounded-2xl text-lg font-bold text-white overflow-hidden transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 inline-flex items-center"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 z-0" />
          
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-0" />
          
          {/* Button content */}
          <span className="relative flex items-center justify-center z-10">
            <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add your first task
          </span>
        </Link>
      </div>
      
      {/* Subtle decorative elements */}
      <div className="mt-16 flex justify-center space-x-4 opacity-30">
        <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
        <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse delay-300" />
        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse delay-700" />
      </div>
    </div>
  );
}