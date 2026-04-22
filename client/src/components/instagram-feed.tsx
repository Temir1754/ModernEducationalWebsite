import { Instagram, Pencil, Loader2, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface InstagramFeedProps {
  widgetId?: string;
}

export default function InstagramFeed({ widgetId }: InstagramFeedProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newWidgetId, setNewWidgetId] = useState(widgetId || "5b3b2e5f-c046-4903-98d6-9258f4e7638e");

  const updateWidgetIdMutation = useMutation({
    mutationFn: async (id: string) => {
      // First check if the content item exists
      const checkRes = await fetch("/api/content?key=instagram_widget_id");
      const existing = await checkRes.json();
      
      if (existing.length > 0) {
        // Update existing
        const res = await fetch(`/api/content/${existing[0].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: id }),
        });
        if (!res.ok) throw new Error("Failed to update widget ID");
      } else {
        // Create new
        const res = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            key: "instagram_widget_id", 
            value: id,
            lang: "kz",
            type: "text" 
          }),
        });
        if (!res.ok) throw new Error("Failed to create widget ID");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setIsEditing(false);
      toast({ title: "Instagram виджеті жаңартылды" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Қате", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  useEffect(() => {
    if (!newWidgetId) return;
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
    <section className="pt-8 pb-16 bg-gray-50 dark:bg-[#0f172a]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

        <div className="max-w-7xl mx-auto relative group">
          {user?.role === "admin" && (
            <div className="absolute -top-10 right-0 z-20">
              {isEditing ? (
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-xl border border-blue-100 dark:border-blue-900 border-2">
                  <Input 
                    value={newWidgetId}
                    onChange={(e) => setNewWidgetId(e.target.value)}
                    placeholder="Elfsight Widget ID"
                    className="w-48 h-8 text-xs"
                  />
                  <Button 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                    onClick={() => updateWidgetIdMutation.mutate(newWidgetId)}
                    disabled={updateWidgetIdMutation.isPending}
                  >
                    {updateWidgetIdMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setIsEditing(false);
                      setNewWidgetId(widgetId || "");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold shadow-lg"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Виджет ID өңдеу
                </Button>
              )}
            </div>
          )}

          {newWidgetId ? (
            /* Elfsight Widget Container */
            <div 
              className={`elfsight-app-${newWidgetId}`} 
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
