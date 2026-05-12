import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, ChevronDown, Sparkles, Trophy, Lightbulb, Palette, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, Plus, Trash2 } from "lucide-react";
import type { SiteContent } from "@shared/schema";

export default function KruzhkiPage() {
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
    const sections = ['creative', 'intellectual', 'sports'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [uploadingClub, setUploadingClub] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch dynamic content (images)
  const { data: content = [] } = useQuery<SiteContent[]>({
    queryKey: ["/api/content"],
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      // Find if entry exists
      const existing = content.find(c => c.key === key);
      if (existing) {
        const res = await fetch(`/api/content/${existing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
          credentials: "include"
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to update content");
        }
        return res.json();
      } else {
        const res = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value, lang: "kz", type: "image" }),
          credentials: "include"
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to create content");
        }
        return res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setIsUploadDialogOpen(false);
      setUploadingClub(null);
    },
    onError: (error: Error) => {
      console.error("Content update error:", error);
      alert("Қате / Ошибка: " + error.message);
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingClub) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.message || "Upload failed");
      }
      const { url } = await uploadRes.json();

      const key = `club_image_${uploadingClub.toLowerCase().replace(/\s+/g, '_')}`;
      await updateContentMutation.mutateAsync({ key, value: url });
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Қате / Ошибка: " + (error.message || "Файлды жүктеу сәтсіз аяқталды"));
    } finally {
      setIsUploading(false);
    }
  };

  const getClubImage = (clubName: string, defaultImage: string) => {
    const key = `club_image_${clubName.toLowerCase().replace(/\s+/g, '_')}`;
    const dynamic = content.find(c => c.key === key);
    return dynamic ? dynamic.value : defaultImage;
  };

  const clubsData = [
    {
      id: "creative",
      category: "Шығармашылық бағыт",
      icon: <Palette className="w-5 h-5" />,
      color: "from-pink-500 to-purple-600",
      clubs: [
        {
          name: "Хореография",
          description: "Классикалық және заманауи билерді үйрену, пластика және ритм дамыту",
          image: getClubImage("Хореография", "https://images.unsplash.com/photo-1545224144-b38cd309ef69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі, Жұма: 15:00-16:30",
          age: "5-15 жас",
          teacher: "Өмірзақ Мөлдір Абдуллақызы"
        },
        {
          name: "Домбыра",
          description: "Қазақтың ұлттық аспабын үйрену, фольклорлық әндерді орындау",
          image: getClubImage("Домбыра", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Сейсенбі, Бейсенбі: 16:00-17:00",
          age: "6-16 жас",
          teacher: "Ержанова Жадыра Нурдуллаевна"
        },
        {
          name: "Дизайн",
          description: "Графикалық дизайн, сурет салу және шығармашылық жобалар",
          image: getClubImage("Дизайн", "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі: 14:30-16:00",
          age: "8-16 жас",
          teacher: "Аманбек Жансая Тимурханқызы"
        },
        {
          name: "Глинолепка",
          description: "Балшықпен жұмыс істеу, керамика және мүсін жасау",
          image: getClubImage("Глинолепка", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Сейсенбі, Жұма: 15:30-17:00",
          age: "5-14 жас",
          teacher: "Кендебайұлы Шынболат"
        }
      ]
    },
    {
      id: "intellectual",
      category: "Интеллектуалды бағыт",
      icon: <Lightbulb className="w-5 h-5" />,
      color: "from-blue-500 to-indigo-600",
      clubs: [
        {
          name: "Робототехника",
          description: "Lego роботтарын құрастыру, программалау және басқару",
          image: getClubImage("Робототехника", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі, Жұма: 16:00-17:30",
          age: "7-15 жас",
          teacher: "Ускенбаева Сая Жоланбаевна"
        },
        {
          name: "Шахмат",
          description: "Шахмат ойынының негіздері, тактика және стратегия үйрену",
          image: getClubImage("Шахмат", "/gallery/chess.jpg"),
          schedule: "Сейсенбі, Бейсенбі: 15:00-16:30",
          age: "6-16 жас",
          teacher: "Байшоинова Сания Тузельбаевна"
        },
        {
          name: "Speaking Club",
          description: "Ағылшын тілінде сөйлеу дағдыларын дамыту және коммуникация",
          image: getClubImage("Speaking Club", "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі: 17:00-18:00",
          age: "8-16 жас",
          teacher: "Нұрланқызы Жанеля"
        },
        {
          name: "Дебат",
          description: "Пікірталас дағдылары, сын тұрғысынан ойлау және дәлелдеу",
          image: getClubImage("Дебат", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Сейсенбі, Жұма: 16:30-18:00",
          age: "10-16 жас",
          teacher: "Аширбекова Гулмира Султановна"
        }
      ]
    },
    {
      id: "sports",
      category: "Спорттық бағыт",
      icon: <Trophy className="w-5 h-5" />,
      color: "from-green-500 to-emerald-600",
      clubs: [
        {
          name: "Тэквондо",
          description: "Корей жекпе-жегі, өзін-өзі қорғау және физикалық дайындық",
          image: getClubImage("Тэквондо", "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі, Жұма: 17:30-19:00",
          age: "6-16 жас",
          teacher: "Камытбаев Айдын Сыпабекович"
        },
        {
          name: "Футбол",
          description: "Командалық ойын, техника және тактика дамыту",
          image: getClubImage("Футбол", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Сейсенбі, Бейсенбі, Сенбі: 16:00-17:30",
          age: "7-16 жас",
          teacher: "Юзыкаев Жасулан Серикбайулы"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      {/* Sub-Navigation Menu - Exactly like in the photo but with requested items */}
      <div className="sticky top-16 sm:top-20 lg:top-24 z-30 bg-[#111827]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-500">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-start md:justify-center space-x-2 py-4 whitespace-nowrap overflow-x-auto scrollbar-hide w-full [&>*]:shrink-0">
            {clubsData.map((category) => (
              <button
                key={category.id}
                onClick={() => document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={`px-6 py-2.5 text-[14px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === category.id 
                  ? "text-white bg-blue-600/20 ring-1 ring-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {category.icon}
                  {category.category}
                </span>
                {activeSection === category.id && (
                  <motion.span 
                    layoutId="activeSubNav"
                    className="absolute inset-0 bg-blue-600/10 rounded-full -z-0"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-12 pb-6 sm:pt-16 sm:pb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">
            Мектеп <span className="text-blue-600">үйірмелері</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
            Балаларыңыздың қызығушылықтары мен талантын дамытатын көптеген бағыттар
          </p>
        </div>
      </div>

      {/* Clubs by Category */}
      {clubsData.map((category, categoryIndex) => (
        <section key={categoryIndex} id={category.id} className="py-20 scroll-mt-32 border-b border-gray-100 dark:border-gray-800 last:border-0">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-3xl bg-gradient-to-br ${category.color} text-white shadow-xl`}>
                  {category.icon}
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {category.category}
                </h2>
              </div>
              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 ml-8"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.clubs.map((club, clubIndex) => (
                <Card key={clubIndex} className="group overflow-hidden rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-blue-900/20 transition-all duration-500 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-auto transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-40`}></div>
                    
                    {isAdmin && (
                      <div className="absolute top-4 right-4 z-20">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-blue-600 transition-all shadow-lg"
                          onClick={() => {
                            setUploadingClub(club.name);
                            setIsUploadDialogOpen(true);
                          }}
                        >
                          <Camera className="w-5 h-5" />
                        </Button>
                      </div>
                    )}

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-xs font-bold uppercase tracking-widest">
                        {club.age}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                      {club.description}
                    </p>
                    
                    <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-4 text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Кесте</p>
                          {club.schedule}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mr-4 text-purple-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Мұғалім</p>
                          {club.teacher}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Contact for Registration */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 pointer-events-none opacity-5 dark:opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[4rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-600/30 mb-10">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
              Болашақты <span className="text-blue-600">бірге</span> қалайық
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Балаңызды қызықтыратын үйірмелерге жазылу үшін біздің мектеп әкімшілігімен байланысыңыз. 
              Біз сізге барлық қажетті ақпаратты беруге дайынбыз.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="tel:+77757906363"
                className="inline-flex items-center px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg rounded-[2rem] hover:scale-105 transition-all duration-300 shadow-2xl shadow-slate-900/20"
              >
                <Phone className="w-6 h-6 mr-3" />
                Хабарласу
              </a>
              
              <a
                href="https://wa.me/77757906363"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-10 py-5 bg-green-500 text-white font-black text-lg rounded-[2rem] hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/20"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Суретті жаңарту: {uploadingClub}
            </DialogTitle>
            <DialogDescription className="text-slate-400 dark:text-slate-300">
              Осы үйірме үшін жаңа мұқаба суретін жүктеңіз
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="club-photo" className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                Фото таңдау
              </Label>
              <Input
                id="club-photo"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer text-white file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-blue-100 transition-all bg-slate-800 border-slate-700"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-center sm:justify-center pt-2">
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-600 font-bold animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                Жүктелуде...
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}