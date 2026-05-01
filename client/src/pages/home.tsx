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
  Facebook,
  X,
  Star,
  Users,
  Award,
  Trophy,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import logoImage from "@assets/WhatsApp Image 2025-08-01 at 14.18.59_1754990832045.jpeg";
import { useLanguage } from "@/contexts/LanguageContext";
import SEOHead from "@/components/seo-head";
import StructuredData from "@/components/structured-data";
import MobileAccordion from "@/components/mobile-accordion";
import MobileOlympiadAccordion from "@/components/mobile-olympiad-accordion";
import MobileDevelopmentCarousel from "@/components/mobile-development-carousel";
import MobileNewsSlides from "@/components/mobile-news-slides";
import BentoFacts from "@/components/bento-facts";
import InstagramFeed from "@/components/instagram-feed";
import ReviewsSection from "@/components/reviews-section";
import ApplicationForm from "@/components/application-form";

import WhatsApp_Image_2025_08_15_at_18_02_15 from "@assets/WhatsApp Image 2025-08-15 at 18.02.15_1755264555912.jpeg";
import sportsPhoto from "@assets/9E3A2784_1760360997075.jpg";
import creativePhoto from "@assets/9E3A6284_1760361922943.jpg";
import intellectualPhoto from "@assets/9E3A8933_1760362017762.jpg";




import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import type { News, SiteContent } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
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

  // Instagram Widget ID Fetching
  const { data: content = [] } = useQuery<SiteContent[]>({
    queryKey: ["/api/content"],
  });

  const instagramWidgetId = content.find(item => item.key === "instagram_widget_id")?.value;


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
      image: "/gallery/school-life.jpg",
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
      image: creativePhoto,
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
      image: intellectualPhoto,
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
      image: "/gallery/chess.jpg"
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
          {/* Full Screen Background Image - Optimized for LCP */}
          <img
            src="/hero-bg.jpg"
            alt="School background"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchpriority="high"
          />

          {/* Background Overlay - Enhanced for mobile visibility */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-purple-900/90 md:from-blue-900/80 md:via-blue-800/70 md:to-purple-900/80"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
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

        {/* Three Directions Section - Mobile/Desktop Responsive */}
        <section className="pt-16 pb-10 bg-[#0f172a] relative overflow-hidden min-h-[450px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Үш бағыт арқылы жеке тұлғаны дамыту
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Балаларыңыздың шығармашылық, интеллектуалды және дене дамуын қамтамасыз ету арқылы толыққанды тұлға қалыптастырамыз
              </p>
            </div>

            {/* Mobile Version - Carousel */}
            <div className="md:hidden">
              <MobileDevelopmentCarousel />
            </div>

            {/* Desktop Version - Three Cards Layout */}
            <div className="hidden md:grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-7xl mx-auto">

              {/* Creative Direction Card */}
              <div className="text-center animate-fade-in-up">
                <div className="relative mb-6">

                  {/* Student Photo Circle - Responsive within grid cell */}
                  <div className="relative w-full max-w-[320px] aspect-square mx-auto">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-pink-50 to-purple-50">
                      <img
                        src={creativePhoto}
                        alt="Шығармашылық бағыт - балалар домбырада ойнап жатыр"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Title Label - Height ~40px */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#1e293b] px-6 py-2 rounded-full shadow-lg border-2 border-pink-200 dark:border-pink-500 h-10 flex items-center">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">ШЫҒАРМАШЫЛЫҚ</h3>
                    </div>
                  </div>
                </div>

                {/* Description - 80% width of card */}
                <div className="w-full mx-auto">
                  <p className="text-gray-300 text-base leading-relaxed text-center">
                    Балалардың эстетикалық талғамын, шығармашылық ойлауын және көркем қабілеттерін дамыту.
                    Хореография, домбыра, дизайн және глинолепка сияқты үйірмелер арқылы өнерге деген сүйіспеншілікті ояту.
                  </p>
                </div>
              </div>

              {/* Intellectual Direction Card */}
              <div className="text-center animate-fade-in-up-delayed">
                <div className="relative mb-6">

                  {/* Student Photo Circle - Responsive within grid cell */}
                  <div className="relative w-full max-w-[320px] aspect-square mx-auto">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-600 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <img
                        src={intellectualPhoto}
                        alt="Интеллектуалды бағыт - робототехника және LEGO роботтар"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Title Label - Height ~40px */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#1e293b] px-6 py-2 rounded-full shadow-lg border-2 border-blue-200 dark:border-blue-500 h-10 flex items-center">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">ИНТЕЛЛЕКТУАЛДЫ</h3>
                    </div>
                  </div>
                </div>

                {/* Description - 80% width of card */}
                <div className="w-full mx-auto">
                  <p className="text-gray-300 text-base leading-relaxed text-center">
                    Логикалық ойлау, аналитикалық қабілет және проблемаларды шешу дағдыларын дамыту.
                    Робототехника, шахмат, дебат және Speaking Club арқылы зият дамуын қамтамасыз ету.
                  </p>
                </div>
              </div>

              {/* Sports Direction Card */}
              <div className="text-center animate-fade-in-up-delayed-2 md:col-span-2 lg:col-span-1">
                <div className="relative mb-6">

                  {/* Student Photo Circle - Responsive within grid cell */}
                  <div className="relative w-full max-w-[320px] aspect-square mx-auto">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-600 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
                  <img
                        src={sportsPhoto}
                        alt="Спорттық бағыт - балалар гимнастикалық обручтармен жаттығады"
                        className="w-full h-full object-cover"
                        loading="lazy"
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
                  <p className="text-gray-300 text-base leading-relaxed text-center">
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

        <BentoFacts />

        {/* Teachers Section - Hidden from home page, moved to separate pages */}
        {/* News Section removed as requested */}





        {/* Reviews Section - White Background */}
        <section className="py-24 bg-white dark:bg-[#0f172a]">
          <ReviewsSection />
        </section>


        {/* FAQ Section - Consistent Dark Background */}
        <section className="py-10 bg-[#0f172a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                Жиі қойылатын <span className="text-blue-600 dark:text-blue-400">сұрақтар</span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {/* Question 1 */}
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden dark:bg-slate-800/50">
                <CardContent className="p-0">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-bold text-gray-800 dark:text-gray-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                      Мектепке қабылдау үшін қандай құжаттар керек?
                      <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-300 text-blue-500" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-300 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="pt-2 space-y-2 leading-relaxed">
                        <p>Баланы мектепке қабылдау үшін келесі құжаттар қажет:</p>
                        <ul className="list-disc ml-6 space-y-2 mt-2">
                          <li>Баланың туу туралы куәлігі</li>
                          <li>Ата-ананың жеке куәліктері</li>
                          <li>Баланың медициналық карточкасы (026/у формасы)</li>
                          <li>3x4 фотосуреттер (4 дана)</li>
                        </ul>
                      </div>
                    </div>
                  </details>
                </CardContent>
              </Card>

              {/* Question 2 */}
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden dark:bg-slate-800/50">
                <CardContent className="p-0">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-bold text-white hover:bg-slate-800/50 transition-all">
                      Білімді ұрпақ жекеменшік мектебі - жеке мектебі: төлем және шарттар
                      <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-300 text-blue-500" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-300 animate-in fade-in slide-in-from-top-2 duration-300">

                      <p className="mb-3 font-bold">Оқу ақысына кіреді:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {[
                          "Толық оқу бағдарламасы",
                          "3 рет сапалы тамақ",
                          "Оқушы тасымалы (Hyundai Starex)",
                          "Барлық оқу материалдары",
                          "Үйірмелерге қатысу",
                          "НИШ/РФМШ дайындық курстары"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm border border-green-100 dark:border-green-800">
                        <span className="font-bold text-green-700 dark:text-green-400">Икемді төлем жүйесі:</span> ай сайынғы, жартыжылдық және жылдық төлем мүмкіндігі бар.
                      </div>
                    </div>
                  </details>
                </CardContent>
              </Card>

              {/* Question 3 */}
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden dark:bg-slate-800/50">
                <CardContent className="p-0">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-bold text-white hover:bg-slate-800/50 transition-all">
                      Сыныптарда неше бала оқиды?
                      <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-300 text-blue-500" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-300 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="leading-relaxed">Біздің мектепте әр сыныпта <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">12-18 бала</span> оқиды. Бұл мұғалімнің әр балаға жеке көңіл бөлуіне және сапалы білім беруге мүмкіндік береді. Кішігірім сыныптар балалардың дамуын жақсы бақылауға және олардың жеке қабілеттерін ашуға көмектеседі.</p>
                    </div>
                  </details>
                </CardContent>
              </Card>

              {/* Question 4 */}
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden dark:bg-slate-800/50">
                <CardContent className="p-0">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-bold text-white hover:bg-slate-800/50 transition-all">
                      Мектепте тамақтану қалай ұйымдастырылған?
                      <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-300 text-blue-500" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-300 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="mb-4">Мектепте толыққанды тамақтану қамтамасыз етілген:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {[
                          { title: "3 реттік тамақ", desc: "Таңғы, түскі және бесін ас" },
                          { title: "Диетикалық мәзір", desc: "Диетолог мамандармен жасалған" },
                          { title: "Сапалы өнімдер", desc: "Күнделікті жаңа піскен тағам" },
                          { title: "Жеке тәсіл", desc: "Аллергиясы бар балаларға арнайы мәзір" }
                        ].map((item, i) => (
                          <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        ))}
                      </ul>
                    </div>
                  </details>
                </CardContent>
              </Card>

              {/* Question 5 */}
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden dark:bg-slate-800/50">
                <CardContent className="p-0">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-bold text-white hover:bg-slate-800/50 transition-all">
                      Оқу тілі қандай? Орыс тілді сынып бар ма?
                      <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-300 text-blue-500" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-300 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                          <p className="font-bold text-blue-700 dark:text-blue-400 mb-1">Қазақ бөлімі</p>
                          <p className="text-sm">Барлық пәндер қазақ тілінде</p>
                        </div>
                        <div className="flex-1 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                          <p className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">Орыс бөлімі</p>
                          <p className="text-sm">Барлық пәндер орыс тілінде</p>
                        </div>
                      </div>
                      <p className="text-sm italic">Екі бөлімде де қазақ, орыс және ағылшын тілдері міндетті түрде оқытылады.</p>
                    </div>
                  </details>
                </CardContent>
              </Card>

              {/* Question 6 */}
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden dark:bg-slate-800/50">
                <CardContent className="p-0">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-bold text-white hover:bg-slate-800/50 transition-all">
                      НИШ пен РФМШ дайындық бағдарламасы туралы көбірек ақпарат
                      <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-300 text-blue-500" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-300 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-4 pt-2">
                        <p className="font-bold text-gray-800 dark:text-gray-200 leading-relaxed">Біздің дайындық бағдарламасы 6-8 сыныптар үшін арнайы жасалған және келесілерді қамтиды:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            "Математика мен физикадан күшейтілген сабақтар",
                            "Химия және биология пәндерін тереңдетіп оқыту",
                            "Апта сайынғы сынақ тестілері",
                            "Олимпиадалық есептерді шығару әдістері",
                            "Жеке және топтық консультациялар"
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>
                </CardContent>
              </Card>

              {/* Question 7 */}
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden dark:bg-slate-800/50">
                <CardContent className="p-0">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-bold text-white hover:bg-slate-800/50 transition-all">
                      Үйірмелерге қатысу міндетті ме?
                      <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-300 text-blue-500" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-300 animate-in fade-in slide-in-from-top-2 duration-300">
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

              {/* Question 8 */}
              <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden dark:bg-slate-800/50">
                <CardContent className="p-0">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-6 text-lg font-bold text-white hover:bg-slate-800/50 transition-all">
                      Ата-аналармен байланыс қалай жүзеге асырылады?
                      <ChevronDown className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-300 text-blue-500" />
                    </summary>
                    <div className="px-6 pb-6 text-gray-300 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="mb-4">Біз ата-аналармен тығыз байланыс орнатамыз:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {[
                          "Әр сыныпта жеке куратор",
                          "Ай сайын үлгерім туралы есеп",
                          "WhatsApp топтары арқылы байланыс",
                          "Ай сайын ата-аналар жиналысы",
                          "Жеке кездесулер мүмкіндігі",
                          "UPay қосымшасымен бақылау"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-blue-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Application Form - Consistent Dark Background */}
        <section id="apply" className="pt-10 pb-16 bg-[#0f172a]">
          <ApplicationForm />
        </section>
      </div>
    </>
  );
}
