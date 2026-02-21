
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NewsItem {
  id: string; // Changed to string to match DB UUID
  title: string;
  description: string;
  date: string;
  image: string;
  category?: string;
  link?: string;
}

interface MobileNewsSlidesProps {
  items: NewsItem[];
}

export default function MobileNewsSlides({ items }: MobileNewsSlidesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Use items or empty array to prevent crashes
  const safeItems = items || [];

  useEffect(() => {
    if (!isAutoPlaying || safeItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, safeItems.length]);

  if (safeItems.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % safeItems.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Қабылдау": return "bg-blue-100 text-blue-800";
      case "Жетістіктер": return "bg-green-100 text-green-800";
      case "Жаңалықтар": return "bg-purple-100 text-purple-800";
      case "Білім беру": return "bg-orange-100 text-orange-800";
      case "Іс-шаралар": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const currentNews = safeItems[currentIndex];

  if (!currentNews) return null;

  return (
    <div className="relative w-full">
      {/* Main News Slide */}
      <Card className="bg-white border-2 border-blue-100 shadow-xl overflow-hidden">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {currentNews.image ? (
            <img
              src={currentNews.image}
              alt={currentNews.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          {currentNews.category && (
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentNews.category)}`}>
                {currentNews.category}
              </span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center text-white text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {currentNews.date}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
            {currentNews.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {currentNews.description}
          </p>

          {/* Read More Button */}
          <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200">
            <span>Толығырақ оқу</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>
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

        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {safeItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex
                  ? 'bg-blue-600 shadow-md'
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

      {/* Controls */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500">
          {currentIndex + 1} / {safeItems.length}
        </div>
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${isAutoPlaying
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