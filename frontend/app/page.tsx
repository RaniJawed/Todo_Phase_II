'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { clientAuth } from '@/lib/client-auth';
import { Toaster } from 'react-hot-toast';

// Smooth scroll function
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Intersection Observer hook
const useOnScreen = (ref: React.RefObject<Element | null>, rootMargin = '0px') => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, rootMargin]);

  return isIntersecting;
};

// Fade in component
const FadeInWhenVisible = ({
  children,
  className = '',
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Feature Card
const FeatureCard = ({
  title,
  description,
  icon,
  index
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
}) => {
  return (
    <div className="group p-8 bg-white rounded-3xl border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

// Step Component
const Step = ({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8 bg-white rounded-3xl border border-green-50 hover:border-green-200 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-green-200">
          {number}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </FadeInWhenVisible>
  );
};

// Pricing Card
const PricingCard = ({
  plan,
  price,
  description,
  features,
  popular = false,
  delay = 0
}: {
  plan: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  delay?: number;
}) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <div className={`relative p-8 rounded-3xl transition-all duration-300 ${popular
        ? 'bg-white border-2 border-green-500 shadow-xl scale-105 z-10'
        : 'bg-white border border-green-100 shadow-sm hover:shadow-lg'
        }`}>
        {popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg shadow-green-200">
              Most Popular
            </span>
          </div>
        )}

        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">{plan}</h3>
          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center text-gray-600 text-sm">
              <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href="/register"
          className={`block w-full py-3 px-6 rounded-xl text-center font-semibold transition-all duration-300 ${popular
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 hover:shadow-xl'
            : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
        >
          Get Started
        </Link>
      </div>
    </FadeInWhenVisible>
  );
};

export default function HomePage() {
  const [session, setSession] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const currentSession = await clientAuth.getSession();
      setSession(currentSession);
    };

    checkSession();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await clientAuth.signOut();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-green-50/50 text-gray-900 selection:bg-green-200 selection:text-green-900">
      <Toaster position="bottom-right" />

      {/* Navbar */}
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled
        ? 'bg-white/80 backdrop-blur-md border-b border-green-100 py-3 shadow-sm'
        : 'bg-transparent py-5'
        }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">TaskFlow</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {['Features', 'How It Works', 'Pricing'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                  className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                >
                  {item}
                </button>
              ))}

              <div className="w-px h-6 bg-gray-200 mx-2"></div>

              {session ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/tasks"
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <FadeInWhenVisible>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              v2.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
              Manage Tasks with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                Grace & Efficiency
              </span>
            </h1>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={100}>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              A clean, beautiful, and distraction-free workspace designed to help you organize your life and get things done.
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={session ? "/tasks" : "/register"}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold text-lg hover:bg-gray-800 hover:scale-105 transition-all shadow-xl shadow-gray-200"
              >
                {session ? "Go to Dashboard" : "Start for Free"}
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-semibold text-lg hover:border-green-200 hover:bg-green-50/50 transition-all"
              >
                Learn more
              </button>
            </div>
          </FadeInWhenVisible>

          {/* Hero Image / Preview */}
          <FadeInWhenVisible delay={300}>
            <div className="mt-20 relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-t from-green-50/50 to-transparent z-10 pointer-events-none"></div>
              <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden p-2">
                <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-[16/9] flex items-center justify-center relative">
                  {/* Abstract UI Representation */}
                  <div className="absolute inset-0 bg-green-50/50 flex flex-col p-8 gap-4">
                    <div className="w-full h-8 bg-white rounded-lg shadow-sm w-1/3 mb-4"></div>
                    <div className="flex gap-6 h-full">
                      <div className="w-64 bg-white rounded-2xl shadow-sm h-full p-4 hidden md:block">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                        </div>
                      </div>
                      <div className="flex-1 bg-white rounded-2xl shadow-sm h-full p-6">
                        <div className="flex justify-between mb-8">
                          <div className="h-8 bg-gray-100 rounded w-1/3"></div>
                          <div className="h-8 bg-green-100 rounded w-24"></div>
                        </div>
                        <div className="space-y-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 border border-gray-100 rounded-xl flex items-center px-4 gap-4">
                              <div className="w-6 h-6 rounded-full border-2 border-green-200"></div>
                              <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p className="text-gray-500 text-lg">Powerful features wrapped in a simple design.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeInWhenVisible delay={0}>
              <FeatureCard
                title="Smart Organization"
                description="Categorize tasks with tags and priorities. Filter views to focus on what matters most right now."
                icon="🗂️"
                index={0}
              />
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={100}>
              <FeatureCard
                title="Focus Mode"
                description="Eliminate distractions with our clean interface designed to keep you in the flow state."
                icon="🎯"
                index={1}
              />
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={200}>
              <FeatureCard
                title="Progress Tracking"
                description="Visualize your productivity with beautiful charts and daily progress insights."
                icon="📊"
                index={2}
              />
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-green-50/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get started in minutes</h2>
            <p className="text-gray-500 text-lg">No steep learning curve. Just sign up and start doing.</p>
          </div>

          <div className="space-y-6">
            <Step
              number="01"
              title="Create an account"
              description="Sign up for free in less than 30 seconds. No credit card required."
              delay={0}
            />
            <Step
              number="02"
              title="Add your tasks"
              description="Dump your brain. Add everything you need to do into the inbox."
              delay={100}
            />
            <Step
              number="03"
              title="Get to work"
              description="Prioritize, schedule, and start checking things off your list."
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple pricing</h2>
            <p className="text-gray-500 text-lg">Choose the plan that fits your needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              plan="Starter"
              price="$0"
              description="For individuals"
              features={["Up to 50 tasks", "Basic categories", "7-day history"]}
              delay={0}
            />
            <PricingCard
              plan="Pro"
              price="$9"
              description="For power users"
              features={["Unlimited tasks", "Advanced analytics", "Priority support", "Custom themes"]}
              popular={true}
              delay={100}
            />
            <PricingCard
              plan="Team"
              price="$29"
              description="For small teams"
              features={["Everything in Pro", "Collaborative workspaces", "Admin controls", "API access"]}
              delay={200}
            />
          </div>
        </div>
      </section>

    </div>
  );
}