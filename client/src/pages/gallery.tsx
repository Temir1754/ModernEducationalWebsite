import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, X, Plus, Trash2, Loader2, Pencil } from "lucide-react";
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

const EDITORIAL_CAPTIONS = ["Жеңімпаздар", "Білім — болашақ", "Бірге үйренеміз", "Спорт — денсаулық кепілі"];
const PAGE_SIZE = 9;

// 9-slot editorial mosaic: 1 hero + 4-cell right mosaic + 4-cell bottom row (12-col grid)
const MOSAIC_SPANS = [
  "lg:col-span-6 lg:row-span-8",
  "lg:col-span-3 lg:row-span-4",
  "lg:col-span-3 lg:row-span-4",
  "lg:col-span-3 lg:row-span-4",
  "lg:col-span-3 lg:row-span-4",
  "lg:col-span-3 lg:row-span-4",
  "lg:col-span-3 lg:row-span-4",
  "lg:col-span-3 lg:row-span-4",
  "lg:col-span-3 lg:row-span-4",
];

export default function GalleryPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { user } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [uploadedSessionItems, setUploadedSessionItems] = useState<Media[]>([]);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

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
        credentials: "include",
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Файлды жүктеу қатесі (Upload failed)");
      }
      const { url } = await uploadRes.json();

      const mediaRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image",
          url,
          section: "gallery"
        }),
        credentials: "include",
      });

      if (!mediaRes.ok) {
        const errorData = await mediaRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save media");
      }
      return mediaRes.json();
    },
    onSuccess: (newMedia) => {
      queryClient.invalidateQueries({ queryKey: ["/api/media", "gallery"] });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setUploadedSessionItems((prev) => [newMedia, ...prev]);
      setUploadSuccessMsg("Фото сәтті жүктелді! Тағы сурет қоса аласыз. / Фото успешно загружено! Можете добавить еще.");
      setUploadFile(null);
      // Очищаем input type="file" через сброс значения, если нужно, или пользователь просто выберет новый файл
    },
    onError: (error: Error) => {
      console.error("Upload error:", error);
      alert("Қате / Ошибка: " + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Attempting to delete media with ID:", id);
      const res = await fetch(`/api/media/${id}`, { 
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Удаление не удалось");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media", "gallery"] });
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
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update caption");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media", "gallery"] });
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

  const pageCount = Math.max(1, Math.ceil(mediaItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = mediaItems.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const goToPrevPage = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const goToNextPage = () => setPage((p) => (p + 1) % pageCount);

  return (
    <>
      <SEOHead
        page="home"
        customTitle="Мектеп фотогалереясы | Білімді ұрпақ жекеменшік мектебі"
        customDescription="Білімді ұрпақ жекеменшік мектебінің өмірінен қызықты сәттер мен іс-шаралар галереясы. Біздің мектептегі оқу үдерісі мен іс-шаралардың суреттері."
        customKeywords="Білімді ұрпақ жекеменшік мектебі фотогалерея, мектеп суреттері, іс-шаралар, оқушылар, Шымкент мектеп"
      />
      <div className="min-h-screen" style={{ backgroundColor: "#0f172a" }}>
        {/* Editorial Hero */}
        <div className="w-full px-4 sm:px-8 lg:px-12 pt-14 pb-8 sm:pt-20 sm:pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10" style={{ backgroundColor: "#D4B98C" }} />
              <span
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "#D4B98C" }}
              >
                Фотогалерея
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]"
              style={{ color: "#FAF6EE", fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Біздің мектеп өмірі
            </h1>
            <p className="mt-5 text-base sm:text-lg max-w-xl" style={{ color: "#9AA4B8" }}>
              Білімді ұрпақ жекеменшік мектебінің өмірінен қызықты сәттер мен іс-шаралар галереясы
            </p>
          </div>

          {/* Admin Upload Button */}
          {user && (
                <Dialog open={isUploadOpen} onOpenChange={(open) => {
                  setIsUploadOpen(open);
                  if (!open) {
                    setUploadedSessionItems([]);
                    setUploadSuccessMsg(null);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button
                      className="rounded-full px-5 h-11 font-semibold shadow-md hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#D4B98C", color: "#14213D" }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Фото қосу
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-slate-900 border-none shadow-2xl max-w-md w-[95vw] max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Фото жүктеу</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Галереяға жаңа фотосурет жүктеңіз.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {uploadSuccessMsg && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-xs font-medium animate-fade-in">
                        {uploadSuccessMsg}
                      </div>
                    )}

                    <form onSubmit={(e) => uploadMutation.mutate(e)} className="space-y-4 pt-2">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Фото таңдау</Label>
                        <div className="relative">
                          <Input
                            key={uploadedSessionItems.length}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              setUploadFile(e.target.files?.[0] || null);
                              if (uploadSuccessMsg) setUploadSuccessMsg(null);
                            }}
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

                    {uploadedSessionItems.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                          Осы сессияда жүктелген фотолар ({uploadedSessionItems.length})
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {uploadedSessionItems.map((item, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
                              <img src={item.url} alt="preview" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

        {/* Editorial Mosaic */}
        <div className="w-full px-4 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          <div className="relative">
            {mediaItems.length === 0 ? (
              <div className="text-center py-20" style={{ color: "#8A93A3" }}>
                Суреттер әзірге жоқ
              </div>
            ) : (
              <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:[grid-auto-rows:56px] lg:gap-4">
                {pageItems.map((media, localIndex) => {
                  const globalIndex = currentPage * PAGE_SIZE + localIndex;
                  const caption = media.caption || EDITORIAL_CAPTIONS[globalIndex % EDITORIAL_CAPTIONS.length];
                  const isDimmed = hoveredIndex !== null && hoveredIndex !== globalIndex;
                  return (
                    <div
                      key={media.id}
                      className={`relative group cursor-pointer overflow-hidden rounded-md ${localIndex === 0 ? "col-span-2" : ""} ${MOSAIC_SPANS[localIndex] || ""} h-[220px] sm:h-[260px] lg:h-auto transition-opacity duration-300`}
                      style={{ opacity: isDimmed ? 0.45 : 1 }}
                      onMouseEnter={() => setHoveredIndex(globalIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => setSelectedIndex(globalIndex)}
                    >
                      {/* Admin controls */}
                      {user && (
                        <div className="absolute top-2 right-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
                            style={{ color: "#14213D" }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditCaption(media);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow text-red-600"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (window.confirm("Бұл суретті өшіруді растайсыз ба? (Confirm delete?)")) {
                                deleteMutation.mutate(media.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <img
                        src={media.url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-[0.55] saturate-150"
                      />
                      <img
                        src={media.url}
                        alt={caption}
                        className="relative w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span
                          className="inline-block text-white text-xs sm:text-sm font-semibold uppercase tracking-widest border-l-2 pl-2"
                          style={{ borderColor: "#D4B98C" }}
                        >
                          {caption}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pager */}
              {pageCount > 1 && (
                <div className="flex items-center justify-center gap-6 mt-10">
                  <button
                    onClick={goToPrevPage}
                    className="w-11 h-11 rounded-full flex items-center justify-center border transition-colors hover:bg-white/10"
                    style={{ borderColor: "#D4B98C", color: "#D4B98C" }}
                    aria-label="Алдыңғы"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-mono tracking-widest" style={{ color: "#9AA4B8" }}>
                    {String(currentPage + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}
                  </span>
                  <button
                    onClick={goToNextPage}
                    className="w-11 h-11 rounded-full flex items-center justify-center border transition-colors hover:bg-white/10"
                    style={{ borderColor: "#D4B98C", color: "#D4B98C" }}
                    aria-label="Келесі"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
              </>
            )}
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
