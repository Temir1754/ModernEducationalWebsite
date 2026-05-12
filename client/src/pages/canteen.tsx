import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { 
  Utensils, 
  Clock, 
  DollarSign, 
  Shield, 
  Phone, 
  Mail, 
  Camera, 
  Apple, 
  Users, 
  MessageSquare,
  ChefHat,
  Heart,
  AlertTriangle,
  ArrowLeft,
  X,
  Loader2,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import type { Media } from "@shared/schema";

const CanteenPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
    const sections = ['menu', 'schedule', 'gallery', 'norms', 'faq'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const { data: canteenMedia = [], isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media", "canteen"],
    queryFn: async () => {
      const res = await fetch("/api/media?section=canteen");
      if (!res.ok) return [];
      return res.json();
    }
  });

  // Fallback images if database is empty
  const defaultMedia = [
    { url: "/canteen-hall.png", caption: "Асхана залы" },
    { url: "/canteen-kitchen.png", caption: "Тамақ дайындау" },
    { url: "/canteen-lunch.png", caption: "Дайын тағамдар" }
  ];

  const displayMedia = canteenMedia.length > 0 ? canteenMedia : defaultMedia;

  // 4 weeks menu data
  const menuByWeek: Record<number, Array<{
    day: string;
    breakfast: Array<{ name: string; w7_10: string; w11_14: string }>;
    lunch: Array<{ name: string; w7_10: string; w11_14: string }>;
    snack: string[];
  }>> = {
    1: [
      {
        day: "Дүйсенбі",
        breakfast: [
          { name: "Манка ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Сары май мен нан", w7_10: "50 г", w11_14: "50 г" },
          { name: "Лимонмен шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Жасымық сорпасы", w7_10: "200 г", w11_14: "250 г" },
          { name: "Паста Болоньезе", w7_10: "200 г", w11_14: "220 г" },
          { name: "Көкөністерді кесу", w7_10: "60 г", w11_14: "80 г" },
          { name: "Лимон- алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Йогурт", "Ірімшік шелпегі"]
      },
      {
        day: "Сейсенбі",
        breakfast: [
          { name: "Достық ботқасы (Тары)", w7_10: "200 г", w11_14: "220 г" },
          { name: "Печенье", w7_10: "40 г", w11_14: "40 г" },
          { name: "Шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Бұршақ сорпасы (горох)", w7_10: "200 г", w11_14: "250 г" },
          { name: "Күркетауық етінен палау", w7_10: "200 г (40/160)", w11_14: "220 г (50/170)" },
          { name: "Витамин салаты (қырыққабат, сәбіз)", w7_10: "60 г", w11_14: "80 г" },
          { name: "Жаңа алма компот", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Картоп бәліші"]
      },
      {
        day: "Сәрсенбі",
        breakfast: [
          { name: "Сүт ботқасы (Жеті дән)", w7_10: "200 г", w11_14: "220 г" },
          { name: "Печенье", w7_10: "40 г", w11_14: "40 г" },
          { name: "Лимонмен шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Ет қосылған рассольник", w7_10: "200 г", w11_14: "250 г" },
          { name: "Сиыр етінен митболдар гарнир қарақұмық", w7_10: "200 г (60/130)", w11_14: "220 г (80/150)" },
          { name: "Сәбіз таяқшалары", w7_10: "60 г", w11_14: "80 г" },
          { name: "Жаңа алма компот", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Ватрушки"]
      },
      {
        day: "Бейсенбі",
        breakfast: [
          { name: "Қарақұмық ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Ірімшік пен нан", w7_10: "50 г", w11_14: "50 г" },
          { name: "Шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Тауық кеспесі", w7_10: "200 г", w11_14: "250 г" },
          { name: "Ет қосылған картоп запеканкасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Кемпірқосақ салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Лимон- алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Алма бәліші"]
      },
      {
        day: "Жұма",
        breakfast: [
          { name: "Күріш ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Пісірілген жұмыртқа", w7_10: "1", w11_14: "1" },
          { name: "Сүттегі какао", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Бұршақ сорпасы (маш)", w7_10: "200 г", w11_14: "250 г" },
          { name: "Гуляш сиыр етімен гарнир күріш", w7_10: "200 г", w11_14: "220 г" },
          { name: "Тау күн салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Лимон- алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Тауық етімен самса"]
      }
    ],
    2: [
      {
        day: "Дүйсенбі",
        breakfast: [
          { name: "Күріш ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Сары май мен нан", w7_10: "50 г", w11_14: "50 г" },
          { name: "Лимонмен шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Жасымық сорпасы", w7_10: "200 г", w11_14: "250 г" },
          { name: "Бұқтырылған ет пен көкөніс қосылған спагетти", w7_10: "200 г", w11_14: "220 г" },
          { name: "Кемпірқосақ салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Лимон-алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Джем қосылған бәліш"]
      },
      {
        day: "Сейсенбі",
        breakfast: [
          { name: "Жеті дән ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Печенье", w7_10: "40 г", w11_14: "40 г" },
          { name: "Сүттегі какао", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Ет қосылған рассольник", w7_10: "200 г", w11_14: "250 г" },
          { name: "Сиыр етінен Гуляш гарнирге қарақұмық", w7_10: "200 г", w11_14: "220 г" },
          { name: "Витамин салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Жаңа алма компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Учпучмак"]
      },
      {
        day: "Сәрсенбі",
        breakfast: [
          { name: "Манка ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Ірімшік пен нан", w7_10: "50 г", w11_14: "50 г" },
          { name: "Шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Күріш сорпасы", w7_10: "200 г", w11_14: "250 г" },
          { name: "Тауық және картоп бұқтырмасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Тау күн салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Лимон-алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Ірімшік қосылған тоқаш"]
      },
      {
        day: "Бейсенбі",
        breakfast: [
          { name: "Тары ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Печенье", w7_10: "40 г", w11_14: "40 г" },
          { name: "Лимонмен шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Сиыр етімен борщ сорпасы", w7_10: "200 г", w11_14: "250 г" },
          { name: "Сиыр етімен палау", w7_10: "200 г", w11_14: "220 г" },
          { name: "Витамин салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Жаңа алма компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай нан", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Даршын қосылған тоқаш"]
      },
      {
        day: "Жұма",
        breakfast: [
          { name: "Қарақұмық ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Пісірілген жұмыртқа", w7_10: "1", w11_14: "1" },
          { name: "Лимон-алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Бұршақ сорпасы(маш)", w7_10: "200 г", w11_14: "250 г" },
          { name: "Брынза мен шпинат қосылған грек пирогы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Кемпірқосақ салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Лимон-алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" },
          { name: "Алма", w7_10: "1", w11_14: "1" }
        ],
        snack: ["Қоюлатылған сүт қосылған тоқаш"]
      }
    ],
    3: [
      {
        day: "Дүйсенбі",
        breakfast: [
          { name: "Күріш ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Пісірілген жұмыртқа", w7_10: "50 г", w11_14: "50 г" },
          { name: "Сүттегі какао", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Бұршақ сорпасы(горох)", w7_10: "200 г", w11_14: "250 г" },
          { name: "Гуляш сиыр етімен гарнир гречка", w7_10: "200 г", w11_14: "220 г" },
          { name: "Витамин салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Лимон-алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 item", w11_14: "35 г" }
        ],
        snack: ["Ірімшік қосылған тоқаш"]
      },
      {
        day: "Сейсенбі",
        breakfast: [
          { name: "Манка ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Сары май мен нан", w7_10: "50 г", w11_14: "50 г" },
          { name: "Лимонмен шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Бұршақ фасоль сорпасы", w7_10: "200 г", w11_14: "250 г" },
          { name: "Тауық шарлары, гарнирге макарон", w7_10: "200 г", w11_14: "220 г" },
          { name: "Кемпірқосақ салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Кептірілген жеміс компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Джем қосылған тоқаш"]
      },
      {
        day: "Сәрсенбі",
        breakfast: [
          { name: "Қарақұмық жармасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Печенье", w7_10: "40 г", w11_14: "50 г" },
          { name: "Шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Тауық кеспесі", w7_10: "200 г", w11_14: "250 г" },
          { name: "Нут қосылған күркетауық етінен палау", w7_10: "200 г", w11_14: "220 г" },
          { name: "Кемпірқосақ салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Лимон-алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Ірімшік қосылған тоқаш"]
      },
      {
        day: "Бейсенбі",
        breakfast: [
          { name: "Сұлы ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Жұмыртқа", w7_10: "1", w11_14: "1" },
          { name: "Лимонмен шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Бұршақ сорпасы(чечевица)", w7_10: "200 г", w11_14: "250 г" },
          { name: "Сірне", w7_10: "200 г", w11_14: "220 г" },
          { name: "Тау күн салаты (қырыққабат, сәбіз, қияр)", w7_10: "60 г", w11_14: "80 г" },
          { name: "Кептірілген жеміс компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Картоп қосылған бәліш"]
      },
      {
        day: "Жұма",
        breakfast: [
          { name: "Сүт ботқасы Достық", w7_10: "200 г", w11_14: "220 г" },
          { name: "Май және ірімшік нан", w7_10: "50 г", w11_14: "50 г" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" },
          { name: "Жаңа алма компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Печенье", w7_10: "20 г", w11_14: "40 г" }
        ],
        lunch: [
          { name: "Ет қосылған маш пен күріш сорпасы", w7_10: "200 г", w11_14: "250 г" },
          { name: "Паста балоньезе", w7_10: "200 г", w11_14: "220 г" },
          { name: "Витамин салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Кептірілген жеміс компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Даршын қосылған тоқаш"]
      }
    ],
    4: [
      {
        day: "Дүйсенбі",
        breakfast: [
          { name: "Сүт ботқасы Жеті дән", w7_10: "200 г", w11_14: "220 г" },
          { name: "Печенье", w7_10: "40 г", w11_14: "50 г" },
          { name: "Лимон-алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Ет қосылған рассольник (сиыр етімен)", w7_10: "200 г", w11_14: "250 г" },
          { name: "Гратен из Брокколи и цветной капусты", w7_10: "200 г", w11_14: "220 г" },
          { name: "Кемпірқосақ салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Кептірілген жеміс компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Йогурт", "Тоқаш"]
      },
      {
        day: "Сейсенбі",
        breakfast: [
          { name: "Манка ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Сары май мен нан", w7_10: "50 г", w11_14: "50 г" },
          { name: "Лимонмен шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Сиыр етінен борщ сорпасы", w7_10: "200 г", w11_14: "250 г" },
          { name: "Ірімшік астындағы тауықтың төс еті Гарнирге қарақұмық", w7_10: "200 г", w11_14: "220 г" },
          { name: "Витамин салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Кептірілген жеміс компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Ірімшік қосылған тоқаш"]
      },
      {
        day: "Сәрсенбі",
        breakfast: [
          { name: "Достық ботқасы (тары)", w7_10: "200 г", w11_14: "220 г" },
          { name: "Май мен ірімшік, нан", w7_10: "50 г", w11_14: "50 г" },
          { name: "Сүттегі какао", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Бұршақ сорпасы(горох)", w7_10: "200 г", w11_14: "250 г" },
          { name: "Тефтели, гарнирге күріш", w7_10: "200 г", w11_14: "220 г" },
          { name: "Кептірілген жеміс компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" },
          { name: "Печенье", w7_10: "40 г", w11_14: "40 г" }
        ],
        snack: ["Тауық етімен самса"]
      },
      {
        day: "Бейсенбі",
        breakfast: [
          { name: "Қарақұмық ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Пісірілген жұмыртқа", w7_10: "1", w11_14: "1" },
          { name: "Лимонмен шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Жасымық сорпасы чечевица", w7_10: "200 г", w11_14: "250 г" },
          { name: "Қазақша ет", w7_10: "200 г", w11_14: "220 г" },
          { name: "Жаңа піскен көкөніс салаты", w7_10: "60 г", w11_14: "80 г" },
          { name: "Кептірілген жеміс компоты", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Сыр қосылған тоқаш"]
      },
      {
        day: "Жұма",
        breakfast: [
          { name: "Күріш ботқасы", w7_10: "200 г", w11_14: "220 г" },
          { name: "Ірімшік пен нан", w7_10: "40 г", w11_14: "50 г" },
          { name: "Лимонмен шай", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        lunch: [
          { name: "Бұршақ сорпасы (маш)", w7_10: "200 г", w11_14: "250 г" },
          { name: "Нут қосылған күркетауық етінен палау", w7_10: "200 г", w11_14: "220 г" },
          { name: "Алма", w7_10: "1", w11_14: "1" },
          { name: "Лимон-алма сусыны", w7_10: "200 мл", w11_14: "200 мл" },
          { name: "Қара бидай наны", w7_10: "20 г", w11_14: "35 г" }
        ],
        snack: ["Алма", "Тоқаш"]
      }
    ]
  };

  const weeklyMenu = menuByWeek[selectedWeek as keyof typeof menuByWeek];

  // FAQ data
  const faqData = [
    {
      question: "Өз тамағын алып келуге бола ма?",
      answer: "Иә, бірақ алдын ала мұғалімге хабарлау керек. Үй тамағы санитарлық талаптарға сай болуы қажет."
    },
    {
      question: "Ет жемейтін балаларға қандай балама бар?",
      answer: "Біз вегетариандық мәзір ұсынамыз: көкөніс сорпалары, жеміс-көкөніс салаттары, сүт өнімдері."
    },
    {
      question: "Тамақтануға қалай жазылуға болады?",
      answer: "Мектеп кеңсесіне хабарласып, арнайы форманы толтыру керек. Ай басында төлем жасалады."
    },
    {
      question: "Аллергиясы бар балаларға қандай жағдай жасалған?",
      answer: "Медициналық анықтама негізінде жеке мәзір құрастырамыз. Ата-аналармен бірлесе отырып жұмыс істейміз."
    }
  ];

  return (
    <>
      <SEOHead page="home" />

      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        {/* Header with Back Button - Enhanced for mobile */}
        

        {/* Sub-Navigation Menu */}
        <div className="sticky top-16 sm:top-20 lg:top-24 z-30 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-gray-200 dark:border-blue-500/20 shadow-lg transition-all duration-500">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-start md:justify-center space-x-1 py-3 whitespace-nowrap overflow-x-auto scrollbar-hide w-full [&>*]:shrink-0">
              <button
                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'menu' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Апталық мәзір
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'menu' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'schedule' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Жұмыс кестесі
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'schedule' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'gallery' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Фотогалерея
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'gallery' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('norms')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'norms' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Нормалар мен құрам
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'norms' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>

              <button
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                  activeSection === 'faq' 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Сұрақтар мен жаңалықтар
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'faq' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-12 pb-6 sm:pb-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Мектеп <span className="text-blue-500">асханасы</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Сапалы және пайдалы тамақтану – балалардың денсаулығының кепілі
          </p>
        </div>


          <div className="grid lg:grid-cols-2 gap-8 mb-6">
            {/* Weekly Menu */}
            <Card id="menu" className="lg:col-span-2 dark:bg-[#1e293b] dark:border-gray-700 scroll-mt-24">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                    <ChefHat className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span>Апталық мәзір</span>
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4].map((week) => (
                      <Button
                        key={week}
                        onClick={() => setSelectedWeek(week)}
                        variant={selectedWeek === week ? "default" : "outline"}
                        size="sm"
                        className={`${
                          selectedWeek === week 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                        data-testid={`button-week-${week}`}
                      >
                        {week}-апта
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {/* Mobile View - Stacked Cards */}
                <div className="block md:hidden space-y-4">
                  {weeklyMenu.map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-[#0f172a] rounded-lg p-4 border dark:border-gray-700">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3 text-center">{item.day}</h4>
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-[#1e293b] p-3 rounded border-l-4 border-yellow-400">
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Таңғы ас</div>
                          <div className="space-y-1.5">
                            {item.breakfast.map((b, idx) => (
                              <div key={idx} className="flex justify-between text-xs border-b border-gray-100 dark:border-gray-800 pb-1 last:border-0 last:pb-0">
                                <span className="font-medium dark:text-gray-300">{b.name}</span>
                                <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                  {b.w7_10} / {b.w11_14}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-[#1e293b] p-3 rounded border-l-4 border-green-400">
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Түскі ас</div>
                          <div className="space-y-1.5">
                            {item.lunch.map((l, idx) => (
                              <div key={idx} className="flex justify-between text-xs border-b border-gray-100 dark:border-gray-800 pb-1 last:border-0 last:pb-0">
                                <span className="font-medium dark:text-gray-300">{l.name}</span>
                                <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                  {l.w7_10} / {l.w11_14}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-[#1e293b] p-3 rounded border-l-4 border-blue-400">
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Бесіндік ас</div>
                          <div className="space-y-1 text-xs dark:text-gray-400">
                            {item.snack.map((s, idx) => (
                              <div key={idx} className="font-medium">{s}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 min-w-full text-sm">
                    <thead>
                      <tr className="bg-blue-50 dark:bg-blue-900/20 dark:text-gray-200">
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-center font-bold align-middle" rowSpan={2}>Апта күндері</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-center font-bold" colSpan={3}>Таңғы Ас</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-center font-bold" colSpan={3}>Түскі Ас</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-2 text-center font-bold align-middle" rowSpan={2}>Бесіндік Ас</th>
                      </tr>
                      <tr className="bg-blue-50/50 dark:bg-blue-900/10 dark:text-gray-300 text-xs">
                        <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-left font-semibold">Тағам атауы</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-center font-semibold whitespace-nowrap">7-10 жас</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-center font-semibold whitespace-nowrap">11-14 жас</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-left font-semibold">Тағам атауы</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-center font-semibold whitespace-nowrap">7-10 жас</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-1.5 text-center font-semibold whitespace-nowrap">11-14 жас</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyMenu.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                          <td className="border border-gray-300 dark:border-gray-600 p-3 font-bold text-center whitespace-nowrap dark:text-gray-200 align-middle">
                            {item.day}
                          </td>
                          {/* Таңғы ас - Название */}
                          <td className="border border-gray-300 dark:border-gray-600 p-0 align-top">
                            {item.breakfast.map((b, i) => (
                              <div key={i} className="p-2 border-b border-gray-200 dark:border-gray-700 last:border-0 min-h-[2.5rem] flex items-center dark:text-gray-300 text-xs font-medium">
                                {b.name}
                              </div>
                            ))}
                          </td>
                          {/* Таңғы ас - 7-10 жас */}
                          <td className="border border-gray-300 dark:border-gray-600 p-0 align-top">
                            {item.breakfast.map((b, i) => (
                              <div key={i} className="p-2 border-b border-gray-200 dark:border-gray-700 last:border-0 min-h-[2.5rem] flex items-center justify-center font-semibold text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                                {b.w7_10}
                              </div>
                            ))}
                          </td>
                          {/* Таңғы ас - 11-14 жас */}
                          <td className="border border-gray-300 dark:border-gray-600 p-0 align-top">
                            {item.breakfast.map((b, i) => (
                              <div key={i} className="p-2 border-b border-gray-200 dark:border-gray-700 last:border-0 min-h-[2.5rem] flex items-center justify-center font-semibold text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                                {b.w11_14}
                              </div>
                            ))}
                          </td>

                          {/* Түскі ас - Название */}
                          <td className="border border-gray-300 dark:border-gray-600 p-0 align-top">
                            {item.lunch.map((l, i) => (
                              <div key={i} className="p-2 border-b border-gray-200 dark:border-gray-700 last:border-0 min-h-[2.5rem] flex items-center dark:text-gray-300 text-xs font-medium">
                                {l.name}
                              </div>
                            ))}
                          </td>
                          {/* Түскі ас - 7-10 жас */}
                          <td className="border border-gray-300 dark:border-gray-600 p-0 align-top">
                            {item.lunch.map((l, i) => (
                              <div key={i} className="p-2 border-b border-gray-200 dark:border-gray-700 last:border-0 min-h-[2.5rem] flex items-center justify-center font-semibold text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                                {l.w7_10}
                              </div>
                            ))}
                          </td>
                          {/* Түскі ас - 11-14 жас */}
                          <td className="border border-gray-300 dark:border-gray-600 p-0 align-top">
                            {item.lunch.map((l, i) => (
                              <div key={i} className="p-2 border-b border-gray-200 dark:border-gray-700 last:border-0 min-h-[2.5rem] flex items-center justify-center font-semibold text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                                {l.w11_14}
                              </div>
                            ))}
                          </td>

                          {/* Бесіндік ас */}
                          <td className="border border-gray-300 dark:border-gray-600 p-2 align-middle text-center dark:text-gray-300 text-xs">
                            <div className="space-y-1">
                              {item.snack.map((s, i) => (
                                <div key={i} className="font-semibold">{s}</div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Work Schedule */}
            <Card id="schedule" className="dark:bg-[#1e293b] dark:border-gray-700 scroll-mt-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>Жұмыс кестесі</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="font-medium dark:text-gray-200">Таңғы ас</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">08:30 - 09:00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="font-medium dark:text-gray-200">Түскі ас</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">12:30 - 13:30</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="font-medium dark:text-gray-200">Бесін ас</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">15:30 - 16:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photos Section */}
          <Card id="gallery" className="mb-6 dark:bg-[#1e293b] dark:border-gray-700 scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Асхана фотогалереясы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {displayMedia.map((media, index) => (
                    <div 
                      key={index} 
                      className="relative rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedImage(media.url)}
                    >
                      <img 
                        src={media.url} 
                        alt={media.caption || "Асхана фотосы"}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">{media.caption || "Асхана фотосы"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div id="norms" className="grid lg:grid-cols-2 gap-8 mb-6 scroll-mt-24">
            {/* Sanitary Norms */}
            <Card className="dark:bg-[#1e293b] dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>Санитарлық нормалар</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-gray-800 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Күнделікті температуралық бақылау</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-800 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Сертификатталған өнімдер ғана</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-800 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>HACCP жүйесі бойынша жұмыс</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-800 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Апта сайынғы лабораториялық тексеру</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="dark:bg-[#1e293b] dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>Жауапты қызметкер</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Амирова Айгүл Серікқызы</h4>
                    <p className="text-gray-600 dark:text-gray-300">Асхана жетекшісі</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="dark:text-gray-300">+7‒775‒790‒63‒63</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="dark:text-gray-300">canteen@bilimdi-urpaq.kz</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Food Composition and Calories */}
          <Card className="mb-6 dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <Apple className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Тағам құрамы мен калориялығы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-400 mb-3">Витаминдер</h4>
                  <ul className="space-y-2 text-sm dark:text-gray-300">
                    <li>Витамин A, B, C, D</li>
                    <li>Кальций, темір</li>
                    <li>Фолий қышқылы</li>
                    <li>Омега-3 майлары</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-3">Калория</h4>
                  <ul className="space-y-2 text-sm dark:text-gray-300">
                    <li>Таңғы ас: 400-450 ккал</li>
                    <li>Түскі ас: 600-700 ккал</li>
                    <li>Бесін ас: 200-250 ккал</li>
                    <li>Жалпы: 1200-1400 ккал</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Аллергендер
                  </h4>
                  <ul className="space-y-2 text-sm dark:text-gray-300">
                    <li>Сүт өнімдері</li>
                    <li>Глютен (бидай)</li>
                    <li>Жаңғақ</li>
                    <li>Жұмыртқа</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canteen Rules */}
          <Card className="mb-6 dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Асхана ережелері</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Балаларға арналған ережелер:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Алдымен қолды жуамыз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Дастархан басында тыныш отырамыз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Тамақты барлығымыз бірге ішеміз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Тамақ қалдықтарын қоқыс жәшігіне саламыз</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Қауіпсіздік ережелері:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Ыстық тағамға абай боламыз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Аллергия туралы мұғалімге айтамыз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Асханада жүгірмейміз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Үлкендердің рұқсатынсыз ештеңе алмаймыз</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div id="faq" className="scroll-mt-24">
          <Card className="mb-6 dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Жиі қойылатын сұрақтар</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqData.map((item, index) => (
                  <details key={index} className="group bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      {item.question}
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-3 text-gray-600 dark:text-gray-300">
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* News and Announcements */}
          <Card className="mb-6 dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Жаңалықтар мен хабарламалар</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-400">Жаңа мәзір</h4>
                  <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">1 қазаннан бастап күзгі мәзір енгізіледі</p>
                  <p className="text-blue-600 dark:text-blue-400 text-xs mt-2">28 қыркүйек 2025</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 dark:text-green-400">Органикалық өнімдер</h4>
                  <p className="text-green-700 dark:text-green-400 text-sm mt-1">Енді мәзірде 100% органикалық көкөністер</p>
                  <p className="text-green-600 dark:text-green-400 text-xs mt-2">15 қыркүйек 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>


        </div>
      </div>

      {/* Image Modal Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-none" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Суретті толық көлемде көру</DialogTitle>
          <div className="relative">
            <DialogClose className="absolute -top-12 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-700 transition-colors z-50">
              <X className="w-6 h-6 text-gray-800 dark:text-gray-100" />
            </DialogClose>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Үлкейтілген сурет"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CanteenPage;