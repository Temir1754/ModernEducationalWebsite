import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SchoolCards from "@/components/school-cards";
import {
  Phone,
  Clock,
  MapPin,
  BookOpen,
  Utensils,
  Bus,
  Check,
  Instagram,
  Send,
  MessageCircle,
  Share2,
  X,
  Star,
  Users,
  Award,
} from "lucide-react";
import logoImage from "@assets/WhatsApp Image 2025-08-01 at 14.18.59_1754990832045.jpeg";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/seo-head";
import StructuredData from "@/components/structured-data";
import MobileAccordion from "@/components/mobile-accordion";
import MobileOlympiadAccordion from "@/components/mobile-olympiad-accordion";
import MobileDevelopmentCarousel from "@/components/mobile-development-carousel";
import MobileSchoolFactsSlides from "@/components/mobile-school-facts-slides";
import MobileNewsSlides from "@/components/mobile-news-slides";

import WhatsApp_Image_2025_08_15_at_18_02_15 from "@assets/WhatsApp Image 2025-08-15 at 18.02.15.jpeg";
import sportsPhoto from "@assets/9E3A2784_1760360997075.jpg";
import creativePhoto from "@assets/9E3A6284_1760361922943.jpg";
import intellectualPhoto from "@assets/9E3A8933_1760362017762.jpg";
import student2 from "@assets/untitled-2030_1760364226199.jpg";
import student3 from "@assets/untitled-2036_1760364229159.jpg";
import student4 from "@assets/untitled-2038_1760364231925.jpg";


import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import type { News } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";

export default function Home() {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  // News Management
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newNews, setNewNews] = useState({ title: "", body: "", dateText: "", coverUrl: "" });

  const { data: newsItems = [] } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const addNewsMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNews),
      });
      if (!res.ok) throw new Error("Failed to add news");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setIsAddNewsOpen(false);
      setNewNews({ title: "", body: "", dateText: "", coverUrl: "" });
    }
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/news/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    }
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update news");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setIsAddNewsOpen(false);
      setEditingNewsId(null);
      setNewNews({ title: "", body: "", dateText: "", coverUrl: "" });
    }
  });

  const handleEditNews = (article: any) => {
    setEditingNewsId(article.id);
    setNewNews({
      title: article.title,
      body: article.description,
      dateText: article.date,
      coverUrl: article.image,
    });
    setIsAddNewsOpen(true);
  };

  // Map DB news to component format
  const formattedNews = newsItems.map(item => ({
    id: item.id,
    title: item.title,
    description: item.body,
    date: item.dateText,
    image: item.coverUrl || "/api/placeholder/300/200",
    category: "Жаңалықтар" // Default or add category field later
  }));


  const features = [
    {
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      title: "Сапалы білім беру",
      description: "0-9 сыныптары үшін қазақ және орыс тілдерінде сабақ",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      fullInfo: {
        schedule: "Оқушылар 08:00-дан 18:00-ге дейін оқиды",
        homework: "Үй жұмысы мектепте орындалады",
        homeTime: "Үйге тек демалу үшін барады",
        mainDescription: "Біздің мектебіміз 0-9 сыныптары үшін толық білім беру бағдарламасын қазақ және орыс тілдерінде ұсынады. Заманауи оқыту әдістемелерін қолдана отырып, әр балаға жеке тәсіл қолданамыз. Мектепте үй жұмысын орындауға арналған арнайы уақыт бөлінген, сондықтан балалар үйге тек демалу үшін барады.",
        details: [
          "Қазақ және орыс тілдерінде сапалы білім беру",
          "0-9 сыныптары үшін толық бағдарлама",
          "Заманауи оқыту әдістемелері",
          "Жеке тәсіл әр баланың қажеттіліктеріне",
          "Мектепте үй жұмысын орындау уақыты бар"
        ]
      }
    },
    {
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      title: "Үш разы тамақ",
      description: "Балансталған және дәмді тамақ ас мәзірі күн сайын",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      fullInfo: {
        schedule: "Оқушылар 08:00-дан 18:00-ге дейін оқиды",
        homework: "Үй жұмысы мектепте орындалады",
        homeTime: "Үйге тек демалу үшін барады",
        mainDescription: "Мектебімізде балалардың денсаулығы мен дұрыс дамуын қамтамасыз ету үшін күнделікті үш рет сапалы тамақпен қамтамасыз етеміз. Диетолог мамандармен бірлесе жасалған мәзір балалардың жас ерекшеліктеріне сәйкес келеді. Таңғы ас, түскі ас және бесін ас - барлығы таза, дәмді және пайдалы тағамдардан тұрады.",
        details: [
          "Таңғы ас, түскі ас және бесін ас",
          "Балансталған және пайдалы тағамдар",
          "Жас ерекшеліктеріне сәйкес мәзір",
          "Диетолог мамандармен жасалған тағам",
          "Таза және дәмді тамақтар күн сайын"
        ]
      }
    },
    {
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      title: "Оқушы тасымалы",
      description: "Қауіпсіз және ыңғайлы көлік қызметі",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      fullInfo: {
        schedule: "Оқушылар 08:00-дан 18:00-ге дейін оқиды",
        homework: "Үй жұмысы мектепте орындалады",
        homeTime: "Үйге тек демалу үшін барады",
        mainDescription: "Мектептен кейін оқушыларымызды Hyundai Starex H2 заманауи және кең көлігінде үйіне дейін жеткіземіз. Тәжірибелі жүргізушілер, таза салон және жайлы орындықтар – ата-аналар үшін тыныштық, балалар үшін – ыңғайлы жол.",
        details: [
          "Hyundai Starex H2 заманауи және кең көлігі",
          "Тәжірибелі және жауапты жүргізушілер",
          "Таза салон және жайлы орындықтар",
          "Ата-аналар үшін толық тыныштық",
          "Балалар үшін қауіпсіз және ыңғайлы жол",
          "Мектептен үйге дейін толық қызмет",
          "Барлық қауіпсіздік талаптарына сәйкес"
        ]
      }
    },
  ];

  const clubs = [
    {
      name: "Робототехника",
      icon: "fas fa-robot",
      color: "blue",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Шахматы",
      icon: "fas fa-chess",
      color: "green",
      image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Speaking Club",
      icon: "fas fa-comments",
      color: "purple",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Хореография",
      icon: "fas fa-dance",
      color: "pink",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Глинолепка",
      icon: "fas fa-hand-paper",
      color: "orange",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Тэквондо",
      icon: "fas fa-fist-raised",
      color: "red",
      image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Дебаты",
      icon: "fas fa-microphone",
      color: "indigo",
      image: "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Домбыра",
      icon: "fas fa-music",
      color: "teal",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Дизайн",
      icon: "fas fa-paint-brush",
      color: "cyan",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Футбол",
      icon: "fas fa-futbol",
      color: "green",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
  ];



  return (
    <>
      <SEOHead page="home" />
      <StructuredData type="organization" />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden">
          {/* Full Screen Background Image */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${WhatsApp_Image_2025_08_15_at_18_02_15})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>

          {/* Background Overlay - Enhanced for mobile visibility */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-purple-900/90 md:from-blue-900/80 md:via-blue-800/70 md:to-purple-900/80"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Text Content - Enhanced for mobile */}
              <div className="px-4 sm:px-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 text-white leading-tight drop-shadow-lg">
                  {t('hero.title')}
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white leading-relaxed drop-shadow-md">
                  {t('hero.subtitle')}
                </p>

                {/* Key Statistics - Mobile optimized */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 md:mb-8 max-w-3xl mx-auto">
                  <div className="text-center bg-white/30 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 drop-shadow-md">2022</div>
                    <div className="text-xs sm:text-sm text-white font-medium drop-shadow-sm">{t('stats.since')}</div>
                  </div>
                  {/* ======================================== */}
                  {/* ИЗМЕНИТЬ ДИАПАЗОН КОЛИЧЕСТВА ДЕТЕЙ В КЛАССЕ */}
                  {/* Текущее значение: 12-18 */}
                  {/* Чтобы изменить, замените "12-18" на новое значение */}
                  {/* ======================================== */}
                  <div className="text-center bg-white/30 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 drop-shadow-md">12-18</div>
                    <div className="text-xs sm:text-sm text-white font-medium drop-shadow-sm">сыныптағы балалар саны</div>
                  </div>
                  <div className="text-center bg-white/30 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 drop-shadow-md">&lt; 50%</div>
                    <div className="text-xs sm:text-sm text-white font-medium drop-shadow-sm">{t('stats.admission')}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 animate-bounce-gentle shadow-xl text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
                    onClick={() => {
                      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <i className="fas fa-graduation-cap mr-2"></i>
                    {t('hero.apply')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-primary transform hover:scale-105 transition-all duration-300 font-semibold shadow-xl text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto backdrop-blur-sm"
                    asChild
                  >
                    <a href="tel:+77757906363">
                      <Phone className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
                      {t('hero.call')}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>


        </section>
        {/* Preparation Programs */}
        <section className="py-16 bg-white dark:bg-[#0f172a]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  НИШ және РФМШ дайындық бағдарламалары
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Балаларыңызды Назарбаев интеллектуалды мектептеріне және республикалық физика-математика мектебіне түсуге дайындаймыз.
                </p>

                {/* Mathematical Olympiad Results - Mobile/Desktop Responsive */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
                    Математикалық олимпиада нәтижелері
                  </h3>

                  {/* Mobile Version - Accordion */}
                  <div className="md:hidden">
                    <MobileOlympiadAccordion />
                  </div>

                  {/* Desktop Version - Original Layout */}
                  <div className="hidden md:block p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                    {/* 5th Grade - Белов Вячеслав */}
                    <div className="mb-6 p-4 bg-white dark:bg-[#1e293b] rounded-lg shadow-sm border-l-4 border-yellow-500">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">5 сынып, Белов Вячеслав</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">1 орын - "Дарын" олимпиада (аудандық)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">2 орын - "Алтын сақа" (аудандық)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">3 орын - "Алтын сақа" (облыстық)</span>
                        </div>
                      </div>
                    </div>

                    {/* 6th Grade - Ермаханұлы Мардан */}
                    <div className="mb-6 p-4 bg-white dark:bg-[#1e293b] rounded-lg shadow-sm border-l-4 border-green-500">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">6 сынып, Ермаханұлы Мардан</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">1 орын - "Алтын сақа" (аудандық)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">1 орын - "Алтын сақа" (облыстық)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">3 орын - "Алтын сақа" (республикалық)</span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                        <span className="text-blue-700 dark:text-blue-300 font-medium">НИШ - 1251 балл</span>
                      </div>
                    </div>

                    {/* 6th Grade - Жаксыбек Ерхан */}
                    <div className="mb-6 p-4 bg-white dark:bg-[#1e293b] rounded-lg shadow-sm border-l-4 border-blue-500">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">6 сынып, Жаксыбек Ерхан</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">1 орын - "Алтын сақа" (аудандық)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">1 орын - "Дарын" (аудандық)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">1 орын - "Алтын сақа" (облыстық)</span>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded">
                          <span className="text-green-700 dark:text-green-300 font-medium">НИШ - 1324 балл</span>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded">
                          <span className="text-purple-700 dark:text-purple-300 font-medium">РФМШ - 115 балл</span>
                        </div>
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                          <span className="text-yellow-700 dark:text-yellow-300 font-medium">БИЛ - 213 балл</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <img
                    src={student2}
                    alt="Оқушы - НІШ, РФМШ, БИЛ сертификаттарымен"
                    className="w-full h-[220px] object-cover object-[center_top]"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <img
                    src={student3}
                    alt="Оқушы - Үлгі ерасыл сертификатпен"
                    className="w-full h-[220px] object-cover object-[center_top]"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <img
                    src={student4}
                    alt="Оқушы - Ермаханұлы Мардан сертификатпен"
                    className="w-full h-[220px] object-cover object-[center_top]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Three Directions Section - Mobile/Desktop Responsive */}
        <section className="py-8 bg-white dark:bg-[#1e293b] grid-background relative overflow-hidden min-h-[450px]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Үш бағыт арқылы жеке тұлғаны дамыту
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Балаларыңыздың шығармашылық, интеллектуалды және дене дамуын қамтамасыз ету арқылы толыққанды тұлға қалыптастырамыз
              </p>
            </div>

            {/* Mobile Version - Carousel */}
            <div className="md:hidden">
              <MobileDevelopmentCarousel />
            </div>

            {/* Desktop Version - Three Cards Layout */}
            <div className="hidden md:grid lg:grid-cols-3 md:grid-cols-2 gap-10 lg:gap-10 max-w-6xl mx-auto">

              {/* Creative Direction Card */}
              <div className="text-center animate-fade-in-up">
                <div className="relative mb-6">

                  {/* Student Photo Circle - Exact 320px dimensions */}
                  <div className="relative w-80 h-80 mx-auto">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-pink-50 to-purple-50">
                      <img
                        src={creativePhoto}
                        alt="Шығармашылық бағыт - балалар домбырада ойнап жатыр"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title Label - Height ~40px */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#1e293b] px-6 py-2 rounded-full shadow-lg border-2 border-pink-200 dark:border-pink-500 h-10 flex items-center">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">ШЫҒАРМАШЫЛЫҚ</h3>
                    </div>
                  </div>
                </div>

                {/* Description - 80% width of card */}
                <div className="max-w-[80%] mx-auto">
                  <p className="text-black dark:text-gray-300 text-base leading-relaxed text-center">
                    Балалардың эстетикалық талғамын, шығармашылық ойлауын және көркем қабілеттерін дамыту.
                    Хореография, домбыра, дизайн және глинолепка сияқты үйірмелер арқылы өнерге деген сүйіспеншілікті ояту.
                  </p>
                </div>
              </div>

              {/* Intellectual Direction Card */}
              <div className="text-center animate-fade-in-up-delayed">
                <div className="relative mb-6">

                  {/* Student Photo Circle - Exact 320px dimensions */}
                  <div className="relative w-80 h-80 mx-auto">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-600 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <img
                        src={intellectualPhoto}
                        alt="Интеллектуалды бағыт - робототехника және LEGO роботтар"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title Label - Height ~40px */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#1e293b] px-6 py-2 rounded-full shadow-lg border-2 border-blue-200 dark:border-blue-500 h-10 flex items-center">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">ИНТЕЛЛЕКТУАЛДЫ</h3>
                    </div>
                  </div>
                </div>

                {/* Description - 80% width of card */}
                <div className="max-w-[80%] mx-auto">
                  <p className="text-black dark:text-gray-300 text-base leading-relaxed text-center">
                    Логикалық ойлау, аналитикалық қабілет және проблемаларды шешу дағдыларын дамыту.
                    Робототехника, шахмат, дебат және Speaking Club арқылы зият дамуын қамтамасыз ету.
                  </p>
                </div>
              </div>

              {/* Sports Direction Card */}
              <div className="text-center animate-fade-in-up-delayed-2 md:col-span-2 lg:col-span-1">
                <div className="relative mb-6">

                  {/* Student Photo Circle - Exact 320px dimensions */}
                  <div className="relative w-80 h-80 mx-auto">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-600 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
                      <img
                        src={sportsPhoto}
                        alt="Спорттық бағыт - балалар гимнастикалық обручтармен жаттығады"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title Label - Height ~40px */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#1e293b] px-6 py-2 rounded-full shadow-lg border-2 border-green-200 dark:border-green-500 h-10 flex items-center">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">СПОРТТЫҚ</h3>
                    </div>
                  </div>
                </div>

                {/* Description - 80% width of card */}
                <div className="max-w-[80%] mx-auto">
                  <p className="text-black dark:text-gray-300 text-base leading-relaxed text-center">
                    Дене шынықтыру, командалық жұмыс және жеңіске деген ұмтылысты дамыту.
                    Тэквондо, футбол және басқа спорт түрлері арқылы денсаулықты нығайту және жігер ашу.
                  </p>
                </div>
              </div>
            </div>

            {/* View All Clubs Button */}
            <div className="text-center mt-8">
              <a
                href="/kruzhki"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold text-lg rounded-full hover:from-blue-700 hover:to-blue-900 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-blue-500 hover:border-blue-600"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Барлық үйірмелерді көру
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
        {/* Modern School Facts Section - Mobile/Desktop Responsive */}
        <section className="py-16">
          <div className="container mx-auto px-4">

            {/* Mobile Version - Slides */}
            <div className="md:hidden">
              <MobileSchoolFactsSlides />
            </div>

            {/* Desktop Version - Original SchoolCards */}
            <div className="hidden md:block">
              <SchoolCards />
            </div>
          </div>
        </section>
        {/* Teachers Section - Hidden from home page, moved to separate pages */}
        {/* News Section - Mobile/Desktop Responsive */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 relative">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Жаңалықтар мен хабарландырулар
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Мектептің соңғы оқиғалары мен маңызды хабарлар
              </p>

              {/* Admin Add News Button */}
              {user && (
                <div className="absolute top-0 right-0">
                  <Dialog open={isAddNewsOpen} onOpenChange={setIsAddNewsOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Жаңалық қосу
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">{editingNewsId ? "Жаңалықты өңдеу" : "Жаңалық қосу"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (editingNewsId) {
                          updateNewsMutation.mutate({ id: editingNewsId, data: newNews });
                        } else {
                          addNewsMutation.mutate(e);
                        }
                      }} className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-gray-900">Тақырып</Label>
                          <Input
                            value={newNews.title}
                            onChange={e => setNewNews({ ...newNews, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-900">Мәтін (Сипаттама)</Label>
                          <Textarea
                            value={newNews.body}
                            onChange={e => setNewNews({ ...newNews, body: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Күні (Мәтін түрінде, мыс: 15 Тамыз)</Label>
                          <Input
                            value={newNews.dateText}
                            onChange={e => setNewNews({ ...newNews, dateText: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Сурет URL</Label>
                          <Input
                            value={newNews.coverUrl}
                            onChange={e => setNewNews({ ...newNews, coverUrl: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={addNewsMutation.isPending}>
                          {addNewsMutation.isPending && <Loader2 className="animate-spin mr-2" />}
                          Сақтау
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            {/* Mobile Version - Slides */}
            <div className="md:hidden">
              <MobileNewsSlides items={formattedNews} />
            </div>

            {/* Desktop Version - Grid Layout */}
            <div className="hidden md:block">
              <div className="grid md:grid-cols-3 gap-8">
                {formattedNews.map((article) => (
                  <Card key={article.id} className="bg-white dark:bg-[#1e293b] border-2 border-blue-100 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-500 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 rounded-2xl relative group">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {user && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-2 right-14 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNews(article);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete news?")) deleteNewsMutation.mutate(article.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <CardContent className="p-6">
                      <div className="text-sm text-primary dark:text-blue-400 font-semibold mb-2">
                        {article.date}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 dark:text-gray-100">{article.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{article.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {formattedNews.length === 0 && (
                <div className="text-center py-10 text-gray-500">Жаңалықтар жоқ</div>
              )}
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Жиі қойылатын сұрақтар
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Ата-аналардан келетін ең көп қойылатын сұрақтарға жауаптар
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-[#1e293b] dark:border-gray-700">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200">
                      Мектепке қабылдау үшін қандай құжаттар керек?
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 text-gray-600 dark:text-gray-300">
                      <p>Мектепке қабылдау үшін келесі құжаттар қажет:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Баланың туу туралы куәлігі</li>
                        <li>Ата-ананың жеке куәліктері</li>
                        <li>Баланың медициналық карточкасы</li>
                        <li>3x4 фотосуреттер (4 дана)</li>
                        <li>Егер бар болса, алдыңғы мектептен анықтама</li>
                      </ul>
                    </div>
                  </details>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-[#1e293b] dark:border-gray-700">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200">
                      FGS - жеке мектебі: төлем және шарттар
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 text-gray-600 dark:text-gray-300">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                        <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">FGS - жеке мектебі</p>
                        <p className="text-blue-700 dark:text-blue-300">Айлық оқу ақысы: <strong>70,000 теңге</strong></p>
                      </div>
                      <p className="mb-3">Оқу ақысына кіреді:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li><strong>Толық оқу бағдарламасы</strong> (0-9 сыныптар)</li>
                        <li><strong>3 рет тамақ:</strong> таңғы ас, түскі ас, бесін ас</li>
                        <li><strong>Оқушы тасымалы</strong> (Hyundai Starex H2)</li>
                        <li><strong>Барлық оқу материалдары</strong> мен кітаптар</li>
                        <li><strong>Үйірмелерге қатысу</strong></li>
                        <li><strong>НИШ/РФМШ дайындық курстары</strong></li>
                      </ul>
                      <p className="mt-3 text-sm bg-green-50 dark:bg-green-900/30 p-3 rounded dark:text-gray-300">Икемді төлем жүйесі: ай сайынғы, жартыжылдық және жылдық төлем мүмкіндігі бар</p>
                    </div>
                  </details>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-[#1e293b] dark:border-gray-700">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200">
                      Сыныптарда неше бала оқиды?
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 text-gray-600 dark:text-gray-300">
                      {/* ======================================== */}
                      {/* ИЗМЕНИТЬ ДИАПАЗОН КОЛИЧЕСТВА ДЕТЕЙ В КЛАССЕ */}
                      {/* Текущее значение: 12-18 */}
                      {/* Чтобы изменить, замените "12-18" на новое значение */}
                      {/* ======================================== */}
                      <p>Біздің мектепте әр сыныпта 12-18 бала оқиды. Бұл мұғалімнің әр балаға жеке көңіл бөлуіне және сапалы білім беруге мүмкіндік береді. Кішігірім сыныптар балалардың дамуын жақсы бақылауға және олардың жеке қабілеттерін ашуға көмектеседі.</p>
                    </div>
                  </details>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-[#1e293b] dark:border-gray-700">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200">
                      Мектепте тамақтану қалай ұйымдастырылған?
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 text-gray-600 dark:text-gray-300">
                      <p>Мектепте толыққанды тамақтану қамтамасыз етілген:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Таңғы ас, түскі ас және бесін ас</li>
                        <li>Диетикпен дайындалған мәзір</li>
                        <li>Жаңа және сапалы өнімдер</li>
                        <li>Аллергиясы бар балаларға арнайы мәзір</li>

                      </ul>
                    </div>
                  </details>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-[#1e293b] dark:border-gray-700">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200">
                      Оқу тілі қандай? Орыс тілді сынып бар ма?
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 text-gray-600 dark:text-gray-300">
                      <p>Мектепте екі бөлім жұмыс істейді:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li><strong>Қазақ бөлімі:</strong> Барлық пәндер қазақ тілінде</li>
                        <li><strong>Орыс бөлімі:</strong> Барлық пәндер орыс тілінде</li>
                      </ul>
                      <p className="mt-2">Екі бөлімде де қазақ, орыс және ағылшын тілдері міндетті түрде оқытылады. Ата-аналар балаларының тілдік ерекшеліктеріне сәйкес бөлімді таңдай алады.</p>
                    </div>
                  </details>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-[#1e293b] dark:border-gray-700">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200">
                      НИШ пен РФМШ дайындық бағдарламасы туралы көбірек ақпарат
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 text-gray-600 dark:text-gray-300">
                      <p>Біздің дайындық бағдарламасы:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>6-8 сыныптар үшін арнайы дайындық курсы</li>
                        <li>Математика, физика, химия, биология пәндерінен күшейтілген дайындық</li>
                        <li>Сынақ тестілері мен олимпиадаларға дайындық</li>
                        <li>Жеке және топтық сабақтар</li>
                        <li>Өткен жылдары студенттердің &lt; 50% НИШ пен РФМШ-қа түсті</li>
                      </ul>
                    </div>
                  </details>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-[#1e293b] dark:border-gray-700">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200">
                      Үйірмелерге қатысу міндетті ме?
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 text-gray-600 dark:text-gray-300">
                      <p>Үйірмелерге қатысу міндетті емес, бірақ балалардың жан-жақты дамуы үшін өте пайдалы. Біз ұсынамыз:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Әр бала кемінде 1-2 үйірмені таңдау</li>
                        <li>Бірінші семестрде тегін сынап көру мүмкіндігі</li>
                        <li>Үйірмелер кешкі уақытта және демалыс күндері</li>
                        <li>Жеке қызығушылықтар мен талантқа сәйкес таңдау</li>
                      </ul>
                    </div>
                  </details>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 dark:bg-[#1e293b] dark:border-gray-700">
                <CardContent className="p-6">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-400 transition-colors duration-200">
                      Ата-аналармен байланыс қалай жүзеге асырылады?
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-4 text-gray-600 dark:text-gray-300">
                      <p>Біз ата-аналармен тығыз байланыс орнатамыз:</p>
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li>Әр сыныпта жеке куратор бар</li>
                        <li>Ай сайын баланың үлгерімі туралы толық есеп</li>
                        <li>WhatsApp топтары арқылы күнделікті хабарлар</li>
                        <li>Ата-аналар жиналысы айына 1 рет</li>
                        <li>Қажет болған жағдайда кез келген уақытта кездесу</li>
                        <li>UPay қосымшасы арқылы балаңыздың белсенділігін бақылау</li>
                      </ul>
                    </div>
                  </details>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section id="apply" className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  Бізбен байланысыңыз
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Мектеп туралы қосымша ақпарат алу немесе мектепке баруға келу үшін бізбен хабарласыңыз.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">Мекенжай</h4>
                      <button
                        className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 hover:underline text-left"
                        onClick={() => {
                          // Open in 2GIS
                          window.open('https://go.2gis.com/DoFle', '_blank');
                        }}
                      >
                        Шымкент қаласы, Өтегенова көшесі 43А
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">Әлеуметтік желілер</h4>
                      <div className="flex space-x-4 mt-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // Try to open Instagram app first, fallback to web
                            window.location.href = 'instagram://user?username=fgs.schoolkz';
                            setTimeout(() => {
                              window.open('https://www.instagram.com/fgs.schoolkz/', '_blank');
                            }, 1000);
                          }}
                          className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md"
                        >
                          <Instagram className="w-5 h-5 mr-2" />
                          Instagram
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // Ask user for Telegram channel/group link
                            const telegramLink = prompt('Телеграм каналы немесе топ сілтемесін енгізіңіз (мысалы: https://t.me/fgs_school):');
                            if (telegramLink) {
                              // Extract username from link and try app first
                              const username = telegramLink.replace('https://t.me/', '');
                              window.location.href = `tg://resolve?domain=${username}`;
                              setTimeout(() => {
                                window.open(telegramLink, '_blank');
                              }, 1000);
                            }
                          }}
                          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Telegram
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // Try to open WhatsApp app first, fallback to web
                            window.location.href = 'whatsapp://send?phone=77757906363';
                            setTimeout(() => {
                              window.open('https://wa.me/77757906363', '_blank');
                            }, 1000);
                          }}
                          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transform hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">Телефон</h4>
                      <button
                        className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 hover:underline text-left"
                        onClick={() => {
                          // Initiate phone call
                          window.location.href = 'tel:+77757906363';
                        }}
                      >
                        +7‒775‒790‒63‒63
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">Жұмыс уақыты</h4>
                      <p className="text-gray-600 dark:text-gray-300">Дүйсенбі - жұма: 08:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-transparent dark:bg-transparent border-gray-300 dark:border-gray-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                    Сұрақ қойыңыз
                  </h3>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Аты-жөні *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#0f172a] dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Телефон номері *
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#0f172a] dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Сұрақ немесе хабарлама *
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#0f172a] dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      ></textarea>
                    </div>

                    <Button type="submit" className="w-full transform hover:scale-105 transition-all duration-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
                      Хабарлама жіберу
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
