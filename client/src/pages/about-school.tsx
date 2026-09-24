import { useMemo, useState } from "react";
import {
  HandHeart, Scale, ShieldCheck, Hammer, Award, HeartPulse,
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, Loader2, Upload, Image as ImageIcon,
  Users, GraduationCap, BookOpen,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditableText from "@/components/admin/editable-text";
import ContactCta from "@/components/contact-cta";
import SEOHead from "@/components/seo-head";

interface Certificate {
  image: string;
  caption: string;
}

const CERT_KEY = "about.certificates";
const HERO_PHOTOS_KEY = "about.hero.photos";

const stats = [
  { icon: Users, key: "count", number: "238", label: "Оқушылар саны" },
  { icon: GraduationCap, key: "grades", number: "1-9", label: "Сынып деңгейлері" },
  { icon: BookOpen, key: "classSize", number: "12-18", label: "Сыныптағы оқушылар" },
  { icon: Award, key: "success", number: "95%", label: "Табысты бітірушілер" },
];

const nationalValues = [
  { icon: HandHeart, key: "trust", title: "Сенім" },
  { icon: Scale, key: "justice", title: "Әділеттілік" },
  { icon: ShieldCheck, key: "responsibility", title: "Жауапкершілік" },
  { icon: Hammer, key: "diligence", title: "Еңбекқорлық" },
  { icon: Award, key: "dignity", title: "Қадір-қасиет" },
  { icon: HeartPulse, key: "health", title: "Денсаулық" },
];

export default function AboutSchoolPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState<{ index: number; draft: Certificate } | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: certRecord } = useQuery<any>({
    queryKey: ["/api/content", CERT_KEY],
    queryFn: async () => {
      const res = await fetch(`/api/content?key=${CERT_KEY}&lang=kz`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    },
  });

  const certificates: Certificate[] = useMemo(() => {
    if (certRecord?.value) {
      try {
        const parsed = JSON.parse(certRecord.value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* ignore malformed content and fall back to an empty gallery */
      }
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certRecord]);

  const saveCerts = useMutation({
    mutationFn: async (list: Certificate[]) => {
      const value = JSON.stringify(list);
      const res = certRecord?.id
        ? await fetch(`/api/content/${certRecord.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
            credentials: "include",
          })
        : await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: CERT_KEY, lang: "kz", value, type: "json" }),
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
    const list = [...certificates];
    const to = index + dir;
    if (to < 0 || to >= list.length) return;
    [list[index], list[to]] = [list[to], list[index]];
    saveCerts.mutate(list);
  };

  const remove = (index: number) => {
    if (!window.confirm("Бұл суретті өшіресіз бе?")) return;
    saveCerts.mutate(certificates.filter((_, i) => i !== index));
  };

  const submitEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const list = [...certificates];
    if (editing.index === -1) list.push(editing.draft);
    else list[editing.index] = editing.draft;
    saveCerts.mutate(list);
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
      setEditing((cur) => (cur ? { ...cur, draft: { ...cur.draft, image: url } } : cur));
    } catch (err: any) {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  // Three fixed photo slots for the hero collage
  const { data: heroPhotosRecord } = useQuery<any>({
    queryKey: ["/api/content", HERO_PHOTOS_KEY],
    queryFn: async () => {
      const res = await fetch(`/api/content?key=${HERO_PHOTOS_KEY}&lang=kz`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    },
  });

  const heroPhotos: string[] = useMemo(() => {
    if (heroPhotosRecord?.value) {
      try {
        const parsed = JSON.parse(heroPhotosRecord.value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* fall back to empty slots */
      }
    }
    return ["", "", ""];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroPhotosRecord]);

  const saveHeroPhotos = useMutation({
    mutationFn: async (list: string[]) => {
      const value = JSON.stringify(list);
      const res = heroPhotosRecord?.id
        ? await fetch(`/api/content/${heroPhotosRecord.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
            credentials: "include",
          })
        : await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: HERO_PHOTOS_KEY, lang: "kz", value, type: "json" }),
            credentials: "include",
          });
      if (!res.ok) throw new Error("Сақтау мүмкін болмады");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Сақталды" });
    },
    onError: (err: Error) => toast({ title: "Қате", description: err.message, variant: "destructive" }),
  });

  const [heroUploadingIndex, setHeroUploadingIndex] = useState<number | null>(null);

  const uploadHeroPhoto = async (index: number, file: File) => {
    setHeroUploadingIndex(index);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Сурет жүктелмеді");
      }
      const { url } = await res.json();
      const next = [...heroPhotos];
      next[index] = url;
      saveHeroPhotos.mutate(next);
    } catch (err: any) {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    } finally {
      setHeroUploadingIndex(null);
    }
  };

  const removeHeroPhoto = (index: number) => {
    const next = [...heroPhotos];
    next[index] = "";
    saveHeroPhotos.mutate(next);
  };

  const heroSlot = (index: number, extraClass: string) => {
    const photo = heroPhotos[index] || "";
    return (
      <div key={index} className={`group relative overflow-hidden rounded-xl border-2 border-[#F2A63B]/60 bg-gray-100 shadow-md dark:bg-gray-800 ${extraClass}`}>
        {photo ? (
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        {user && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Label htmlFor={`hero-photo-${index}`} className="cursor-pointer rounded-full bg-white p-2 text-[#2A4A46] hover:bg-gray-100">
              {heroUploadingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Label>
            <input
              id={`hero-photo-${index}`}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={heroUploadingIndex !== null}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadHeroPhoto(index, file);
                e.target.value = "";
              }}
            />
            {photo && (
              <button type="button" className="rounded-full bg-white p-2 text-red-600 hover:bg-gray-100" onClick={() => removeHeroPhoto(index)}>
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white bg-grid-pattern dark:bg-[#0f172a]">
      <div className="container mx-auto px-4 py-10 sm:py-12">

        <SEOHead page="about" />
        {/* Hero */}
        <div
          className="mb-16 overflow-hidden rounded-[2rem] bg-[#F7F7F5] px-6 py-10 dark:bg-[#131722] sm:px-10 sm:py-14"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 56px)",
          }}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <EditableText
                contentKey="about.hero.eyebrow"
                defaultValue="Мектеп туралы"
                tag="p"
                className="mb-2 text-sm font-bold uppercase tracking-widest text-[#24806A]"
              />
              <EditableText
                contentKey="about.hero.title"
                defaultValue="Білімді ұрпақ жекеменшік мектебі"
                tag="h1"
                className="font-heading text-3xl font-extrabold leading-tight text-[#2A4A46] dark:text-gray-100 md:text-5xl"
              />
              <div className="my-6 h-[3px] w-40 bg-gradient-to-r from-[#F2A63B] to-transparent" />
              <EditableText
                contentKey="about.hero.tagline"
                defaultValue="Дәстүрге негізделген болашақты құрамыз!"
                tag="p"
                className="mb-5 text-base font-bold uppercase tracking-wide text-[#24806A]"
              />
              <EditableText
                contentKey="about.hero.text1"
                defaultValue="Мектебіміз қазақ және орыс тілдерінде білім беретін, жоғары білікті педагогикалық ұжымы, авторлық қосымша білім беру бағдарламалары және заманауи инфрақұрылымы арқылы оқушыларға оңтайлы білім алу жағдайын жасайды."
                tag="p"
                multiline
                className="mb-4 text-gray-700 dark:text-gray-300"
              />
              <EditableText
                contentKey="about.hero.text2"
                defaultValue="Оқыту мен тәрбиелеу ең жоғары деңгейде — бұл педагогикалық ұжымымыздың басты қағидасы. Мектебіміз әр оқушының жеке дамуын қадағалауға мүмкіндік беретін ашық және түсінікті бағалау жүйесін қамтамасыз етеді."
                tag="p"
                multiline
                className="text-gray-700 dark:text-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-2">
              {heroSlot(0, "aspect-[4/3] sm:row-span-2 sm:aspect-[3/4]")}
              {heroSlot(1, "aspect-[4/3]")}
              {heroSlot(2, "aspect-[4/3]")}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {stats.map(({ icon: Icon, key, number, label }) => (
            <div key={key} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-[#131722]">
              <Icon className="mx-auto mb-3 h-8 w-8 text-[#24806A]" />
              <EditableText contentKey={`about.stats.${key}.number`} defaultValue={number} tag="p" className="text-3xl font-extrabold text-[#2A4A46]" />
              <EditableText contentKey={`about.stats.${key}.label`} defaultValue={label} tag="p" className="mt-1 text-sm font-semibold text-gray-600 dark:text-gray-300" />
            </div>
          ))}
        </div>

        {/* Mission & values */}
        <div className="mb-16">
          <div className="mb-10 text-center">
            <EditableText
              contentKey="about.mission.heading"
              defaultValue="Миссия және құндылықтар"
              tag="h2"
              className="text-2xl font-bold text-[#2A4A46] md:text-3xl"
            />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div
              className="relative overflow-hidden rounded-xl p-8 text-center sm:p-10"
              style={{
                backgroundColor: "#FAFAF9",
                backgroundImage:
                  "linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            >
              <p className="pointer-events-none select-none text-4xl font-extrabold uppercase leading-none text-[#24806A]/20 md:text-5xl">
                Миссия
              </p>
              <EditableText
                contentKey="about.mission.text"
                defaultValue="Дәстүрге негізделген болашақты құрамыз!"
                tag="p"
                multiline
                className="relative -mt-4 text-lg font-bold text-gray-900 dark:text-gray-900 md:-mt-6"
              />
            </div>

            <div
              className="relative overflow-hidden rounded-xl p-8 text-center sm:p-10"
              style={{
                backgroundColor: "#FAFAF9",
                backgroundImage:
                  "linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            >
              <p className="pointer-events-none select-none text-4xl font-extrabold uppercase leading-none text-[#24806A]/20 md:text-5xl">
                Құндылықтар
              </p>
              <div className="relative -mt-4 space-y-1 md:-mt-6">
                <p className="font-bold text-gray-900">Ұлттық құндылықтар</p>
                {nationalValues.map(({ key, title }) => (
                  <EditableText key={key} contentKey={`about.values.${key}.title`} defaultValue={title} tag="p" className="font-bold text-gray-900" />
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Certificates gallery (admin-managed) */}
        <div className="mb-16">
          <div className="mb-8 flex items-center justify-center gap-4">
            <EditableText
              contentKey="about.certs.heading"
              defaultValue="Сертификаттар мен лицензиялар"
              tag="h2"
              className="text-center text-2xl font-bold text-[#2A4A46]"
            />
          </div>
          {user && (
            <div className="mb-6 flex justify-center">
              <Button
                className="rounded-full bg-blue-600 px-6 text-white hover:bg-blue-700"
                onClick={() => setEditing({ index: -1, draft: { image: "", caption: "" } })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Сурет қосу
              </Button>
            </div>
          )}
          {certificates.length === 0 && !user && null}
          {certificates.length === 0 && user && (
            <p className="text-center text-sm text-gray-500">Әзірге сурет қосылмаған. Жоғарыдағы батырма арқылы қосыңыз.</p>
          )}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {certificates.map((cert, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[#131722]">
                {user && (
                  <div className="absolute right-2 top-2 z-20 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white" title="Солға" disabled={index === 0 || saveCerts.isPending} onClick={() => move(index, -1)}><ChevronUp className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white" title="Оңға" disabled={index === certificates.length - 1 || saveCerts.isPending} onClick={() => move(index, 1)}><ChevronDown className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white text-blue-600" title="Өңдеу" onClick={() => setEditing({ index, draft: cert })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white text-red-600" title="Өшіру" onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                )}
                <div className="aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800">
                  {cert.image && (
                    <img src={cert.image} alt={cert.caption || "Сертификат"} className="h-full w-full object-cover" />
                  )}
                </div>
                {cert.caption && (
                  <p className="p-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300">{cert.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <ContactCta className="sm:mt-4" />
      </div>

      {/* Certificate editor (admin only) */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">{editing?.index === -1 ? "Жаңа сурет" : "Суретті өңдеу"}</DialogTitle>
            <DialogDescription className="text-gray-600">Сертификат немесе лицензия суретін жүктеңіз.</DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={submitEditor} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  {editing.draft.image ? (
                    <img src={editing.draft.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-photo" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-black hover:bg-gray-50">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Сурет жүктеу
                  </Label>
                  <input
                    id="cert-photo"
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
                  {editing.draft.image && (
                    <button type="button" className="block text-xs text-red-600 hover:underline" onClick={() => setEditing({ ...editing, draft: { ...editing.draft, image: "" } })}>
                      Суретті өшіру
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cert-caption" className="text-black">Атауы (міндетті емес)</Label>
                <Input
                  id="cert-caption"
                  value={editing.draft.caption}
                  onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, caption: e.target.value } })}
                  className="border-gray-300 bg-white text-black"
                />
              </div>
              <Button type="submit" disabled={saveCerts.isPending || uploading || !editing.draft.image} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {saveCerts.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сақтау
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
