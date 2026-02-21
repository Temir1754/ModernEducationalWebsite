import { useState } from "react";
import { Link } from "wouter";
import { 
  Menu, 
  X, 
  ChevronDown,
  Home,
  School,
  GraduationCap,
  Newspaper,
  Users,
  UserCheck,
  BookOpen,
  Target,
  BookOpenCheck,
  Mail,
  FileText,
  Settings,
  Award,
  Shield,
  Clock,
  Heart,
  ExternalLink,
  UserPlus,
  FolderOpen,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const menuItems = [
    {
      id: "home",
      title: "Басты бет",
      icon: <Home className="w-5 h-5" />,
      href: "/",
      items: []
    },
    {
      id: "about",
      title: "Мектеп туралы",
      icon: <School className="w-5 h-5" />,
      href: "/about-school",
      items: []
    },
    {
      id: "documents",
      title: "Мектеп төлқұжаты",
      icon: <FileText className="w-5 h-5" />,
      href: "/school-documents",
      items: []
    },
    {
      id: "attestation",
      title: "Мемлекеттік аттестаттау",
      icon: <Award className="w-5 h-5" />,
      href: "/state-attestation",
      items: []
    },
    {
      id: "administration",
      title: "Әкімшілік құрамы",
      icon: <Users className="w-5 h-5" />,
      href: "/administration",
      items: []
    },
    {
      id: "pedagogical-staff",
      title: "Педагогикалық құрам",
      icon: <GraduationCap className="w-5 h-5" />,
      href: "#",
      items: [
        { title: "Бастауыш сынып мұғалімдері", href: "/primary-teachers" },
        { title: "Пән мұғалімдері", href: "/subject-teachers" },
        { title: "Сынып жетекшілері", href: "/curators" },
      ]
    },
    {
      id: "management",
      title: "Басқару",
      icon: <Settings className="w-5 h-5" />,
      href: "#",
      items: [
        { title: "Мектепішілік бақылау", href: "#school-control" },
        { title: "Циклограмма", href: "#cyclogram" },
        { title: "Педагогикалық кеңес", href: "#pedagogical-council" },
        { title: "Педагогикалық Әдеп кеңесі", href: "#ethics-council" },
        { title: "Қамқоршылық кеңес", href: "#guardianship-council" },
      ]
    },
    {
      id: "education-process",
      title: "Оқу үрдісі",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/education-process",
      items: []
    },
    {
      id: "upbringing",
      title: "Тәрбие жұмысы",
      icon: <Heart className="w-5 h-5" />,
      href: "/upbringing-work",
      items: []
    },
    {
      id: "for-teachers",
      title: "Мұғалімдер үшін",
      icon: <UserCheck className="w-5 h-5" />,
      href: "#",
      items: [
        { title: "Педагогикалық Әдеп қағидалары", href: "#pedagogical-ethics" },
        { title: "Нормативті-құқықтық құжаттар", href: "#normative-docs" },
      ]
    },
    {
      id: "for-parents",
      title: "Ата аналар үшін",
      icon: <Users className="w-5 h-5" />,
      href: "#",
      items: [
        { title: "Лицейге қабылдау ережесі", href: "#admission-rules" },
        { title: "Білім беру қызметтерін көрсетудің келісім шарты", href: "#education-contract" },
        { title: "Пайдалы сілтемелер", href: "#useful-links" },
        { title: "Қабылдау – 2026", href: "#admission-2026" },
        { title: "Ата – аналарды педагогикалық қолдау орталығы", href: "#parent-support" },
        { title: "Ата - аналар назарына", href: "#parent-attention" },
        { title: "Лицей шәкірттерінің киім үлгісі", href: "#uniform-style" },
      ]
    },
    {
      id: "vacancies",
      title: "Бос орындар",
      icon: <UserPlus className="w-5 h-5" />,
      href: "#",
      items: [
        { title: "Қажетті құжаттар тізімі", href: "#required-documents" },
      ]
    },
    {
      id: "contacts",
      title: "Байланыс",
      icon: <Mail className="w-5 h-5" />,
      href: "#contacts",
      items: []
    }
  ];



  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-blue-500 to-blue-600 text-white">
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-400">
        <Link href="/" className="block">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-blue-600 font-bold text-lg">FGS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">FGS</h1>
              <p className="text-sm text-blue-100">Болашақ ұрпақ мектебі</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              {item.items.length > 0 ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-blue-100 hover:bg-blue-400 hover:bg-opacity-30 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openDropdown === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === item.id && (
                    <div className="mt-2 ml-4">
                      <div className="flex flex-wrap gap-2">
                        {item.items.map((subItem, index) => (
                          <Link
                            key={index}
                            href={subItem.href}
                            className="inline-block px-3 py-1 text-xs text-blue-100 bg-blue-400/30 hover:bg-blue-300 hover:text-blue-800 rounded-md transition-colors duration-200 border border-blue-300"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-400 hover:bg-opacity-30 hover:text-white rounded-lg transition-all duration-200"
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>


    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen fixed left-0 top-0 z-50">
        <SidebarContent />
      </div>

      {/* Mobile Header & Burger Menu */}
      <div className="md:hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 fixed w-full top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" data-testid="mobile-home-link">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-md flex items-center justify-center shadow-md">
              <span className="text-blue-600 font-bold text-xs sm:text-sm">FGS</span>
            </div>
            <span className="font-semibold text-sm sm:text-base">FGS</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="text-white hover:bg-blue-400 hover:bg-opacity-30 h-8 w-8 sm:h-10 sm:w-10"
            data-testid="mobile-menu-toggle"
          >
            {isMobileOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-60">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileOpen(false)}
            data-testid="mobile-sidebar-overlay"
          />
          <div className="absolute left-0 top-0 w-80 sm:w-72 h-full overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}