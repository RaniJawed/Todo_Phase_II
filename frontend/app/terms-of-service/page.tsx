'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientAuth } from '@/lib/client-auth';
import { useRouter } from 'next/navigation';

export default function TermsOfServicePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  // Mouse move effect for interactive background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Check if user is logged in to show appropriate navigation
  useEffect(() => {
    const checkSession = async () => {
      const session = await clientAuth.getSession();
      if (session) {
        // User is logged in
        return;
      }
    };
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated gradient background with mouse interaction */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />

        {/* Dynamic gradient based on mouse position */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(139, 92, 246, 0.3) 0%,
              rgba(236, 72, 153, 0.2) 25%,
              transparent 50%)`,
            transition: 'background 0.3s ease-out'
          }}
        />

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

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl z-10">
          {/* Navigation */}
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-violet-600 to-pink-600 flex items-center justify-center mr-3">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-white font-bold text-xl">TaskFlow</span>
            </div>
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Terms Card */}
          <div className="relative group">
            {/* Glow border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500" />

            {/* Main card */}
            <div className="relative bg-gray-900/70 backdrop-blur-2xl border border-gray-800/30 rounded-2xl p-8 md:p-10 shadow-2xl">
              {/* Card glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5" />

              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Terms of Service
                </h1>
                <p className="text-gray-400 text-lg">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using TaskFlow, you accept and agree to be bound by the terms and provisions of this agreement.
                    If you do not agree to abide by these terms, you are not authorized to use TaskFlow.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                  <p>
                    TaskFlow provides a task management platform that allows users to create, organize, and manage their personal
                    and professional tasks. The service is provided "as is" without any warranties of any kind.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
                  <p>
                    When you create an account with us, you must provide information that is accurate, complete, and current at all
                    times. Failure to do so constitutes a breach of the terms, which may result in immediate termination of your
                    account on our service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">4. Account Security</h2>
                  <p>
                    You are responsible for safeguarding the password that you use to access the service and for any activities or
                    actions under your password, whether your password is with our service or a third-party service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">5. Prohibited Uses</h2>
                  <p>
                    You may not access or use the service for any purpose other than that for which we make the service available.
                    The service may not be used in connection with any commercial endeavors except those that are specifically
                    endorsed or approved by us.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">6. Intellectual Property</h2>
                  <p>
                    The service and its original content, features, and functionality are and will remain the exclusive property
                    of TaskFlow and its licensors. The service is protected by copyright, trademark, and other laws of both the
                    United States and foreign countries.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">7. Termination</h2>
                  <p>
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                    whatsoever, including without limitation if you breach the terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
                  <p>
                    In no event shall TaskFlow, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable
                    for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss
                    of profits, data, use, goodwill, or other intangible losses.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h2>
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is
                    material, we will provide at least 30 days' notice prior to any new terms taking effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">10. Contact Us</h2>
                  <p>
                    If you have any questions about these terms, please contact us at{' '}
                    <a href="mailto:support@taskflow.com" className="text-purple-400 hover:text-purple-300 hover:underline">
                      support@taskflow.com
                    </a>.
                  </p>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-800/50 flex justify-center">
                <Link
                  href="/register"
                  className="group relative px-8 py-4 rounded-xl text-base font-semibold text-white overflow-hidden transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-violet-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -inset-y-full -left-20 w-40 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shine" />
                  </div>
                  <span className="relative flex items-center justify-center">
                    Accept and Continue
                    <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
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

        @keyframes particle {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) translateX(100px) scale(0);
            opacity: 0;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
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

        .animate-particle {
          animation: particle linear infinite;
        }

        .animate-shine {
          animation: shine 1s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 15, 15, 0.5);
          backdrop-filter: blur(10px);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
        }

        /* Better focus styles */
        :focus-visible {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}