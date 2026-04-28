import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, BookOpen, ExternalLink, Award, TrendingUp, Users, Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EducationProcessPage() {
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
    const sections = ['quality', 'profile', 'literacy', 'it', 'kundelik'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">


      {/* Sub-Navigation Menu */}
      <div className="sticky top-[64px] sm:top-[80px] lg:top-[96px] z-30 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-gray-200 dark:border-blue-500/20 shadow-lg transition-all duration-500">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-start md:justify-center space-x-1 py-3 whitespace-nowrap overflow-x-auto scrollbar-hide w-full">
            <button
              onClick={() => document.getElementById('quality')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'quality' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Білім сапасы
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'quality' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>

            <button
              onClick={() => document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'profile' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Бейіндік оқыту
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'profile' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>

            <button
              onClick={() => document.getElementById('literacy')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'literacy' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Функционалдық сауаттылық
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'literacy' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>

            <button
              onClick={() => document.getElementById('it')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'it' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              IT және цифрлық сауаттылық
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'it' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>

            <button
              onClick={() => document.getElementById('kundelik')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'kundelik' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Күнделік
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'kundelik' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-12 pb-6 sm:pb-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Оқу <span className="text-blue-500">процесі</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            FGS мектебіндегі оқу бағдарламалары мен білім беру стандарты
          </p>
        </div>

        <div className="grid gap-8">

          
          {/* Education Quality Section */}
          <Card id="quality" className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-[#1e293b] border dark:border-gray-700 scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Білім сапасы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Сапа көрсеткіштері</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Жылдық үлгерім: 95% және жоғары</li>
                    <li>• НИШ/РФМШ түсу: &lt;50%</li>
                    <li>• Олимпиада жүлдегерлері: 25+ жыл сайын</li>
                    <li>• Халықаралық сертификаттар: IELTS, Cambridge</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Бағалау жүйесі</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Түсіндірмелі бағалау жүйесі</li>
                    <li>• Формативті және суммативті бағалау</li>
                    <li>• Ата-аналарға ай сайын есеп</li>
                    <li>• Электронды күнделік арқылы бақылау</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Education Section */}
          <Card id="profile" className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-[#1e293b] border dark:border-gray-700 scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Бейіндік оқыту</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border dark:border-blue-700">
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">Жаратылыстану-математикалық</h4>
                  <ul className="space-y-1 text-blue-700 dark:text-blue-400 text-sm">
                    <li>• Математика</li>
                    <li>• Физика</li>
                    <li>• Химия</li>
                    <li>• Биология</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border dark:border-green-700">
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">Гуманитарлық</h4>
                  <ul className="space-y-1 text-green-700 dark:text-green-400 text-sm">
                    <li>• Қазақ тілі мен әдебиеті</li>
                    <li>• Тарих</li>
                    <li>• География</li>
                    <li>• Қоғамтану</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border dark:border-purple-700">
                  <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">Шетел тілдері</h4>
                  <ul className="space-y-1 text-purple-700 dark:text-purple-400 text-sm">
                    <li>• Ағылшын тілі</li>
                    <li>• Орыс тілі</li>
                    <li>• Араб тілі</li>
                    <li>• Түрік тілі</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Functional Literacy Section */}
          <Card id="literacy" className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-[#1e293b] border dark:border-gray-700 scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Функционалдық сауаттылық</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Функционалдық сауаттылық - оқушылардың алған білімдерін өмірде практикалық қолдана білу қабілеттері.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Дамытылатын дағдылар:</h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Оқу сауаттылығы</li>
                      <li>• Математикалық сауаттылық</li>
                      <li>• Жаратылыстану сауаттылығы</li>
                      <li>• Цифрлық сауаттылық</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Әдістер:</h4>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Жобалық оқыту</li>
                      <li>• Проблемалық оқыту</li>
                      <li>• Зерттеу жұмыстары</li>
                      <li>• Практикалық тапсырмalar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Literacy & IT */}
          <Card id="it" className="hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-[#1e293b] border dark:border-gray-700 scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-800 dark:text-gray-100">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>IT құзіреттілік және сандық сауаттылық</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">IT дағдылары:</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Бағдарламалау негіздері (Python, Scratch)</li>
                    <li>• Веб-дизайн және HTML/CSS</li>
                    <li>• Microsoft Office пакеті</li>
                    <li>• Робототехника элементтері</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Сандық сауаттылық:</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Интернет қауіпсіздігі</li>
                    <li>• Цифрлық этика</li>
                    <li>• Ақпаратты сын көзбен бағалау</li>
                    <li>• Онлайн ресурстарды пайдалану</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Electronic Journal Link */}
          <Card id="kundelik" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 scroll-mt-24">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-300">Күнделік ЭЖ (Электронды журнал)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div>
                  <p className="text-green-700 dark:text-green-400 mb-2">
                    Оқушылардың үлгерімін, үй тапсырмаларын және кестені онлайн көру
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    Ата-аналар мен оқушылар үшін 24/7 қолжетімді
                  </p>
                </div>
                <Button 
                  className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600"
                  onClick={() => window.open('https://portal.kundelik.kz/v2', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Күнделікке өту
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}