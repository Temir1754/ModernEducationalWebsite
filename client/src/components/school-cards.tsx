import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";

interface SchoolCardProps {
  id: string;
  title: string;
  description: string;
  features: string[];
  tag: string;
  ctaText?: string;
  ctaUrl?: string;
  bgGradient: string;
  tagColor: string;
}

interface SchoolCardsProps {
  items?: SchoolCardProps[];
  showAllButton?: boolean;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

// Default data for FGS school facts
const defaultItems: SchoolCardProps[] = [
  {
    id: "upay",
    title: "UPay электронды валютасы",
    description: "Android және iOS жүйелеріндегі мектептің өз электронды валютасы",
    features: [
      "Тамақ ақысын төлеу жүйесі",
      "Балансты бақылау мүмкіндігі", 
      "Қауіпсіз төлем әдісі",
      "Ата-аналар үшін ыңғайлы"
    ],
    tag: "Инновация",
    ctaText: "Көбірек білу",
    ctaUrl: "/students#upay",
    bgGradient: "from-purple-500 to-pink-500",
    tagColor: "bg-purple-100 text-purple-800"
  },
  {
    id: "games",
    title: "Интеллектуалды ойындар",
    description: "\"Бұқа мен сиыр\" сияқты зияткерлік ойындар өткізіледі",
    features: [
      "Логикалық ойлауды дамыту",
      "Командалық жұмыс дағдысы",
      "Интеллектуалды бәсекелестік",
      "Ойын арқылы оқыту"
    ],
    tag: "Дамыту",
    ctaText: "Ойындарды көру",
    ctaUrl: "#",
    bgGradient: "from-green-500 to-teal-500",
    tagColor: "bg-green-100 text-green-800"
  },
  {
    id: "history",
    title: "2022 жылдан бастап",
    description: "Мектеп 2022 жылдан бері қызмет етеді және жылдам дамып келеді",
    features: [
      "Жас және серпінді ұжым",
      "Заманауи оқыту әдістері",
      "Үздіксіз даму процесі",
      "Инновациялық тәсілдер"
    ],
    tag: "Тарих",
    ctaText: "Тарихымыз",
    ctaUrl: "#",
    bgGradient: "from-blue-500 to-indigo-500",
    tagColor: "bg-blue-100 text-blue-800"
  },
  {
    id: "director",
    title: "Білікті директор",
    description: "Директор РФМШ және Назарбаев университетінің түлегі",
    features: [
      "Жоғары білім деңгейі",
      "Мектеп басқару тәжірибесі",
      "Заманауи көзқарас",
      "Кәсіби дамыту"
    ],
    tag: "Басшылық",
    ctaText: "Басшылық",
    ctaUrl: "#",
    bgGradient: "from-yellow-500 to-orange-500",
    tagColor: "bg-yellow-100 text-yellow-800"
  },
  {
    id: "reports",
    title: "Ай сайынғы есеп",
    description: "Ата-аналарға баланың үлгерімі туралы толық есеп беріледі",
    features: [
      "Толық академиялық есеп",
      "Әлеуметтік дамуын бағалау",
      "Жеке кеңестер беру",
      "Ашық коммуникация"
    ],
    tag: "Бақылау",
    ctaText: "Есеп жүйесі",
    ctaUrl: "#",
    bgGradient: "from-pink-500 to-rose-500",
    tagColor: "bg-pink-100 text-pink-800"
  },
  {
    id: "curators",
    title: "Сынып кураторлары",
    description: "Әр сыныпта жеке куратор бар, балаларға толық қолдау көрсетеді",
    features: [
      "Жеке тәрбиелік жұмыс",
      "Ата-аналармен байланыс",
      "Психологиялық қолдау",
      "Әлеуметтік дамытуды бақылау"
    ],
    tag: "Қолдау",
    ctaText: "Кураторлар",
    ctaUrl: "#",
    bgGradient: "from-teal-500 to-cyan-500",
    tagColor: "bg-teal-100 text-teal-800"
  },
  {
    id: "auctions",
    title: "Тоқсанда бір рет аукцион",
    description: "Оқушылар електронды валютаны жинап, аукционда сыйлықтарға сатып алады",
    features: [
      "Электронды валютаны жинау жүйесі",
      "Тоқсанда бір рет өткізілетін аукцион",
      "Оқу нәтижелері үшін сыйлық",
      "Мотивацияны арттыру әдісі"
    ],
    tag: "Мотивация",
    ctaText: "Аукцион жүйесі",
    ctaUrl: "#",
    bgGradient: "from-amber-500 to-yellow-500",
    tagColor: "bg-amber-100 text-amber-800"
  }
];

// Intersection Observer hook for scroll animations
function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
}

// Individual Card Component
function SchoolCard({ item, index }: { item: SchoolCardProps; index: number }) {
  const [cardRef, isVisible] = useIntersectionObserver();
  
  const cardContent = (
    <Card 
      className="group h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden"
      data-testid={`card-${item.id}`}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header with gradient background */}
        <div className={`bg-gradient-to-r ${item.bgGradient} p-6 text-white relative overflow-hidden`}>
          <div className="relative z-10">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${item.tagColor}`}>
              {item.tag}
            </div>
            <h3 className="text-xl font-bold mb-2 leading-tight">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-gray-600 mb-6 leading-relaxed">
            {item.description}
          </p>

          {/* Features list */}
          <div className="space-y-3 mb-6 flex-1">
            {item.features.map((feature, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>


        </div>
      </CardContent>
    </Card>
  );
  
  const articleContent = item.ctaUrl && item.ctaUrl !== "#" ? (
    <Link 
      href={item.ctaUrl} 
      className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
      aria-label={`Перейти к ${item.title}`}
    >
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
  
  return (
    <article
      ref={cardRef}
      className={`
        transform transition-all duration-700 ease-out
        ${isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-8 opacity-0'
        }
      `}
      style={{ 
        transitionDelay: `${index * 150}ms` 
      }}
    >
      {articleContent}
    </article>
  );
}

// Main component
export default function SchoolCards({ 
  items = defaultItems, 
  showAllButton = false,
  sectionTitle = "Мектеп туралы қызықты фактілер",
  sectionSubtitle = "FGS мектебін ерекше ететін жаңашыл әдістер мен жетістіктер"
}: SchoolCardsProps) {
  const [sectionRef, isSectionVisible] = useIntersectionObserver();
  const [activeSection, setActiveSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll to update active indicator
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const currentSection = Math.round(scrollLeft / containerWidth);
      setActiveSection(currentSection);
    }
  };

  // Click handler for indicators
  const scrollToSection = (sectionIndex: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      container.scrollTo({
        left: sectionIndex * containerWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#0f172a]" ref={sectionRef}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`
          text-center mb-12 transform transition-all duration-700
          ${isSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {sectionTitle}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {/* Snap Scroll Container with 3 Sections (3-3-1) */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          onScroll={handleScroll}
        >
          <div className="flex space-x-8 pb-4">
            
            {/* Section 1: First 3 cards */}
            <div className="flex-none w-full snap-center">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {items.slice(0, 3).map((item, index) => (
                  <SchoolCard key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>

            {/* Section 2: Next 3 cards */}
            <div className="flex-none w-full snap-center">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {items.slice(3, 6).map((item, index) => (
                  <SchoolCard key={item.id} item={item} index={index + 3} />
                ))}
              </div>
            </div>

            {/* Section 3: Last 1 card centered */}
            <div className="flex-none w-full snap-center">
              <div className="flex justify-center max-w-md mx-auto">
                {items.slice(6, 7).map((item, index) => (
                  <SchoolCard key={item.id} item={item} index={index + 6} />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Scroll to section ${index + 1}`}
            />
          ))}
        </div>

        {/* Optional "View All" Button */}
        {showAllButton && (
          <div className={`
            text-center mt-12 transform transition-all duration-700 delay-1000
            ${isSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = '/kruzhki'}
              aria-label="Барлық үйірмелерді көру"
            >
              <span className="mr-3">Барлық үйірмелерді көру</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

/* 
// Usage Example (import in App.tsx or any component):
import SchoolCards from '@/components/school-cards';

// Basic usage with default data:
<SchoolCards />

// With custom data:
<SchoolCards 
  items={customSchoolFacts}
  showAllButton={true}
  sectionTitle="Custom Title"
  sectionSubtitle="Custom subtitle"
/>

// CSS classes for customization:
// - Change colors: Modify bgGradient and tagColor in items data
// - Change fonts: Override text classes in the component
// - Change spacing: Modify padding/margin classes (p-6, mb-4, etc.)
// - Change animations: Modify duration and delay values in transition classes
*/