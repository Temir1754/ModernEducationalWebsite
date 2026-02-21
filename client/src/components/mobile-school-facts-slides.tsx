import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SchoolFact {
  id: number;
  title: string;
  description: string;
  number: string;
  unit: string;
  color: string;
  bgGradient: string;
}

const schoolFacts: SchoolFact[] = [
  {
    id: 1,
    title: "UPay электронды валютасы",
    description: "Android және iOS жүйелеріндегі мектептің өз электронды валютасы",
    number: "2022",
    unit: "жылдан",
    color: "text-purple-600",
    bgGradient: "bg-gradient-to-br from-purple-100 to-purple-200"
  },
  {
    id: 2,
    title: "Интеллектуалды ойындар",
    description: "\"Бұқа мен сиыр\" сияқты зияткерлік ойындар өткізіледі",
    number: "Дамыту",
    unit: "ойындары",
    color: "text-green-600",
    bgGradient: "bg-gradient-to-br from-green-100 to-green-200"
  },
  {
    id: 3,
    title: "2022 жылдан бастап",
    description: "Мектеп 2022 жылдан бері қызмет етеді және жылдам дамып келеді",
    number: "3",
    unit: "жыл",
    color: "text-blue-600",
    bgGradient: "bg-gradient-to-br from-blue-100 to-blue-200"
  },
  {
    id: 4,
    title: "Білікті директор",
    description: "Директор РФМШ және Назарбаев университетінің түлегі",
    number: "Жоғары",
    unit: "білім",
    color: "text-yellow-600",
    bgGradient: "bg-gradient-to-br from-yellow-100 to-yellow-200"
  },
  {
    id: 5,
    title: "Ай сайынғы есеп",
    description: "Ата-аналарға баланың үлгерімі туралы толық есеп беріледі",
    number: "Толық",
    unit: "бақылау",
    color: "text-pink-600",
    bgGradient: "bg-gradient-to-br from-pink-100 to-pink-200"
  },
  {
    id: 6,
    title: "Сынып кураторлары",
    description: "Әр сыныпта жеке куратор бар, балаларға толық қолдау көрсетеді",
    number: "Жеке",
    unit: "қолдау",
    color: "text-teal-600",
    bgGradient: "bg-gradient-to-br from-teal-100 to-teal-200"
  },
  {
    id: 7,
    title: "Тоқсанда бір рет аукцион",
    description: "Оқушылар електронды валютаны жинап, аукционда сыйлықтарға сатып алады",
    number: "Мотив",
    unit: "жүйесі",
    color: "text-amber-600",
    bgGradient: "bg-gradient-to-br from-amber-100 to-amber-200"
  }
];

export default function MobileSchoolFactsSlides() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % schoolFacts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + schoolFacts.length) % schoolFacts.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % schoolFacts.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentFact = schoolFacts[currentIndex];

  return (
    <div className="relative w-full">
      {/* Main Slide */}
      <Card className={`${currentFact.bgGradient} border-none shadow-xl overflow-hidden`}>
        <CardContent className="p-6 text-center">
          {/* Header Decoration */}
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-80 px-4 py-2 rounded-full shadow-lg">
              <div className={`${currentFact.color} font-bold text-sm`}>
              МЕКТЕП ФАКТІЛЕРІ
            </div>
            </div>
          </div>

          {/* Number */}

          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {currentFact.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentFact.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Progress Indicator */}
        <div className="flex space-x-1">
          {schoolFacts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? `${currentFact.color.replace('text-', 'bg-')} w-6` 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Slide Counter & Auto-play */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500">
          {currentIndex + 1} / {schoolFacts.length}
        </div>
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
            isAutoPlaying 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isAutoPlaying ? 'Автоматты' : 'Қолмен'}
        </button>
      </div>
    </div>
  );
}