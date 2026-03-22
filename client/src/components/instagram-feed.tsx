import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram } from "lucide-react";

interface InstagramFeedProps {
  widgetId?: string; // Optional: The ID provided by Elfsight/LightWidget
}

export default function InstagramFeed({ widgetId }: InstagramFeedProps) {
  useEffect(() => {
    // If we have an Elfsight widget, we need to load their platform script
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#0f172a]/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20">
            <Instagram className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Біздің Instagram
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            @fgs.schoolkz парақшасына жазылып, мектеп өмірін бақылаңыз
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {widgetId ? (
            /* Elfsight Widget Container */
            <div 
              className={`elfsight-app-${widgetId}`} 
              data-elfsight-app-lazy
            ></div>
          ) : (
            /* Placeholder / Instructions if no ID is provided */
            <Card className="border-2 border-dashed border-pink-200 dark:border-pink-900 bg-white/50 dark:bg-white/5 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                    <Instagram className="w-12 h-12 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      Instagram лентасын қосу үшін:
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                      Elfsight немесе ұқсас сервистен виджет кодындағы ID-ді осы жерге қойыңыз. 
                      Қазірше сіз біздің парақшаға тікелей өте аласыз:
                    </p>
                    <a 
                      href="https://www.instagram.com/fgs.schoolkz/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      Инстаграмға өту
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
