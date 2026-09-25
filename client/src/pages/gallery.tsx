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
import PageHeader from "@/components/page-header";

export default function GalleryPage() {

  // Edit controls are admin-only; inspectors get a read-only view.
  const { isAdmin, user: authUser } = useAuth();
  const user = isAdmin ? authUser : null;
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
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
      if (uploadFiles.length === 0) return [];

      const results: Media[] = [];
      for (const file of uploadFiles) {
      const formData = new FormData();
      formData.append("file", file);

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
      results.push(await mediaRes.json());
      }
      return results;
    },
    onSuccess: (newMedia: Media[]) => {
      queryClient.invalidateQueries({ queryKey: ["/api/media", "gallery"] });
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setUploadedSessionItems((prev) => [...newMedia, ...prev]);
      setUploadSuccessMsg("Фото сәтті жүктелді! Тағы сурет қоса аласыз. / Фото успешно загружено! Можете добавить еще.");
      setUploadFiles([]);
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

  return (
    <>
      <SEOHead
        page="home"
        customTitle="Мектеп фотогалереясы | Білімді ұрпақ жекеменшік мектебі"
        customDescription="Білімді ұрпақ жекеменшік мектебінің өмірінен қызықты сәттер мен іс-шаралар галереясы. Біздің мектептегі оқу үдерісі мен іс-шаралардың суреттері."
        customKeywords="Білімді ұрпақ жекеменшік мектебі фотогалерея, мектеп суреттері, іс-шаралар, оқушылар, Шымкент мектеп"
      />
      <div className="min-h-screen bg-white">
        {/* Editorial Hero */}
        <div className="w-full px-4 sm:px-8 lg:px-12 pt-14 pb-8 sm:pt-20 sm:pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <PageHeader
              eyebrow="Фотогалерея"
              title="Біздің мектеп өмірі"
              subtitle="Білімді ұрпақ жекеменшік мектебінің өмірінен қызықты сәттер мен іс-шаралар галереясы"
              align="left"
              className=""
            />
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
                      style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Фото қосу
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-slate-900 border-none shadow-2xl max-w-md w-[95vw] max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Фото жүктеу</DialogTitle>
                      <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Галереяға бір мезгілде 10 фотоға дейін жүктеуге болады.
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
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 10) {
                                alert("Бір мезгілде максимум 10 фото жүктеуге болады / Максимум 10 фото за раз");
                                e.target.value = "";
                                setUploadFiles([]);
                                return;
                              }
                              setUploadFiles(files);
                              if (uploadSuccessMsg) setUploadSuccessMsg(null);
                            }}
                            required
                            className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer h-12 flex items-center"
                          />
                        </div>
                        {uploadFiles.length > 0 && (
                          <p className="text-xs text-blue-500 font-medium animate-pulse">
                            Файл таңдалды: {uploadFiles.length} / 10
                          </p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        disabled={uploadMutation.isPending || uploadFiles.length === 0} 
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

        {/* All photos on one page */}
        <div className="w-full px-4 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          {mediaItems.length === 0 ? (
            <div className="text-center py-20 text-black">
              Суреттер әзірге жоқ
            </div>
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
              {mediaItems.map((media) => (
                <div
                  key={media.id}
                  className="group mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Admin controls */}
                  {user && (
                    <div className="flex justify-end gap-2 p-2 bg-white border-b border-gray-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-full hover:bg-blue-100 text-blue-600"
                        onClick={() => handleEditCaption(media)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-full hover:bg-red-100 text-red-600"
                        onClick={() => {
                          if (window.confirm("Бұл суретті өшіруді растайсыз ба? (Confirm delete?)")) {
                            deleteMutation.mutate(media.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <img
                    src={media.url}
                    alt={media.caption || "Галерея"}
                    loading="lazy"
                    className="block h-auto w-full"
                  />
                  {media.caption && (
                    <p className="px-4 py-3 text-sm font-medium text-black">{media.caption}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
