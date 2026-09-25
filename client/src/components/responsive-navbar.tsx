import { useState, useEffect } from "react";
import { Menu, X, Phone, MessageCircle, Send, Facebook, LogIn } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Admin login entry, highlighted so it stands out from the contact icons.
function AdminLoginButton({ className }: { className: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/admin"
          data-testid="admin-login"
          aria-label="Вход для администратора"
          className={`${className} rounded-full inline-flex items-center gap-1.5 px-4 font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-600/25 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500`}
        >
          <LogIn className="w-4 h-4" />
          Кіру
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom">Вход для администратора</TooltipContent>
    </Tooltip>
  );
}

interface NavItem {
  label: string;
  href: string;
}

// ========================================
// НАСТРОЙКА ВИДИМОСТИ РАЗДЕЛОВ МЕНЮ
// ========================================
// Чтобы ВЕРНУТЬ раздел "Мұғалімдер" в меню:
// Измените значение hideTeachers с true на false
// Страница /primary-teachers будет доступна по прямой ссылке в любом случае
const hideTeachers = true;
// ========================================

const navigation: NavItem[] = [
  { label: "Басты бет", href: "/" },
  { label: "Мектеп туралы", href: "/about-school" },
  { label: "Басқарма", href: "/administration" },
  { label: "Мұғалімдер", href: "/primary-teachers" },
  { label: "Оқушылар", href: "/students" },
  { label: "Асхана", href: "/canteen" },
  { label: "Мемлекеттік аттестация", href: "/school-documents" },
  { label: "Мектеп тынысы", href: "/upbringing-work" },
  { label: "Фотогалерея", href: "/gallery" },
  { label: "Байланыс", href: "/contact" }
];

const ResponsiveNavbar = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(true);
  const [location] = useLocation();

  // Фильтруем навигацию в зависимости от флага hideTeachers
  const visibleNavigation = hideTeachers
    ? navigation.filter(item => item.href !== "/primary-teachers")
    : navigation;

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };



  return (
    <>
      {/* Main Navigation Bar with Glassmorphism */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`navbar h-16 sm:h-20 lg:h-24 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white dark:bg-[#0f172a]/70 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-b border-white/20 dark:border-blue-500/10'
          : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-indigo-800 dark:to-blue-900 shadow-lg'
          }`}
      >
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">

            {/* Logo area */}
            <Link href="/" id="logo-link">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="cursor-pointer flex-shrink-0 transition-all active:scale-95 flex items-center"
              >
                {/* Wide logo (name + emblem): phones/tablets and large screens. Emblem only where the menu is crowded. */}
                <img
                  src="/logo-wide.webp"
                  alt="Білімді ұрпақ жекеменшік мектебі"
                  width={180}
                  height={56}
                  className="block h-10 w-auto max-w-none shrink-0 object-contain sm:h-12 xl:hidden min-[1366px]:block min-[1700px]:h-14"
                  data-testid="nav-logo"
                />
                <img
                  src="/logo.png"
                  alt="Білімді ұрпақ жекеменшік мектебі"
                  width={64}
                  height={64}
                  className="hidden h-16 w-16 max-w-none shrink-0 object-contain drop-shadow-md xl:block min-[1366px]:hidden"
                  data-testid="nav-logo-emblem"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center justify-center gap-0.5 min-[1700px]:gap-1 flex-1 px-4 min-[1700px]:px-8">
              {visibleNavigation.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + (index * 0.03),
                  }}
                >
                  <Link href={item.href}>
                    <span
                      data-testid={`nav-link-${item.label.toLowerCase().replace(/ /g, '-')}`}
                      className={`group relative px-2.5 min-[1700px]:px-4 py-2 font-bold text-[12px] min-[1700px]:text-[13px] tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap block rounded-full ${isActiveRoute(item.href)
                        ? isScrolled
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-sm'
                          : 'text-white bg-white/20 backdrop-blur-md shadow-md ring-1 ring-white/30'
                        : isScrolled
                          ? 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                          : 'text-gray-700 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {/* Active indicator dot */}
                      {isActiveRoute(item.href) && (
                        <motion.span 
                          layoutId="nav-dot"
                          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isScrolled ? 'bg-blue-600 dark:bg-blue-400' : 'bg-white'}`}
                        />
                      )}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Burger Menu Button */}
            <div className="xl:hidden flex items-center gap-2">
              <AdminLoginButton className="h-10 sm:h-11" />
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                data-testid="mobile-menu-button"
                onClick={toggleMobileMenu}
                className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm ${isScrolled
                    ? 'text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    : 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30'
                  }`}
                aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-7 h-7" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-7 h-7" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Desktop Contact Icons */}
            <div className="hidden xl:flex items-center gap-2 min-[1700px]:gap-3">

              <motion.a
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                href="tel:+77757906363"
                data-testid="contact-phone"
                className={`w-9 h-9 min-[1700px]:w-11 min-[1700px]:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${isScrolled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                title="Телефон"
              >
                <Phone className="w-5 h-5" />
              </motion.a>

              <motion.a
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                href="https://wa.me/77757906363"
                data-testid="contact-whatsapp"
                className={`w-9 h-9 min-[1700px]:w-11 min-[1700px]:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${isScrolled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white'
                  : 'bg-white/20 text-white hover:bg-green-500 backdrop-blur-sm'
                  }`}
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>

              <motion.a
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                href="https://t.me/bilimdi_urpaq"
                data-testid="contact-telegram"
                className={`w-9 h-9 min-[1700px]:w-11 min-[1700px]:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${isScrolled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white'
                  : 'bg-white/20 text-white hover:bg-blue-500 backdrop-blur-sm'
                  }`}
                title="Telegram"
              >
                <Send className="w-5 h-5" />
              </motion.a>
              <motion.a
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                href="https://www.facebook.com/people/Bilimdi-Urpaq-School/pfbid0b3bkVb2Vz1B59RdK3PfLQR7DcKwJ92XaxfMXdB5kK7wv1AwTBBUbtUZ5uj1oAN7ul/"
                data-testid="contact-facebook"
                className={`w-9 h-9 min-[1700px]:w-11 min-[1700px]:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${isScrolled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white'
                  : 'bg-white/20 text-white hover:bg-blue-600 backdrop-blur-sm'
                  }`}
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>

              <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

              <AdminLoginButton className="h-9 min-[1700px]:h-11" />

            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white backdrop-blur-sm z-40 xl:hidden"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            data-testid="mobile-contact-dropdown"
            className="xl:hidden fixed top-16 sm:top-20 lg:top-24 right-0 bottom-0 w-80 max-w-[85vw] bg-white/95 dark:bg-[#1a1c23]/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto"
          >
            {/* Mobile Menu Content */}
            <div className="p-6 space-y-6">

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Навигация
                </h3>
                {visibleNavigation.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 + (index * 0.05)
                    }}
                  >
                    <Link href={item.href}>
                      <span
                        data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/ /g, '-')}`}
                        className={`group relative block px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${isActiveRoute(item.href)
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:scale-105'
                          }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}

              </div>

              {/* Mobile Contact Section */}
              <div className="pt-6 pb-20 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Байланыс
                </h3>
                <div className="grid grid-cols-2 gap-3">

                  <motion.a
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.55 }}
                    href="tel:+77757906363"
                    data-testid="mobile-contact-phone"
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 hover:scale-105"
                    title="Телефон"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Телефон</span>
                  </motion.a>

                  <motion.a
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    href="https://wa.me/77757906363"
                    data-testid="mobile-contact-whatsapp"
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-105"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px] font-medium">WhatsApp</span>
                  </motion.a>

                  <motion.a
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.65 }}
                    href="https://t.me/bilimdi_urpaq"
                    data-testid="mobile-contact-telegram"
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105"
                    title="Telegram"
                  >
                    <Send className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Telegram</span>
                  </motion.a>

                  <motion.a
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    href="https://www.facebook.com/people/Bilimdi-Urpaq-School/pfbid0b3bkVb2Vz1B59RdK3PfLQR7DcKwJ92XaxfMXdB5kK7wv1AwTBBUbtUZ5uj1oAN7ul/"
                    data-testid="mobile-contact-facebook"
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105"
                    title="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Facebook</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ResponsiveNavbar;
