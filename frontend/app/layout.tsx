import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Task Management App",
  description: "A full-featured task management application with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} ${poppins.variable} bg-green-50 text-slate-800 min-h-screen flex flex-col`}>
        <div className="flex-grow">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="w-full py-6 text-center text-sm text-gray-500 bg-white/50 backdrop-blur-sm border-t border-green-100">
          <p className="flex items-center justify-center gap-1">
            Designed & Developed by
            <span className="font-semibold text-green-700">Mohsin Raza</span>
            <span className="text-red-500">❤️</span>
          </p>
        </footer>

        {/* Chat Widget */}
        <ChatWidget />
      </body>
    </html>
  );
}