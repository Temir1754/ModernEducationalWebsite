import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Plus, Trash2, Loader2, Upload, Pencil } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SEOHead from "@/components/seo-head";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import type { Media } from "@shared/schema";

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
      // Fallback if section filtering isn't strict yet or if we want all
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
      await fetch(`/api/media/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
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
        customTitle="Мектеп фотогалереясы | FGS - Болашақ ұрпақ мектебі"
        customDescription="FGS мектебінің өмірінен қызықты сәттер мен іс-шаралар галереясы. Біздің мектептегі оқу үдерісі мен іс-шаралардың суреттері."
        customKeywords="FGS фотогалерея, мектеп суреттері, іс-шаралар, оқушылар, Шымкент мектеп"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        {/* Header with Back Button */}
        <div className="bg-white dark:bg-[#1e293b] shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Басты бетке оралу</span>
                <span className="sm:hidden">Басты бет</span>
              </Link>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                Мектеп фотогалереясы
              </h1>

              {/* Admin Upload Button */}
              {user && (
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-1" />
                      Фото қосу
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900">Фото жүктеу</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => uploadMutation.mutate(e)} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-900">Фото таңдау</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                          required
                        />
                      </div>
                      <Button type="submit" disabled={uploadMutation.isPending || !uploadFile} className="w-full">
                        {uploadMutation.isPending && <Loader2 className="animate-spin mr-2" />}
                        Жүктеу
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
              FGS мектебінің өмірінен қызықты сәттер мен іс-шаралар галереясы
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
                        className="relative group cursor-pointer h-[400px] lg:h-[350px]"
                        onClick={() => setSelectedImage(media.url)}
                      >
                        <img
                          src={media.url}
                          alt="Галерея"
                          className="w-full h-full object-cover rounded-2xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Admin Buttons */}
                        {user && (
                          <>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute top-2 right-14 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCaption(media);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Өшіру керек пе?")) deleteMutation.mutate(media.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
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
                  ← Свайпните для просмотра →
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

      {/* Image Modal Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-none">
          <div className="relative">
            <DialogClose className="absolute -top-12 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-700 transition-colors z-50">
              <X className="w-6 h-6 text-gray-800 dark:text-gray-100" />
            </DialogClose>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Үлкейтілген сурет"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
