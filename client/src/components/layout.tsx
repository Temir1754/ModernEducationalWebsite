import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import ResponsiveNavbar from "./responsive-navbar";
import Footer from "./footer";
import { ArrowLeft, Home } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isHomePage = location === '/';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      {/* Mobile Back Button - Only visible on mobile and non-home pages */}
      {!isHomePage && (
        <div className="fixed top-4 right-4 z-40 lg:hidden">
          <Link href="/">
            <button className="bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white dark:hover:bg-[#1e293b]">
              <Home className="w-5 h-5 text-blue-600 dark:text-[#60a5fa]" />
            </button>
          </Link>
        </div>
      )}

      {/* Responsive Navigation */}
      <ResponsiveNavbar />

      {/* Main Content */}
      <main className="main-container pt-20 transition-all duration-300">
        {children}
      </main>

      {/* Footer */}
      <div className="transition-all duration-300">
        <Footer />
      </div>
    </div>
  );
}