import { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, ChevronUp, ChevronDown, Loader2, Upload } from "lucide-react";
import SEOHead from "@/components/seo-head";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PageHeader from "@/components/page-header";

interface ScheduleItem {
  class: string;
  file: string;
}

/** The whole schedule list is stored as JSON in site_content under this key. */
const SCHEDULE_KEY = "schedule.images";

const defaultScheduleImages: ScheduleItem[] = [
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
  // Edit controls are admin-only; inspectors get a read-only view.
  const { isAdmin, user: authUser } = useAuth();
  const user = isAdmin ? authUser : null;
  const { toast } = useToast();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ index: number; draft: ScheduleItem } | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: scheduleRecord } = useQuery<any>({
    queryKey: ["/api/content", SCHEDULE_KEY],
    queryFn: async () => {
      const res = await fetch(`/api/content?key=${SCHEDULE_KEY}&lang=kz`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    },
  });

  const scheduleImages: ScheduleItem[] = useMemo(() => {
    if (scheduleRecord?.value) {
      try {
        const parsed = JSON.parse(scheduleRecord.value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* fall back to the defaults */
      }
    }
    return defaultScheduleImages;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleRecord]);

  const saveSchedule = useMutation({
    mutationFn: async (list: ScheduleItem[]) => {
      const value = JSON.stringify(list);
      const res = scheduleRecord?.id
        ? await fetch(`/api/content/${scheduleRecord.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
            credentials: "include",
          })
        : await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: SCHEDULE_KEY, lang: "kz", value, type: "json" }),
            credentials: "include",
          });
      if (!res.ok) throw new Error("Сақтау мүмкін болмады");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setEditing(null);
      toast({ title: "Сақталды" });
    },
    onError: (err: Error) => toast({ title: "Қате", description: err.message, variant: "destructive" }),
  });

  const move = (index: number, dir: -1 | 1) => {
    const list = [...scheduleImages];
    const to = index + dir;
    if (to < 0 || to >= list.length) return;
    [list[index], list[to]] = [list[to], list[index]];
    saveSchedule.mutate(list);
  };

  const remove = (index: number) => {
    if (!window.confirm(`«${scheduleImages[index].class} сынып» кестесін өшіресіз бе?`)) return;
    saveSchedule.mutate(scheduleImages.filter((_, i) => i !== index));
  };

  const submitEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.draft.file) {
      toast({ title: "Қате", description: "Алдымен суретті жүктеңіз", variant: "destructive" });
      return;
    }
    const list = [...scheduleImages];
    if (editing.index === -1) list.push(editing.draft);
    else list[editing.index] = editing.draft;
    saveSchedule.mutate(list);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Сурет жүктелмеді");
      }
      const { url } = await res.json();
      setEditing((cur) => (cur ? { ...cur, draft: { ...cur.draft, file: url } } : cur));
    } catch (err: any) {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => i !== null ? (i - 1 + scheduleImages.length) % scheduleImages.length : null);
  const nextImage = () => setLightboxIndex(i => i !== null ? (i + 1) % scheduleImages.length : null);

  return (
    <>
      <SEOHead page="schedule" />

      <div className="min-h-screen bg-white dark:bg-[#0f172a]">
        {/* Grid of class schedules */}
        <div className="container mx-auto px-4 py-8">
          <PageHeader title="Сабақ кестесі" className="mb-10 mt-4" />
          {user && (
            <div className="mb-6 flex justify-end">
              <Button
                className="rounded-full bg-blue-600 px-6 text-white hover:bg-blue-700"
                onClick={() => setEditing({ index: -1, draft: { class: "", file: "" } })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Кесте қосу
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {scheduleImages.map((item, index) => (
              <div key={`${item.class}-${index}`} className="group relative">
                {user && (
                  <div className="absolute -top-2 -right-2 z-20 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white" title="Солға" disabled={index === 0 || saveSchedule.isPending} onClick={() => move(index, -1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white" title="Оңға" disabled={index === scheduleImages.length - 1 || saveSchedule.isPending} onClick={() => move(index, 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white text-blue-600" title="Өңдеу" onClick={() => setEditing({ index, draft: { ...item } })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white text-red-600" title="Өшіру" onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                )}
                <button
                  onClick={() => openLightbox(index)}
                  className="group/card flex w-full flex-col items-center bg-white dark:bg-[#1e293b] rounded-xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:scale-105"
                >
                  <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {item.file && (
                      <img
                        src={item.file}
                        alt={`${item.class} сынып кестесі`}
                        className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                  </div>
                  <div className="w-full py-2 px-3 text-center">
                    <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                      {item.class} сынып
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>

          {scheduleImages.length === 0 && (
            <div className="w-full text-center py-20 text-gray-500">Әзірге кестелер қосылмаған.</div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && scheduleImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
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
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-black font-bold text-lg bg-white px-4 py-1 rounded-full">
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-700 text-sm">
            {lightboxIndex + 1} / {scheduleImages.length}
          </div>
        </div>
      )}

      {/* Schedule editor (admin only) */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">{editing?.index === -1 ? "Жаңа сынып кестесі" : "Кестені өңдеу"}</DialogTitle>
            <DialogDescription className="text-gray-600">Сынып атауы мен кесте суретін өзгертіңіз.</DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={submitEditor} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  {editing.draft.file ? (
                    <img src={editing.draft.file} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Upload className="h-7 w-7 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-photo" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-black hover:bg-gray-50">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Сурет жүктеу
                  </Label>
                  <input
                    id="schedule-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadPhoto(file);
                      e.target.value = "";
                    }}
                  />
                  {editing.draft.file && (
                    <button type="button" className="block text-xs text-red-600 hover:underline" onClick={() => setEditing({ ...editing, draft: { ...editing.draft, file: "" } })}>
                      Суретті өшіру
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="schedule-class" className="text-black">Сынып атауы</Label>
                <Input
                  id="schedule-class"
                  value={editing.draft.class}
                  required
                  placeholder="Мысалы: 1а"
                  onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, class: e.target.value } })}
                  className="border-gray-300 bg-white text-black"
                />
              </div>
              <Button type="submit" disabled={saveSchedule.isPending || uploading} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {saveSchedule.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сақтау
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
