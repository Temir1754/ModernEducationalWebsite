import { lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";
import { HelmetProvider } from "react-helmet-async";
import Layout from "@/components/layout";
import ChatAssistant from "@/components/chat-assistant";
import { AuthProvider } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Lazy load pages
const AuthPage = lazy(() => import("@/pages/auth-page"));
const Home = lazy(() => import("@/pages/home"));
const KruzhkiPage = lazy(() => import("@/pages/kruzhki"));
const PrimaryTeachersPage = lazy(() => import("@/pages/primary-teachers"));
const SubjectTeachersPage = lazy(() => import("@/pages/subject-teachers"));
const CuratorsPage = lazy(() => import("@/pages/curators"));
const AboutSchoolPage = lazy(() => import("@/pages/about-school"));
const SchoolDocumentsPage = lazy(() => import("@/pages/school-documents"));
const AdministrationPage = lazy(() => import("@/pages/administration"));
const EducationProcessPage = lazy(() => import("@/pages/education-process"));
const StateAttestationPage = lazy(() => import("@/pages/state-attestation"));
const UpbringingWorkPage = lazy(() => import("@/pages/upbringing-work"));
const CanteenPage = lazy(() => import("@/pages/canteen"));
const StudentsPage = lazy(() => import("@/pages/students"));
const SchedulePage = lazy(() => import("@/pages/schedule"));
const ContactPage = lazy(() => import("@/pages/contact"));
const GalleryPage = lazy(() => import("@/pages/gallery"));
const EventsPage = lazy(() => import("@/pages/events"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/kruzhki" component={KruzhkiPage} />
          <Route path="/primary-teachers" component={PrimaryTeachersPage} />
          <Route path="/subject-teachers" component={SubjectTeachersPage} />
          <Route path="/curators" component={CuratorsPage} />
          <Route path="/about-school" component={AboutSchoolPage} />
          <Route path="/school-documents" component={SchoolDocumentsPage} />
          <Route path="/administration" component={AdministrationPage} />
          <Route path="/education-process" component={EducationProcessPage} />
          <Route path="/state-attestation" component={StateAttestationPage} />
          <Route path="/upbringing-work" component={UpbringingWorkPage} />
          <Route path="/canteen" component={CanteenPage} />
          <Route path="/students" component={StudentsPage} />
          <Route path="/schedule" component={SchedulePage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/admin" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <Layout>
                  <Router />
                </Layout>
                <ChatAssistant />
                <Toaster />
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
