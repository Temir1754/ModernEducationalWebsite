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
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import SEOHead from "@/components/seo-head";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import type { Media } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    const sections = ['gallery', 'stats', 'director', 'advantages'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  const { user } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { data: schoolPhotos = [], isLoading: isGalleryLoading } = useQuery<Media[]>({
    queryKey: ["/api/media", "about-school"],
    queryFn: async () => {
      const res = await fetch("/api/media?section=about-school");
      if (!res.ok) return [];
      return res.json();
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!uploadFile) return;

      const formData = new FormData();
      formData.append("file", uploadFile);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Жүктеу сәтсіз аяқталды");
      const { url } = await uploadRes.json();

      const mediaRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image",
          url,
          caption: uploadTitle,
          section: "about-school"
        }),
      });

      if (!mediaRes.ok) throw new Error("Сақтау мүмкін болмады");
      return mediaRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media", "about-school"] });
      setIsUploadOpen(false);
      setUploadFile(null);
      setUploadTitle("");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Өшіру мүмкін болмады");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media", "about-school"] });
    }
  });

  const handleNext = useCallback(() => {
    if (selectedImageIndex === null || schoolPhotos.length === 0) return;
    setSelectedImageIndex((selectedImageIndex + 1) % schoolPhotos.length);
  }, [selectedImageIndex, schoolPhotos]);

  const handlePrev = useCallback(() => {
    if (selectedImageIndex === null || schoolPhotos.length === 0) return;
    setSelectedImageIndex((selectedImageIndex - 1 + schoolPhotos.length) % schoolPhotos.length);
  }, [selectedImageIndex, schoolPhotos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedImageIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handleNext, handlePrev]);

  return (
    <>
      <SEOHead page="about" />
      
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        

        {/* Sub-Navigation Menu */}
        <div className="sticky top-16 sm:top-20 lg:top-24 z-30 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-gray-200 dark:border-blue-500/20 shadow-lg transition-all duration-500">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-start md:justify-center space-x-1 py-3 whitespace-nowrap overflow-x-auto scrollbar-hide w-full [&>*]:shrink-0">
              <button
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'gallery' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Мектеп өмірі
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'gallery' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'stats' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Статистика
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'stats' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('director')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'director' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Директор сөзі
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'director' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('advantages')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'advantages' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Ерекшеліктер
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'advantages' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>
            </nav>
          </div>
        </div>

        {/* Photo Gallery with Animation */}
        <div id="gallery" className="container mx-auto px-4 pt-12 pb-12 scroll-mt-24">
          
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Мектеп <span className="text-blue-500">туралы</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Білімді ұрпақ жекеменшік мектебінің тарихы, құндылықтары мен заманауи мүмкіндіктері
            </p>
            
            {/* Admin Upload Button */}
            {user && (
              <div className="mt-8">
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Фото қосу
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-[#0f172a] border-none shadow-[0_0_50px_rgba(0,0,0,0.3)] max-w-md w-[95vw] rounded-[2rem] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                    <DialogHeader className="pt-6">
                      <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white text-center">Фото жүктеу</DialogTitle>
                      <DialogDescription className="text-center text-gray-500 dark:text-gray-400">
                        Бөлімге жаңа фотосурет қосыңыз
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => uploadMutation.mutate(e)} className="space-y-6 pt-4 pb-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Фото таңдаңыз</Label>
                        <div className="relative group/input">
                          <Input
                            type="file"
                            id="school-photo-upload"
                            accept="image/*"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            required
                            className="hidden"
                          />
                          <label 
                            htmlFor="school-photo-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-blue-500/30 rounded-2xl bg-gray-50 dark:bg-blue-900/10 hover:bg-gray-100 dark:hover:bg-blue-900/20 hover:border-blue-500 transition-all cursor-pointer group"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors mb-2" />
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {uploadFile ? uploadFile.name : "Файлды таңдау үшін басыңыз"}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                PNG, JPG немесе WEBP (макс. 10MB)
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Тақырыбы (міндетті емес)</Label>
                        <Input
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder="Мысалы: Робототехника сабағы"
                          className="h-12 bg-gray-50 dark:bg-blue-900/10 border-gray-200 dark:border-blue-500/20 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={uploadMutation.isPending || !uploadFile} 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transform active:scale-[0.98] transition-all"
                      >
                        {uploadMutation.isPending ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            Жүктелуде...
                          </>
                        ) : (
                          "Жүктеу"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          <div className="mb-16 fade-in-delay-100">
            {isGalleryLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              </div>
            ) : schoolPhotos.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                Суреттер әзірге жоқ. Админ панель арқылы қосыңыз.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {schoolPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <div 
                      className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || "Мектеп суреті"}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    
                    {/* Admin Delete Button */}
                    {user && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Өшіруді растайсыз ба?")) {
                            deleteMutation.mutate(photo.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}

                    {/* Caption on hover */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end cursor-pointer"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <div className="p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-semibold text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {photo.caption}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* School Statistics Section - Moved from Students Page with Premium Style */}
          <div id="stats" className="mb-20 scroll-mt-24">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
              {[
                { number: 180, label: "Оқушылар саны", icon: Users, color: "blue" },
                { number: 9, label: "Сынып деңгейлері", icon: GraduationCap, color: "purple", suffix: " (0-9)" },
                { number: 18, label: "Сыныптағы оқушылар", icon: BookOpen, color: "emerald", prefix: "12-" },
                { number: 95, label: "Табысты бітірушілер", icon: Award, color: "amber", suffix: "%" }
              ].map((stat, index) => (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-${stat.color}-500/5 rounded-3xl blur-xl group-hover:bg-${stat.color}-500/10 transition-colors`} />
                  <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                    </div>
                    <div className={`text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center justify-center`}>
                      {stat.prefix}
                      <AnimatedNumber end={stat.number} />
                      {stat.suffix}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                      {stat.label}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Director's Quote - Premium Redesign */}
          <div id="director" className="mb-20 fade-in-delay-200 scroll-mt-24">
            <div className="relative max-w-5xl mx-auto">
              {/* Decorative Background Glows */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px]" />
              
              <Card className="relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-[3rem] shadow-2xl">
                <CardContent className="p-10 md:p-16 relative z-10">
                  {/* Large Quote Icon */}
                  <div className="absolute top-8 left-8 opacity-20 dark:opacity-10">
                    <Quote className="w-32 h-32 text-blue-500" strokeWidth={1} />
                  </div>
                  
                  <div className="relative flex flex-col items-center text-center">
                    <blockquote className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-10 leading-tight tracking-tight italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      "Әр бала – ел болашағы. <br className="hidden md:block" />
                      Біздің міндетіміз – сол болашақты тәрбиелеу."
                    </blockquote>
                    
                    <div className="flex flex-col items-center">
                      {/* Avatar Circle with Glow */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-lg opacity-50" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1">
                          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-3xl font-black">
                            Б
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          Бейсбаева Ж.М.
                        </p>
                        <p className="text-blue-500 font-bold uppercase tracking-widest text-xs">
                          Білімді ұрпақ жекеменшік мектебінің директоры
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>



          {/* Bento Grid: Mission & Advantages Combined */}
          <div id="advantages" className="mb-16 scroll-mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Біздің ерекшеліктеріміз бен құндылықтарымыз
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Білімді ұрпақ жекеменшік мектебін таңдаудың 6 негізгі себебі — бір жерде жинақталған
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto px-4">
              {/* 1. NIS/RFMSH Preparation - Large (2x2) */}
              <div className="md:col-span-2 md:row-span-2 group">
                <Card className="h-full relative overflow-hidden bg-gradient-to-br from-emerald-600/20 to-green-900/40 border border-emerald-500/30 backdrop-blur-md rounded-3xl p-8 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
                  <div className="absolute top-6 right-6">
                    <div className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      Результат
                    </div>
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform group-hover:rotate-6 transition-transform">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">Болашақты қамтамасыз ету</h3>
                      <p className="text-emerald-50/70 text-lg leading-relaxed">
                        НИШ пен РФМШ-қа түсуге арналған авторлық бағдарлама. Оқушыларымыздың 50%-дан астамы еліміздің үздік мектептеріне грантқа түседі.
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-3 text-emerald-400 font-bold">
                      <Award className="w-6 h-6" />
                      <span>50%+ грант иегерлері</span>
                    </div>
                  </div>
                  {/* Decorative background element */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
                </Card>
              </div>

              {/* 2. Small Classes (2x1) */}
              <div className="md:col-span-2 group">
                <Card className="h-full relative overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-900/40 border border-blue-500/30 backdrop-blur-md rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Кішігірім сыныптар</h3>
                      <p className="text-blue-50/70 text-sm">
                        Сыныпта 12-18 оқушы. Әр балаға жеке көңіл бөліп, потенциалын ашуға мүмкіндік береміз.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 3. Full Care (1x1) */}
              <div className="group">
                <Card className="h-full relative overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-900/40 border border-purple-500/30 backdrop-blur-md rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-12 transition-transform">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Толық күтім</h3>
                  <p className="text-purple-50/70 text-xs">
                    3 рет тамақ + тасымал. Дені сау ұрпақ.
                  </p>
                </Card>
              </div>

              {/* 4. Modern Education (1x1) */}
              <div className="group">
                <Card className="h-full relative overflow-hidden bg-gradient-to-br from-indigo-600/20 to-blue-900/40 border border-indigo-500/30 backdrop-blur-md rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 text-center">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-12 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Сапалы білім</h3>
                  <p className="text-indigo-50/70 text-xs">
                    Қазақ және орыс тілдерінде оқыту.
                  </p>
                </Card>
              </div>

              {/* 5. Global Citizen (2x1) */}
              <div className="md:col-span-2 group">
                <Card className="h-full relative overflow-hidden bg-gradient-to-r from-pink-600/20 to-rose-900/40 border border-pink-500/30 backdrop-blur-md rounded-3xl p-6 hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Жаһандық азамат</h3>
                      <p className="text-pink-50/70 text-sm">
                        Ұлттық құндылықтар мен әлемдік стандарттарды ұштастыра отырып, болашақ көшбасшыларды тәрбиелейміз.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 6. Modern Technologies (2x1) */}
              <div className="md:col-span-2 group">
                <Card className="h-full relative overflow-hidden bg-gradient-to-r from-teal-600/20 to-cyan-900/40 border border-teal-500/30 backdrop-blur-md rounded-3xl p-6 hover:shadow-2xl transition-all duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Laptop className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Заманауи технологиялар</h3>
                      <p className="text-teal-50/70 text-sm">
                        Интерактивті оқыту және IT дағдыларын қалыптастыру. Әр сынып заманауи жабдықтармен қамтамасыз етілген.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* Image Modal Dialog (Lightbox) */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={() => setSelectedImageIndex(null)}>
        <DialogContent className="max-w-[100vw] w-screen h-screen p-0 bg-black/95 border-none flex flex-col items-center justify-center" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Суретті толық көлемде көру</DialogTitle>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <DialogClose className="absolute top-6 right-6 bg-white/10 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/20 transition-all z-50">
              <X className="w-8 h-8" />
            </DialogClose>

            {/* Previous Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 sm:left-10 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all transform hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Image Container */}
            <div className="w-full h-full p-4 flex flex-col items-center justify-center select-none">
              <AnimatePresence mode="wait">
                {selectedImageIndex !== null && schoolPhotos[selectedImageIndex] && (
                  <motion.div 
                    key={selectedImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative max-w-5xl max-h-[85vh] group flex flex-col items-center"
                  >
                    <img
                      src={schoolPhotos[selectedImageIndex].url}
                      alt={schoolPhotos[selectedImageIndex].caption || "Үлкейтілген сурет"}
                      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    />
                    {schoolPhotos[selectedImageIndex].caption && (
                      <div className="absolute -bottom-16 left-0 right-0 text-center">
                        <p className="text-white text-lg font-medium drop-shadow-md">
                          {schoolPhotos[selectedImageIndex].caption}
                        </p>
                      </div>
                    )}
                    {/* Counter */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-white/60 font-mono text-sm">
                      {selectedImageIndex + 1} / {schoolPhotos.length}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 sm:right-10 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all transform hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
