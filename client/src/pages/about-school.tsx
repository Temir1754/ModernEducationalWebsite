import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  School, 
  GraduationCap, 
  Users, 
  Award, 
  Globe,
  Quote,
  BookOpen,
  Target,
  Sparkles,
  Lightbulb,
  Utensils,
  Laptop,
  Star,
  CheckCircle2
} from "lucide-react";
import SEOHead from "@/components/seo-head";

// Animated Number Component
function AnimatedNumber({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return <div ref={ref}>{count}{end >= 300 ? '+' : ''}</div>;
}

export default function AboutSchoolPage() {
  const schoolPhotos = [
    {
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      title: "Заманауи оқу сыныптары"
    },
    {
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
      title: "НИШ дайындық сабақтары"
    },
    {
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
      title: "Интерактивті оқыту"
    },
    {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      title: "Speaking Club"
    },
    {
      url: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800",
      title: "Шахмат үйірмесі"
    },
    {
      url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      title: "Робототехника"
    }
  ];

  return (
    <>
      <SEOHead page="about" />
      
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        {/* Header */}
        <div className="bg-white dark:bg-[#1e293b] shadow-sm border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Басты бетке оралу</span>
                <span className="sm:hidden">Басты бет</span>
              </Link>
              <div className="flex items-center space-x-2">
                <School className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Мектеп туралы
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-8 pb-12">
          
          {/* Photo Gallery with Animation */}
          <div className="mb-16 fade-in-delay-100">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Мектеп өмірі
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Біздің мектептің күнделікті өміріне көз жүгіртіңіз
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schoolPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  data-testid={`photo-${index}`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Caption on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {photo.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Director's Quote */}
          <div className="mb-16 fade-in-delay-200">
            <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-none shadow-xl overflow-hidden">
              <CardContent className="p-8 md:p-12 relative">
                {/* Quote Icon */}
                <div className="absolute top-4 left-4 opacity-10 dark:opacity-5">
                  <Quote className="w-24 h-24 text-blue-600" />
                </div>
                
                <div className="relative">
                  <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800 dark:text-gray-100 mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    "Әр бала – ел болашағы. Біздің міндетіміз – сол болашақты тәрбиелеу."
                  </blockquote>
                  
                  <div className="flex items-center space-x-4 mt-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      Б
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                        Бейсбаева Ж.М.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        FGS мектебінің директоры
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 4. Achievements Infographic */}
          <div className="mb-16 fade-in-delay-300">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Біздің жетістіктеріміз
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Мектептің қол жеткізген табыстары цифрларда
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Achievement 1 */}
              <div className="group">
                <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-[#1e293b] border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-500">
                  <CardContent className="p-0">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <AnimatedNumber end={300} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">оқушы</p>
                  </CardContent>
                </Card>
              </div>

              {/* Achievement 2 */}
              <div className="group">
                <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-[#1e293b] border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-500">
                  <CardContent className="p-0">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <AnimatedNumber end={40} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">білікті мұғалім</p>
                  </CardContent>
                </Card>
              </div>

              {/* Achievement 3 */}
              <div className="group">
                <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-[#1e293b] border-2 border-transparent hover:border-green-400 dark:hover:border-green-500">
                  <CardContent className="p-0">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <AnimatedNumber end={50} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">олимпиада жүлдегері</p>
                  </CardContent>
                </Card>
              </div>

              {/* Achievement 4 */}
              <div className="group">
                <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-[#1e293b] border-2 border-transparent hover:border-orange-400 dark:hover:border-orange-500">
                  <CardContent className="p-0">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <AnimatedNumber end={10} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">серіктес оқу орталығы</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* School Mission - Enhanced with cards and animations */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Мектеп миссиясы
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Біздің негізгі мақсаттар мен бағыттар
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Mission 1 */}
              <div className="group fade-in-delay-100">
                <Card className="h-full bg-white dark:bg-[#1e293b] border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-blue-500/20">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-3 text-center text-gray-800 dark:text-gray-100">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Заманауи білім
                      </span>
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-center text-sm leading-relaxed">
                      Оқушыларға заманауи білім беру және олардың творчестволық қабілеттерін дамыту
                    </p>
                    
                    {/* Tooltip on hover */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-xs text-blue-600 dark:text-blue-400 text-center font-medium">
                        💡 Инновациялық оқыту әдістері
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mission 2 */}
              <div className="group fade-in-delay-200">
                <Card className="h-full bg-white dark:bg-[#1e293b] border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-purple-500/20">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <Globe className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-3 text-center text-gray-800 dark:text-gray-100">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Жаһандық азамат
                      </span>
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-center text-sm leading-relaxed">
                      Ұлттық құндылықтарды сақтай отырып, жаһандық азамат тәрбиелеу
                    </p>
                    
                    {/* Tooltip on hover */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-xs text-purple-600 dark:text-purple-400 text-center font-medium">
                        🌍 Мәдениетаралық диалог
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mission 3 */}
              <div className="group fade-in-delay-300">
                <Card className="h-full bg-white dark:bg-[#1e293b] border-2 border-transparent hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-green-500/20">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                        <Target className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-3 text-center text-gray-800 dark:text-gray-100">
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Болашақ қамтамасыз ету
                      </span>
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-center text-sm leading-relaxed">
                      НИШ пен РФМШ-қа түсуге дайындау арқылы оқушылардың болашағын қамтамасыз ету
                    </p>
                    
                    {/* Tooltip on hover */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-xs text-green-600 dark:text-green-400 text-center font-medium">
                        🎯 50%+ оқушылар НИШ/РФМШ-та
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* School Advantages - Enhanced with glassmorphism */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Мектептің артықшылықтары
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Неліктен FGS-ті таңдау керек?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Advantage 1 */}
              <div className="group fade-in-delay-100">
                <Card className="relative h-full overflow-hidden bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm border-2 border-blue-200/50 dark:border-blue-700/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl dark:hover:shadow-blue-500/30">
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Top Program</span>
                    </div>
                  </div>

                  <CardContent className="p-8 pt-14">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-center">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Кішігірім сыныптар
                      </span>
                    </h4>
                    {/* ======================================== */}
                    {/* ИЗМЕНИТЬ ДИАПАЗОН КОЛИЧЕСТВА ДЕТЕЙ В КЛАССЕ */}
                    {/* Текущее значение: 12-18 */}
                    {/* Чтобы изменить, замените "12-18" на новое значение */}
                    {/* ======================================== */}
                    <p className="text-gray-700 dark:text-gray-300 text-center mb-2 font-medium">
                      12-18 оқушы сыныпта
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                      Әр балаға жеке көңіл бөлу мүмкіндігі
                    </p>
                    
                    {/* Checkmark on hover */}
                    <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Advantage 2 */}
              <div className="group fade-in-delay-200">
                <Card className="relative h-full overflow-hidden bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm border-2 border-purple-200/50 dark:border-purple-700/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl dark:hover:shadow-purple-500/30">
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Best Practice</span>
                    </div>
                  </div>

                  <CardContent className="p-8 pt-14">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Utensils className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-center">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Толық күтім
                      </span>
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-center mb-2 font-medium">
                      3 рет тамақ + тасымал
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                      Дені сау тамақтану және ыңғайлы логистика
                    </p>
                    
                    {/* Checkmark on hover */}
                    <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Advantage 3 */}
              <div className="group fade-in-delay-300">
                <Card className="relative h-full overflow-hidden bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 backdrop-blur-sm border-2 border-green-200/50 dark:border-green-700/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl dark:hover:shadow-green-500/30">
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <Lightbulb className="w-3 h-3" />
                      <span>Innovation</span>
                    </div>
                  </div>

                  <CardContent className="p-8 pt-14">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <Laptop className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-center">
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Заманауи технологиялар
                      </span>
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-center mb-2 font-medium">
                      Интерактивті оқыту
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                      Әлемдік стандарттарға сай білім беру жүйесі
                    </p>
                    
                    {/* Checkmark on hover */}
                    <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
