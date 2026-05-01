import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Plus, Trash2, Loader2, Upload, Pencil } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/seo-head";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import type { Media } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  });

  const { user } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");

  const { data: mediaItems = [] } = useQuery<Media[]>({
    queryKey: ["/api/media", "gallery"],
    queryFn: async () => {
      const res = await fetch("/api/media?section=gallery");
      if (!res.ok) return [];
      const data = await res.json();
      return data.filter((m: any) => m.section === "gallery" || !m.section);
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!uploadFile) return;

      const formData = new FormData();
      formData.append("file", uploadFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();

      const mediaRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image",
          url,
          section: "gallery"
        }),
      });

      if (!mediaRes.ok) throw new Error("Failed to save media");
      return mediaRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setIsUploadOpen(false);
      setUploadFile(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Attempting to delete media with ID:", id);
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Удаление не удалось");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      console.log("Media deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Delete error:", error);
      if (error.message.includes("Unauthorized")) {
        alert("Қате: Сессияңыз аяқталды. Қайта кіру үшін /admin бетіне өтіңіз.");
      } else {
        alert("Қате: " + error.message);
      }
    }
  });

  const updateCaptionMutation = useMutation({
    mutationFn: async ({ id, caption }: { id: string; caption: string }) => {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });
      if (!res.ok) throw new Error("Failed to update caption");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setEditingMediaId(null);
      setEditCaption("");
    }
  });

  const handleEditCaption = (media: Media) => {
    setEditingMediaId(media.id);
    setEditCaption(media.caption || "");
  };

  const handleNext = useCallback(() => {
    if (selectedIndex === null || mediaItems.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % mediaItems.length);
  }, [selectedIndex, mediaItems]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null || mediaItems.length === 0) return;
    setSelectedIndex((selectedIndex - 1 + mediaItems.length) % mediaItems.length);
  }, [selectedIndex, mediaItems]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <>
      <SEOHead
        page="home"
        customTitle="Мектеп фотогалереясы | Білімді ұрпақ жекеменшік мектебі"
        customDescription="Білімді ұрпақ жекеменшік мектебінің өмірінен қызықты сәттер мен іс-шаралар галереясы. Біздің мектептегі оқу үдерісі мен іс-шаралардың суреттері."
        customKeywords="Білімді ұрпақ жекеменшік мектебі фотогалерея, мектеп суреттері, іс-шаралар, оқушылар, Шымкент мектеп"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        {/* Header with Back Button */}
        <div className="bg-transparent border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center">
              
              {/* Admin Upload Button */}
              {user && (
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-1" />
                      Фото қосу
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-slate-900 border-none shadow-2xl max-w-md w-[95vw]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Фото жүктеу</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Галереяға жаңа фотосурет жүктеңіз.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => uploadMutation.mutate(e)} className="space-y-6 pt-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Фото таңдау</Label>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            required
                            className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer h-12 flex items-center"
                          />
                        </div>
                        {uploadFile && (
                          <p className="text-xs text-blue-500 font-medium animate-pulse">
                            Файл таңдалды: {uploadFile.name}
                          </p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        disabled={uploadMutation.isPending || !uploadFile} 
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                      >
                        {uploadMutation.isPending ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            Жүктелуде...
                          </>
                        ) : (
                          "Жүктеу"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              {/* Edit Caption Dialog */}
              {user && editingMediaId && (
                <Dialog open={!!editingMediaId} onOpenChange={(open) => !open && setEditingMediaId(null)}>
                  <DialogContent className="bg-white border-gray-200">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900">Суреттің сипаттамасын өңдеу</DialogTitle>
                      <DialogDescription className="text-gray-500">
                        Таңдалған сурет үшін жаңа сипаттама енгізіңіз.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      updateCaptionMutation.mutate({ id: editingMediaId, caption: editCaption });
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Сипаттама</Label>
                        <Textarea
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          placeholder="Суреттің сипаттамасын жазыңыз"
                          rows={3}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={updateCaptionMutation.isPending}>
                        {updateCaptionMutation.isPending && <Loader2 className="animate-spin mr-2" />}
                        Сақтау
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-12 pb-6 sm:pt-16 sm:pb-8">
          <div className="text-center mb-8">
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Білімді ұрпақ жекеменшік мектебінің өмірінен қызықты сәттер мен іс-шаралар галереясы
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {mediaItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Суреттер әзірге жоқ
              </div>
            ) : (
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                  {mediaItems.map((media, index) => (
                    <div
                      key={media.id}
                      className="flex-[0_0_100%] min-w-0 px-2 lg:flex-[0_0_25%]"
                    >
                      <div
                        className="relative group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
                        onClick={() => setSelectedIndex(index)}
                      >
                        {/* Admin Header Bar */}
                        {user && (
                          <div className="flex justify-end gap-2 p-2 bg-slate-100 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
                             <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleEditCaption(media);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (window.confirm("Бұл суретті өшіруді растайсыз ба? (Confirm delete?)")) {
                                  deleteMutation.mutate(media.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        
                        <div className="h-[300px] lg:h-[280px]">
                          <img
                            src={media.url}
                            alt="Галерея"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {mediaItems.length > 0 && (
              <>
                <button
                  className={`hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 z-10 ${!prevBtnEnabled ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
                    }`}
                  onClick={scrollPrev}
                  disabled={!prevBtnEnabled}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-100" />
                </button>

                <button
                  className={`hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 z-10 ${!nextBtnEnabled ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
                    }`}
                  onClick={scrollNext}
                  disabled={!nextBtnEnabled}
                >
                  <ChevronRight className="w-6 h-6 text-gray-800 dark:text-gray-100" />
                </button>
              </>
            )}

            {/* Mobile Swipe Indicator */}
            {mediaItems.length > 0 && (
              <div className="lg:hidden text-center mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ← Көру үшін сырғытыңыз →
                </p>
              </div>
            )}
          </div>

          {/* Desktop Navigation Hint */}
          <div className="hidden lg:flex justify-center items-center gap-2 mt-8">
            <div className={`h-2 w-2 rounded-full transition-all duration-300 ${!prevBtnEnabled ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"
              }`} />
            <div className={`h-2 w-2 rounded-full transition-all duration-300 ${nextBtnEnabled ? "bg-gray-300 dark:bg-gray-600" : "bg-blue-600 dark:bg-blue-400"
              }`} />
          </div>
        </div>
      </div>

      {/* Image Modal Dialog (Lightbox) */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-[100vw] w-screen h-screen p-0 bg-black/95 border-none flex flex-col items-center justify-center" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Суретті толық көлемде көру</DialogTitle>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <DialogClose className="absolute top-6 right-6 bg-white/10 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/20 transition-all z-50">
              <X className="w-8 h-8" />
            </DialogClose>

            {/* Previous Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 sm:left-10 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all transform hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Image Container */}
            <div className="w-full h-full p-4 flex flex-col items-center justify-center select-none">
              <AnimatePresence mode="wait">
                {selectedIndex !== null && mediaItems[selectedIndex] && (
                  <motion.div 
                    key={selectedIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative max-w-5xl max-h-[85vh] group flex flex-col items-center"
                  >
                    <img
                      src={mediaItems[selectedIndex].url}
                      alt={mediaItems[selectedIndex].caption || "Үлкейтілген сурет"}
                      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    />
                    {mediaItems[selectedIndex].caption && (
                      <div className="absolute -bottom-16 left-0 right-0 text-center">
                        <p className="text-white text-lg font-medium drop-shadow-md">
                          {mediaItems[selectedIndex].caption}
                        </p>
                      </div>
                    )}
                    {user && (
                      <div className="absolute -top-12 right-0 flex gap-2">
                         <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Бұл суретті өшіруді растайсыз ба? (Confirm delete?)")) {
                              const idToDelete = mediaItems[selectedIndex].id;
                              deleteMutation.mutate(idToDelete);
                              setSelectedIndex(null);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Суретті өшіру
                        </Button>
                      </div>
                    )}
                    {/* Counter */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-white/60 font-mono text-sm">
                      {selectedIndex + 1} / {mediaItems.length}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 sm:right-10 z-50 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all transform hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
