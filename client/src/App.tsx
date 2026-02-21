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
import AuthPage from "@/pages/auth-page";
import Home from "@/pages/home";
import KruzhkiPage from "@/pages/kruzhki";
import PrimaryTeachersPage from "@/pages/primary-teachers";
import SubjectTeachersPage from "@/pages/subject-teachers";
import CuratorsPage from "@/pages/curators";
import AboutSchoolPage from "@/pages/about-school";
import SchoolDocumentsPage from "@/pages/school-documents";
import AdministrationPage from "@/pages/administration";
import EducationProcessPage from "@/pages/education-process";
import StateAttestationPage from "@/pages/state-attestation";
import UpbringingWorkPage from "@/pages/upbringing-work";
import CanteenPage from "@/pages/canteen";
import StudentsPage from "@/pages/students";
import SchedulePage from "@/pages/schedule";
import ContactPage from "@/pages/contact";
import GalleryPage from "@/pages/gallery";
import NotFound from "@/pages/not-found";

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
        <Route path="/admin" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
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
