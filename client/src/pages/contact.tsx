import SEOHead from "@/components/seo-head";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Instagram, Facebook, Building, ArrowLeft, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ['info', 'social', 'management', 'location'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  const contactInfo = [
    {
      icon: MapPin,
      title: "Мекенжайымыз",
      content: "Шымкент қаласы, Енбекші ауданы",
      subtitle: "ӘӨЖ «FGS - Болашақ ұрпақ мектебі»"
    },
    {
      icon: Phone,
      title: "Телефон",
      content: "+7‒775‒790‒63‒63",
      subtitle: "Жұмыс уақытында хабарласыңыз"
    },
    {
      icon: Mail,
      title: "Электрондық пошта",
      content: "info@fgs-school.kz",
      subtitle: "Сұрақтарыңызды жібере аласыз"
    },
    {
      icon: Clock,
      title: "Жұмыс кестесі",
      content: "Дүйсенбі - Жұма: 08:00 - 17:00",
      subtitle: "Сенбі: 09:00 - 15:00"
    }
  ];

  const socialMedia = [
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/fgs.schoolkz/",
      color: "hover:text-pink-500",
      bgColor: "hover:bg-pink-50"
    },
    {
      name: "Telegram",
      icon: Send,
      url: "https://t.me/fgs_school",
      color: "hover:text-blue-500",
      bgColor: "hover:bg-blue-50"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://wa.me/77757906363",
      color: "hover:text-green-500",
      bgColor: "hover:bg-green-50"
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/people/Fgs-School/pfbid0b3bkVb2Vz1B59RdK3PfLQR7DcKwJ92XaxfMXdB5kK7wv1AwTBBUbtUZ5uj1oAN7ul/",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-50"
    }
  ];

  const departments = [
    {
      title: "Директор",
      name: "Жолдасбаева Гульжан Кенжебаевна",
      phone: "+7‒775‒790‒63‒63",
      email: "director@fgs-school.kz"
    },
    {
      title: "Оқу ісі жөніндегі директор орынбасары",
      name: "Сағындық Айгүл Сейткасымқызы",
      phone: "+7‒775‒790‒63‒63",
      email: "education@fgs-school.kz"
    },
    {
      title: "Тәрбие ісі жөніндегі директор орынбасары",
      name: "Қадірбекова Перуза Несіпбайқызы",
      phone: "+7‒775‒790‒63‒63",
      email: "upbringing@fgs-school.kz"
    }
  ];

  return (
    <>
      <SEOHead page="contact" />

      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        {/* Header with Back Button - Enhanced for mobile */}
        

        {/* Sub-Navigation Menu */}
        <div className="sticky top-[64px] sm:top-[80px] lg:top-[96px] z-30 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-gray-200 dark:border-blue-500/20 shadow-lg transition-all duration-500">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-start md:justify-center space-x-1 py-3 whitespace-nowrap overflow-x-auto scrollbar-hide w-full [&>*]:shrink-0">
              <button
                onClick={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'info' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Байланыс деректері
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'info' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('social')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'social' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Әлеуметтік желілер
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'social' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('management')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'management' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Басшылық
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'management' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'location' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Мекенжай
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'location' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-12 pb-6 sm:pb-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Бізбен <span className="text-blue-500">байланыс</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Бізбен хабарласып, сұрақтарыңызды қойыңыз. Біз сіздерге көмектесуге әрдайым дайынбыз.
          </p>
        </div>


          {/* Contact Information Cards */}
          <div id="info" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 scroll-mt-24">
            {contactInfo.map((info, index) => {
              const isAddress = info.title === "Мекенжайымыз";
              const cardClasses = "bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-lg transition-all duration-300 border dark:border-gray-700 h-full flex flex-col items-center justify-center";
              const hoverClasses = isAddress
                ? "hover:shadow-xl hover:scale-105 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer active:scale-95"
                : "hover:shadow-xl";

              const content = (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <info.icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                      {info.content}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {info.subtitle}
                    </p>
                  </div>
                </>
              );

              if (isAddress) {
                return (
                  <a
                    key={index}
                    href="https://2gis.kz/shymkent/firm/70000001062533686"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cardClasses} ${hoverClasses}`}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div key={index} className={`${cardClasses} ${hoverClasses}`}>
                  {content}
                </div>
              );
            })}
          </div>

          {/* Social Media Section */}
          <div id="social" className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg p-6 mb-6 border dark:border-gray-700 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
              Әлеуметтік желілер
            </h2>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 ${social.bgColor} dark:bg-gray-800/50 ${social.color} dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <social.icon className="w-12 h-12 mb-3 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:animate-bounce" />
                  <span className="font-semibold text-gray-800 dark:text-white transition-colors duration-300">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Departments Section */}
          <div id="management" className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6 border dark:border-gray-700 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
              Басшылық
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-md border dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <Building className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {dept.title}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{dept.name}</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <a href={`tel:${dept.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {dept.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <a href={`mailto:${dept.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {dept.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map and Address Section */}
          <div id="location" className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg p-6 border dark:border-gray-700 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
              Біздің орналасуымыз
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Мекенжай ақпараты
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        ӘӨЖ «FGS - Болашақ ұрпақ мектебі»
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Шымкент қаласы, Енбекші ауданы
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Жұмыс уақыты:</p>
                      <p className="text-gray-600 dark:text-gray-300">Дүйсенбі - Жұма: 08:00 - 17:00</p>
                      <p className="text-gray-600 dark:text-gray-300">Сенбі: 09:00 - 15:00</p>
                      <p className="text-gray-600 dark:text-gray-300">Жексенбі: Демалыс</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-600 dark:bg-blue-900/30 text-white p-6 rounded-xl border dark:border-blue-700">
                <h3 className="text-xl font-semibold mb-4">
                  Келіп көріңіз!
                </h3>
                <p className="text-blue-100 dark:text-blue-200 leading-relaxed mb-4">
                  Мектебімізбен танысу үшін алдын ала хабарласып, кездесу уақытын
                  белгілеуіңізді сұраймыз.
                </p>
                <div className="space-y-2">
                  <p className="text-blue-100 dark:text-blue-200">📞 Телефон: +7‒775‒790‒63‒63</p>
                  <p className="text-blue-100 dark:text-blue-200">📧 Email: info@fgs-school.kz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}