import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, Users, Mail, Phone, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdministrationPage() {
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
    const sections = ['directors', 'contact'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  const administrators = [
    {
      name: "Бейсбаева Жұлдыз Мейіржанқызы",
      position: "Мектеп директоры",
      education: "Назарбаев Университет",
      experience: "2 жыл педагогикалық тәжірибе",
      email: "fgs.school.2022@gmail.com",
      phone: "+7-775-790-63-63"
    },
    {
      name: "Сарсенбаева Алия Раманкуловна",
      position: "Оқу ісі жөніндегі директордың орынбасары",
      education: "Халықаралық Қазақ Түрік университеті",
      experience: "32 жыл педагогикалық тәжірибе",
      email: "fgs.school.2022@gmail.com",
      phone: "+7-775-790-63-63"
    },
    {
      name: "Утепбаева Махаббат Анарбековна",
      position: "Тәрбие ісі жөніндегі директордың орынбасары",
      education: "Халықаралық Қазақ Түрік университеті",
      experience: "37 жыл педагогикалық тәжірибе",
      email: "fgs.school.2022@gmail.com",
      phone: "+7-775-790-63-63"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      

      {/* Sub-Navigation Menu */}
      <div className="sticky top-16 sm:top-20 lg:top-24 z-30 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-gray-200 dark:border-blue-500/20 shadow-lg transition-all duration-500">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-start md:justify-center space-x-1 py-3 whitespace-nowrap overflow-x-auto scrollbar-hide w-full [&>*]:shrink-0">
            <button
              onClick={() => document.getElementById('directors')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'directors' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Басшылық құрам
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'directors' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>

            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'contact' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Кері байланыс
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'contact' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12 pb-12 sm:pt-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Мектеп <span className="text-blue-500">әкімшілігі</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            FGS мектебінің әкімшілік құрамы — өз ісінің шеберлері мен жоғары білікті мамандар жиынтығы.
          </p>
        </div>

        <div id="directors" className="grid grid-cols-1 gap-10 max-w-5xl mx-auto scroll-mt-24">
          {administrators.map((admin, index) => (
            <div key={index} className="group relative">
              <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <CardContent className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                    {/* Avatar Block */}
                    <div className="relative">
                      <div className="w-48 h-48 rounded-[2rem] bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-2xl transform group-hover:rotate-3 transition-transform duration-500">
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-950 rounded-[1.8rem] flex items-center justify-center overflow-hidden">
                          <Users className="w-24 h-24 text-slate-300 dark:text-slate-800" />
                        </div>
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 whitespace-nowrap">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-blue-500">FGS Staff</span>
                      </div>
                    </div>
                    
                    {/* Info Block */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="mb-6">
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{admin.name}</h3>
                        <div className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-500 rounded-full text-sm font-bold uppercase tracking-wide">
                          {admin.position}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-left">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-2 tracking-widest">Білімі</p>
                          <p className="text-slate-700 dark:text-slate-200 font-medium leading-tight">{admin.education}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-2 tracking-widest">Тәжірибе</p>
                          <p className="text-slate-700 dark:text-slate-200 font-medium leading-tight">{admin.experience}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <a 
                          href={`mailto:${admin.email}`}
                          className="flex items-center gap-3 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                        >
                          <Mail className="w-5 h-5" />
                          <span>Хабарлама жазу</span>
                        </a>
                        <a 
                          href={`tel:${admin.phone.replace(/[-\s]/g, '')}`}
                          className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
                        >
                          <Phone className="w-5 h-5" />
                          <span>Хабарласу</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Contact Footer Block */}
        <div id="contact" className="mt-20 max-w-5xl mx-auto scroll-mt-24">
          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900/80 dark:to-slate-950/80 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Phone className="w-32 h-32 text-blue-500" />
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Әкімшілікпен байланысу</h3>
                <p className="text-slate-400">Кез келген сұрақтарыңыз бойынша бізбен байланыса аласыз. Біз әрқашан ашықпыз!</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Жұмыс уақыты</p>
                    <p className="font-medium">Дүйсенбі - жұма, 08:00 - 18:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Қабылдау уақыты</p>
                    <p className="font-medium">Сәрсенбі, 14:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
