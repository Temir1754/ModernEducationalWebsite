import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DevelopmentDirection {
  id: number;
  title: string;
  description: string;
  features: string[];
  color: string;
  bgColor: string;
}

const directions: DevelopmentDirection[] = [
  {
    id: 1,
    title: "ШЫҒАРМАШЫЛЫҚ",
    description: "Балалардың эстетикалық талғамын, шығармашылық ойлауын және көркем қабілеттерін дамыту. Хореография, домбыра, дизайн және глинолепка сияқты үйірмелер арқылы өнерге деген сүйіспеншілікті ояту.",
    features: [
      "Эстетикалық талғам дамыту",
      "Шығармашылық ойлау",
      "Көркем қабілеттер",
      "Өнерге деген сүйіспеншілік"
    ],
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  {
    id: 2,
    title: "ИНТЕЛЛЕКТУАЛДЫ",
    description: "Ғылыми ойлау, зерттеушілік дағдылар мен логикалық талдауды дамыту. Математика, физика, химия және басқа ғылыми пәндер арқылы зияткерлік қабілеттерді жетілдіру.",
    features: [
      "Ғылыми ойлау дамыту",
      "Зерттеушілік дағдылар",
      "Логикалық талдау",
      "Зияткерлік қабілеттер"
    ],
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: 3,
    title: "ДЕНЕ ДАМЫТУ",
    description: "Дене шынықтыру, командалық жұмыс және жеңіске деген ұмтылысты дамыту. Тэквондо, футбол және басқа спорт түрлері арқылы денсаулықты нығайту және жігер ашу.",
    features: [
      "Дене шынықтыру",
      "Командалық жұмыс",
      "Жеңіске ұмтылыс",
      "Денсаулық нығайту"
    ],
    color: "text-green-600",
    bgColor: "bg-green-50"
  }
];

export default function MobileDevelopmentCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % directions.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + directions.length) % directions.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % directions.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentDirection = directions[currentIndex];

  return (
    <div className="relative w-full">
      {/* Main Card */}
      <Card className={`${currentDirection.bgColor} border-2 border-opacity-20 shadow-lg transition-all duration-500`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className={`text-xl font-bold ${currentDirection.color} mb-3 text-center`}>
              {currentDirection.title}
            </h3>
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              {currentDirection.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {currentDirection.features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center text-sm text-gray-700 bg-white bg-opacity-60 p-2 rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full ${currentDirection.color.replace('text-', 'bg-')} mr-3`}></div>
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-4">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {directions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? `${currentDirection.color.replace('text-', 'bg-')} shadow-sm` 
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

      {/* Auto-play indicator */}
      <div className="flex items-center justify-center mt-3">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
            isAutoPlaying 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isAutoPlaying ? 'Автоматты ауысу' : 'Қолмен басқару'}
        </button>
      </div>
    </div>
  );
}