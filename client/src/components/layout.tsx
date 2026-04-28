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
      {/* Responsive Navigation */}
      <ResponsiveNavbar />

      {/* Main Content */}
      <main className="main-container pt-16 sm:pt-20 lg:pt-24 transition-all duration-300">
        {children}
      </main>

      {/* Footer */}
      <div className="transition-all duration-300">
        <Footer />
      </div>
    </div>
  );
}