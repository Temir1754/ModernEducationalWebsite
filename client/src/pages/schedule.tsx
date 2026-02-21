import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import SEOHead from "@/components/seo-head";

const scheduleImages = [
  { class: "1ә", file: "/schedules/1ә.png" },
  { class: "1а", file: "/schedules/1а.png" },
  { class: "1б", file: "/schedules/1б.png" },
  { class: "2ә", file: "/schedules/2ә.png" },
  { class: "2а", file: "/schedules/2а.png" },
  { class: "2б", file: "/schedules/2б.png" },
  { class: "3ә", file: "/schedules/3ә.png" },
  { class: "3а", file: "/schedules/3а.png" },
  { class: "3б", file: "/schedules/3б.png" },
  { class: "3в", file: "/schedules/3в.png" },
  { class: "4ә", file: "/schedules/4ә.png" },
  { class: "4а", file: "/schedules/4а.png" },
  { class: "4б", file: "/schedules/4б.png" },
  { class: "5ә", file: "/schedules/5ә.png" },
  { class: "5а", file: "/schedules/5а.png" },
  { class: "5б", file: "/schedules/5б.png" },
  { class: "6а", file: "/schedules/6а.png" },
  { class: "6б", file: "/schedules/6б.png" },
  { class: "7а", file: "/schedules/7а.png" },
  { class: "8ә", file: "/schedules/8ә.png" },
  { class: "8а", file: "/schedules/8а.png" },
  { class: "8б", file: "/schedules/8б.png" },
  { class: "9а", file: "/schedules/9а.png" },
];

export default function SchedulePage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + scheduleImages.length) % scheduleImages.length : null);
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % scheduleImages.length : null);

  return (
    <>
      <SEOHead page="home" />

      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        {/* Header */}
        <div className="bg-white dark:bg-[#1e293b] shadow-sm border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/students"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Оқушылар бөліміне оралу</span>
                <span className="sm:hidden">Артқа</span>
              </Link>
              <div className="text-center flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Сабақ кестесі
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  2025-2026 оқу жылы
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid of class schedules */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {scheduleImages.map((item, index) => (
              <button
                key={item.class}
                onClick={() => openLightbox(index)}
                className="group flex flex-col items-center bg-white dark:bg-[#1e293b] rounded-xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:scale-105"
              >
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={item.file}
                    alt={`${item.class} сынып кестесі`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="w-full py-2 px-3 text-center">
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                    {item.class} сынып
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Class label */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-bold text-lg bg-black/40 px-4 py-1 rounded-full">
            {scheduleImages[lightboxIndex].class} сынып
          </div>

          {/* Prev */}
          <button
            className="absolute left-2 sm:left-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
            onClick={e => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <img
            src={scheduleImages[lightboxIndex].file}
            alt={`${scheduleImages[lightboxIndex].class} сынып кестесі`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          <button
            className="absolute right-2 sm:right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
            onClick={e => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {scheduleImages.length}
          </div>
        </div>
      )}
    </>
  );
}
