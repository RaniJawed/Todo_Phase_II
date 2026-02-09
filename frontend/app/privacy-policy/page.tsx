'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientAuth } from '@/lib/client-auth';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
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

          {/* Privacy Policy Card */}
          <div className="relative group">
            {/* Glow border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500" />

            {/* Main card */}
            <div className="relative bg-gray-900/70 backdrop-blur-2xl border border-gray-800/30 rounded-2xl p-8 md:p-10 shadow-2xl">
              {/* Card glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900/5 via-transparent to-pink-900/5" />

              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
                <p className="text-gray-400 text-lg">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                  <p>
                    We collect information you provide directly to us, such as when you create an account, use our services, or
                    communicate with us. This may include your name, email address, and other information you choose to provide.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                  <p>
                    We use information about you to provide and improve our services, communicate with you, and as otherwise
                    described in this Privacy Policy. Specifically, we use your information to:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Send you technical notices, updates, and administrative messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Provide customer support</li>
                    <li>Protect the safety and security of our services</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing and Disclosure</h2>
                  <p>
                    We do not share, sell, or rent your personal information to third parties for their commercial purposes.
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2">
                    <li>With your consent</li>
                    <li>To comply with applicable laws and regulations</li>
                    <li>To respond to legal processes or government requests</li>
                    <li>To protect the rights, property, or safety of us or others</li>
                    <li>To enforce our terms of service</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
                    internet or method of electronic storage is 100% secure.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">5. Data Retention</h2>
                  <p>
                    We retain your personal information for as long as necessary to provide our services and comply with our
                    legal obligations. When we no longer need your personal information, we will delete it securely.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2">
                    <li>The right to access your personal information</li>
                    <li>The right to correct inaccurate personal information</li>
                    <li>The right to request deletion of your personal information</li>
                    <li>The right to restrict processing of your personal information</li>
                    <li>The right to data portability</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">7. Cookies and Similar Technologies</h2>
                  <p>
                    We do not use cookies or similar tracking technologies to collect and store information about you. All
                    authentication is handled through secure session management.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">8. Third-Party Services</h2>
                  <p>
                    We may use third-party services to help us operate our services. These third parties may have access to
                    your personal information only to perform specific tasks on our behalf and are obligated not to disclose
                    or use your information for any other purpose.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">9. Children's Privacy</h2>
                  <p>
                    Our services are not directed to children under 13. We do not knowingly collect personal information from
                    children under 13. If we become aware that a child under 13 has provided us with personal information,
                    we will take steps to delete such information.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. When we do, we will post the updated policy on this
                    page and update the "Last updated" date. We encourage you to review this Privacy Policy periodically to
                    stay informed about our data practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">11. Contact Us</h2>
                  <p>
                    If you have questions about this Privacy Policy, please contact us at{' '}
                    <a href="mailto:privacy@taskflow.com" className="text-purple-400 hover:text-purple-300 hover:underline">
                      privacy@taskflow.com
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