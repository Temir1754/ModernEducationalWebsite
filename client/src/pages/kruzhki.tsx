import { Card, CardContent } from "@/components/ui/card";
import { Link, useRoute, useLocation } from "wouter";
import { ChevronDown, ChevronRight, Sparkles, Trophy, Lightbulb, Palette, Phone, CalendarDays, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Pencil, ChevronUp, Upload } from "lucide-react";
import type { SiteContent } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/page-header";
import SEOHead from "@/components/seo-head";

interface Club {
  name: string;
  description: string;
  image: string;
  schedule: string;
  age: string;
  teacher: string;
}

interface Teacher {
  name: string;
  role: string;
  photo: string;
}

/** Photo picker: shows the current image and uploads a new one through /api/upload. */
function PhotoField({ value, onChange, label, round }: { value: string; onChange: (url: string) => void; label: string; round?: boolean }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const id = useMemo(() => `pf-${Math.random().toString(36).slice(2)}`, []);

  const pick = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Фото жүктелмеді");
      }
      const { url } = await res.json();
      onChange(url);
    } catch (err: any) {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border border-gray-200 bg-gray-50 ${round ? "rounded-full" : "rounded-2xl"}`}>
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <Upload className="h-7 w-7 text-gray-400" />}
      </div>
      <div className="space-y-2">
        <Label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-black hover:bg-gray-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {label}
        </Label>
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) pick(file);
            e.target.value = "";
          }}
        />
        {value && (
          <button type="button" className="block text-xs text-red-600 hover:underline" onClick={() => onChange("")}>
            Фотоны өшіру
          </button>
        )}
      </div>
    </div>
  );
}

/** The whole clubs structure (section names + clubs) is stored as JSON in site_content under this key. */
const KRUZHKI_KEY = "kruzhki.data";

const CLUB_FIELDS: { key: keyof Club; label: string; multiline?: boolean; required?: boolean }[] = [
  { key: "name", label: "Үйірме атауы", required: true },
  { key: "description", label: "Сипаттамасы", multiline: true },
  { key: "schedule", label: "Кесте" },
  { key: "age", label: "Жасы" },
  { key: "teacher", label: "Мұғалім" },
];

const TEAL = "text-[#24806A]";
const HEADING = "text-[#2A4A46]";

const TRANSLIT: Record<string, string> = {
  а: "a", ә: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "i", к: "k", қ: "k",
  л: "l", м: "m", н: "n", ң: "n", о: "o", ө: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ұ: "u", ү: "u", ф: "f", х: "kh",
  һ: "h", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ы: "y", і: "i", э: "e", ю: "yu", я: "ya",
};

/** "Логикалық математика" -> "logikalyk-matematika" (readable page address). */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function KruzhkiPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { toast } = useToast();
  const [editing, setEditing] = useState<{ cat: number; index: number; draft: Club } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [catEditing, setCatEditing] = useState<{ index: number; draft: { category: string; description: string; photos: string[] } } | null>(null);
  const [teacherEditing, setTeacherEditing] = useState<{ cat: number; originalName: string | null; draft: Teacher } | null>(null);
  const [teacherDetail, setTeacherDetail] = useState<number | null>(null);

  // All site content (clubs data and the old per-club photo overrides)
  const { data: content = [], isLoading: isContentLoading } = useQuery<SiteContent[]>({
    queryKey: ["/api/content"],
  });

  const getClubImage = (clubName: string, defaultImage: string) => {
    const key = `club_image_${clubName.toLowerCase().replace(/\s+/g, '_')}`;
    const dynamic = content.find(c => c.key === key);
    return dynamic ? dynamic.value : defaultImage;
  };

  const defaultClubsData = [
    {
      id: "creative",
      category: "Шығармашылық бағыт",
      icon: <Palette className="w-5 h-5" />,
      color: "from-pink-500 to-purple-600",
      clubs: [
        {
          name: "Хореография",
          description: "Классикалық және заманауи билерді үйрену, пластика және ритм дамыту",
          image: getClubImage("Хореография", "https://images.unsplash.com/photo-1545224144-b38cd309ef69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі, Жұма: 15:00-16:30",
          age: "5-15 жас",
          teacher: "Өмірзақ Мөлдір Абдуллақызы"
        },
        {
          name: "Домбыра",
          description: "Қазақтың ұлттық аспабын үйрену, фольклорлық әндерді орындау",
          image: getClubImage("Домбыра", "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Сейсенбі, Бейсенбі: 16:00-17:00",
          age: "6-16 жас",
          teacher: "Ержанова Жадыра Нурдуллаевна"
        },
        {
          name: "Дизайн",
          description: "Графикалық дизайн, сурет салу және шығармашылық жобалар",
          image: getClubImage("Дизайн", "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі: 14:30-16:00",
          age: "8-16 жас",
          teacher: "Аманбек Жансая Тимурханқызы"
        },
        {
          name: "Глинолепка",
          description: "Балшықпен жұмыс істеу, керамика және мүсін жасау",
          image: getClubImage("Глинолепка", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Сейсенбі, Жұма: 15:30-17:00",
          age: "5-14 жас",
          teacher: "Кендебайұлы Шынболат"
        }
      ]
    },
    {
      id: "intellectual",
      category: "Интеллектуалды бағыт",
      icon: <Lightbulb className="w-5 h-5" />,
      color: "from-blue-500 to-indigo-600",
      clubs: [
        {
          name: "Робототехника",
          description: "Lego роботтарын құрастыру, программалау және басқару",
          image: getClubImage("Робототехника", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі, Жұма: 16:00-17:30",
          age: "7-15 жас",
          teacher: "Ускенбаева Сая Жоланбаевна"
        },
        {
          name: "Шахмат",
          description: "Шахмат ойынының негіздері, тактика және стратегия үйрену",
          image: getClubImage("Шахмат", "/gallery/chess.jpg"),
          schedule: "Сейсенбі, Бейсенбі: 15:00-16:30",
          age: "6-16 жас",
          teacher: "Байшоинова Сания Тузельбаевна"
        },
        {
          name: "Speaking Club",
          description: "Ағылшын тілінде сөйлеу дағдыларын дамыту және коммуникация",
          image: getClubImage("Speaking Club", "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі: 17:00-18:00",
          age: "8-16 жас",
          teacher: "Нұрланқызы Жанеля"
        },
        {
          name: "Дебат",
          description: "Пікірталас дағдылары, сын тұрғысынан ойлау және дәлелдеу",
          image: getClubImage("Дебат", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Сейсенбі, Жұма: 16:30-18:00",
          age: "10-16 жас",
          teacher: "Аширбекова Гулмира Султановна"
        }
      ]
    },
    {
      id: "sports",
      category: "Спорттық бағыт",
      icon: <Trophy className="w-5 h-5" />,
      color: "from-green-500 to-emerald-600",
      clubs: [
        {
          name: "Тэквондо",
          description: "Корей жекпе-жегі, өзін-өзі қорғау және физикалық дайындық",
          image: getClubImage("Тэквондо", "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Дүйсенбі, Сәрсенбі, Жұма: 17:30-19:00",
          age: "6-16 жас",
          teacher: "Камытбаев Айдын Сыпабекович"
        },
        {
          name: "Футбол",
          description: "Командалық ойын, техника және тактика дамыту",
          image: getClubImage("Футбол", "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"),
          schedule: "Сейсенбі, Бейсенбі, Сенбі: 16:00-17:30",
          age: "7-16 жас",
          teacher: "Юзыкаев Жасулан Серикбайулы"
        }
      ]
    }
  ];

  const dataRecord = content.find((c) => c.key === KRUZHKI_KEY);

  const clubsData = useMemo<any[]>(() => {
    if (dataRecord?.value) {
      try {
        const parsed = JSON.parse(dataRecord.value);
        if (parsed && Array.isArray(parsed.categories)) {
          return parsed.categories.map((cat: any, i: number) => {
            const style = defaultClubsData.find((d) => d.id === cat.id) || defaultClubsData[i % defaultClubsData.length];
            return {
              ...style,
              id: cat.id,
              category: cat.category,
              description: cat.description || "",
              photos: Array.isArray(cat.photos) ? cat.photos : [],
              teachers: Array.isArray(cat.teachers) ? cat.teachers : [],
              clubs: (cat.clubs || []).map((c: Club) => ({ ...c, image: c.image || getClubImage(c.name, "") })),
            };
          });
        }
      } catch {
        /* fall back to the defaults */
      }
    }
    return defaultClubsData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRecord, content]);

  const saveData = useMutation({
    mutationFn: async (categories: any[]) => {
      const value = JSON.stringify({
        categories: categories.map((c) => ({
          id: c.id,
          category: c.category,
          description: c.description,
          photos: c.photos,
          teachers: c.teachers,
          clubs: c.clubs,
        })),
      });
      const res = dataRecord
        ? await fetch(`/api/content/${dataRecord.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
            credentials: "include",
          })
        : await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: KRUZHKI_KEY, value, lang: "kz", type: "json" }),
            credentials: "include",
          });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Сақтау мүмкін болмады");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setEditing(null);
      setCatEditing(null);
      setTeacherEditing(null);
      toast({ title: "Сақталды" });
    },
    onError: (err: Error) => toast({ title: "Қате", description: err.message, variant: "destructive" }),
  });

  /** Applies a change to a copy of the current data and saves it. */
  const change = (fn: (cats: any[]) => void) => {
    const cats = clubsData.map((c: any) => ({
      id: c.id,
      category: c.category,
      description: c.description,
      photos: [...(c.photos ?? [])],
      teachers: (c.teachers ?? []).map((t: Teacher) => ({ ...t })),
      clubs: c.clubs.map((k: Club) => ({ ...k })),
    }));
    fn(cats);
    saveData.mutate(cats);
  };

  const moveClub = (cat: number, index: number, dir: -1 | 1) =>
    change((cats) => {
      const list = cats[cat].clubs;
      const to = index + dir;
      if (to < 0 || to >= list.length) return;
      [list[index], list[to]] = [list[to], list[index]];
    });

  const removeClub = (cat: number, index: number) => {
    if (!window.confirm(`«${clubsData[cat].clubs[index].name}» үйірмесін өшіресіз бе?`)) return;
    change((cats) => {
      cats[cat].clubs.splice(index, 1);
    });
  };

  const renameCategory = (cat: number) => {
    const name = window.prompt("Бөлім атауы:", clubsData[cat].category);
    if (!name || !name.trim()) return;
    change((cats) => {
      cats[cat].category = name.trim();
    });
  };

  const addCategory = () => {
    const name = window.prompt("Жаңа бағыт атауы:");
    if (!name || !name.trim()) return;
    change((cats) => {
      cats.push({ id: `cat-${Date.now()}`, category: name.trim(), clubs: [] });
    });
  };

  const removeCategory = (cat: number) => {
    const { category, clubs } = clubsData[cat];
    if (!window.confirm(`«${category}» бағытын${clubs.length ? ` және ішіндегі ${clubs.length} үйірмені` : ""} өшіресіз бе?`)) return;
    change((cats) => {
      cats.splice(cat, 1);
    });
  };

  const submitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catEditing || !catEditing.draft.category.trim()) return;
    const { index, draft } = catEditing;
    change((cats) => {
      cats[index].category = draft.category.trim();
      cats[index].description = draft.description.trim();
      cats[index].photos = draft.photos.filter(Boolean);
    });
    // The address is built from the name, so follow it if the name changed.
    const newSlug = slugify(draft.category.trim());
    if (newSlug) setLocation(`/kruzhki/${newSlug}`, { replace: true });
  };

  const submitTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherEditing || !teacherEditing.draft.name.trim()) return;
    const { cat, originalName, draft } = teacherEditing;
    const teacher: Teacher = { name: draft.name.trim(), role: draft.role.trim(), photo: draft.photo };
    change((cats) => {
      const list: Teacher[] = cats[cat].teachers ?? [];
      const at = list.findIndex((t) => t.name === (originalName ?? teacher.name));
      if (at >= 0) list[at] = teacher;
      else list.push(teacher);
      cats[cat].teachers = list;
    });
  };

  const removeTeacher = (cat: number, name: string) => {
    if (!window.confirm(`«${name}» жетекшісін өшіресіз бе?`)) return;
    change((cats) => {
      cats[cat].teachers = (cats[cat].teachers ?? []).filter((t: Teacher) => t.name !== name);
    });
  };

  const submitEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const { cat, index, draft } = editing;
    change((cats) => {
      if (index === -1) cats[cat].clubs.push(draft);
      else cats[cat].clubs[index] = draft;
    });
  };

  const uploadPhoto = async (file: File) => {
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Фото жүктелмеді");
      }
      const { url } = await res.json();
      setEditing((cur) => (cur ? { ...cur, draft: { ...cur.draft, image: url } } : cur));
    } catch (err: any) {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const [, routeParams] = useRoute("/kruzhki/:id");
  const [, setLocation] = useLocation();
  const wantedId = routeParams?.id ? decodeURIComponent(routeParams.id) : null;
  // Page address of every direction, built from its name (unique even if two names are alike).
  const seenSlugs = new Map<string, number>();
  const slugs: string[] = clubsData.map((c: any) => {
    const base = slugify(c.category) || c.id;
    const n = (seenSlugs.get(base) ?? 0) + 1;
    seenSlugs.set(base, n);
    return n > 1 ? `${base}-${n}` : base;
  });
  const hrefOf = (i: number) => `/kruzhki/${slugs[i]}`;
  // The old address (the internal id, e.g. cat-1789995954369) keeps working and is redirected to the new one.
  const categoryIndex = wantedId ? clubsData.findIndex((c: any, i: number) => slugs[i] === wantedId || c.id === wantedId) : -1;
  const category: any = categoryIndex >= 0 ? clubsData[categoryIndex] : null;

  // Redirect decisions wait for the real (server-saved) directions to load: acting on the
  // placeholder defaults first would send the visitor to an address that stops matching
  // anything the moment the real data arrives, leaving a dead "not found" page behind.
  useEffect(() => {
    if (isContentLoading || clubsData.length === 0) return;
    if (categoryIndex === -1) {
      // No direction selected (bare /kruzhki), or the address doesn't match any current
      // direction (old link, renamed direction, typo): go to the first direction instead
      // of showing a dead end.
      setLocation(hrefOf(0), { replace: true });
    } else if (wantedId !== slugs[categoryIndex]) {
      // Old-style address (e.g. the internal id) or a renamed direction: move to its current one.
      setLocation(hrefOf(categoryIndex), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContentLoading, categoryIndex, wantedId, slugs[categoryIndex] ?? "", slugs[0], clubsData.length]);

  // Teachers are taken from the clubs data, so they stay in sync with what the admin edits.
  const teachersOf = (cats: any[]) => {
    const map = new Map<string, string[]>();
    cats.forEach((cat) =>
      cat.clubs.forEach((c: Club) => {
        const t = (c.teacher || "").trim();
        if (t) map.set(t, [...(map.get(t) ?? []), c.name]);
      }),
    );
    return Array.from(map.entries());
  };

  // Teachers added by hand (with photos) come first; teachers named in the clubs are added after them.
  const manualTeachers: Teacher[] = category?.teachers ?? [];
  const derivedTeachers = teachersOf(category ? [category] : []).filter(([n]) => !manualTeachers.some((t) => t.name === n));
  const teachers = [
    ...manualTeachers.map((t) => ({ ...t, manual: true })),
    ...derivedTeachers.map(([name, subjects]) => ({ name, role: subjects.join(", "), photo: "", manual: false })),
  ];

  const openCategoryEditor = () => {
    if (!category) return;
    setCatEditing({
      index: categoryIndex,
      draft: {
        category: category.category,
        description: category.description ?? "",
        photos: [category.photos?.[0] ?? "", category.photos?.[1] ?? ""],
      },
    });
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-white dark:bg-[#0f172a]">
      {/* Direction switcher: every direction opens its own page */}
      <div className="sticky top-16 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-xl sm:top-20 lg:top-24">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-start gap-2 overflow-x-auto py-3 whitespace-nowrap scrollbar-hide md:justify-center [&>*]:shrink-0">
            {clubsData.map((c: any, i: number) => (
              <Link
                key={c.id}
                href={hrefOf(i)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold outline-none transition-all focus-visible:ring-2 focus-visible:ring-blue-400 ${i === categoryIndex ? "bg-blue-100 text-blue-700 shadow-md ring-1 ring-blue-200" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}
              >
                {c.icon}
                {c.category}
              </Link>
            ))}
            {isAdmin && (
              <Button size="icon" variant="outline" className="h-9 w-9 shrink-0 rounded-full border-dashed" title="Бағыт қосу" disabled={saveData.isPending} onClick={addCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </nav>
        </div>
      </div>

      <SEOHead page="kruzhki" />

      {/* ---------- No direction picked yet ---------- */}
      {!category && (
        <section className="flex min-h-[50vh] items-center justify-center px-4 py-20">
          {!isContentLoading && clubsData.length === 0 ? (
            <div className="text-center">
              <h1 className={`mb-6 text-4xl font-extrabold ${HEADING}`}>Бағыттар әзірге жоқ</h1>
              {isAdmin && (
                <Button className="rounded-full bg-[#24806A] text-white hover:bg-[#1d6b58]" disabled={saveData.isPending} onClick={addCategory}>
                  <Plus className="mr-1 h-4 w-4" />Бағыт қосу
                </Button>
              )}
            </div>
          ) : (
            // Real data is loading, or we're about to jump to the first direction: never show a dead page.
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          )}
        </section>
      )}

      {/* ---------- One direction ---------- */}
      {category && (
        <>
          <section id="classes" className="relative scroll-mt-28 bg-[#F5F1E6] pb-16 pt-10 lg:pb-24 lg:pt-14">
            <div className="container mx-auto px-4">
              <div className="mb-14 text-center">
                <PageHeader eyebrow="Біздің үйірмелер" title="Үйірмені таңдаңыз" className="" />
                {isAdmin && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <Button size="sm" className="rounded-full bg-[#24806A] text-white hover:bg-[#1d6b58]" onClick={() => setEditing({ cat: categoryIndex, index: -1, draft: { name: "", description: "", image: "", schedule: "", age: "", teacher: "" } })}>
                      <Plus className="mr-1 h-4 w-4" />Үйірме қосу
                    </Button>
                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-full bg-white text-blue-600" title="Бағыт атауы, сипаттамасы, фото" onClick={openCategoryEditor}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-full bg-white text-red-600" title="Бағытты өшіру" onClick={() => { removeCategory(categoryIndex); setLocation("/kruzhki"); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>

              <div className="mx-auto max-w-5xl overflow-hidden rounded-sm">
                {category.clubs.length === 0 && <div className="bg-[#F0E8D5] px-6 py-8 text-gray-500">Бұл бағытта әзірге үйірме жоқ.</div>}
                {category.clubs.map((club: Club, clubIndex: number) => (
                  <div
                    key={clubIndex}
                    className={`grid items-center gap-4 px-6 py-6 md:grid-cols-[1.5fr_0.7fr_1.2fr] md:gap-8 ${clubIndex % 2 === 0 ? "bg-[#F0E8D5]" : "bg-[#F8F5EC]"}`}
                  >
                    <div>
                      <h4 className={`mb-1 text-2xl font-bold ${HEADING}`}>{club.name}</h4>
                      {club.description && <p className="max-w-sm text-sm leading-relaxed text-gray-600">{club.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-9 w-9 shrink-0 text-[#F2A63B]" strokeWidth={1.5} />
                      <span className={`text-lg font-bold ${HEADING}`}>{club.age}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm leading-relaxed text-gray-600">
                        {club.schedule && <p>{club.schedule}</p>}
                        {club.teacher && <p className="mt-1 font-medium text-[#24806A]">{club.teacher}</p>}
                      </div>
                      {isAdmin && (
                        <div className="flex shrink-0 gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" title="Жоғары" disabled={clubIndex === 0 || saveData.isPending} onClick={() => moveClub(categoryIndex, clubIndex, -1)}><ChevronUp className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" title="Төмен" disabled={clubIndex === category.clubs.length - 1 || saveData.isPending} onClick={() => moveClub(categoryIndex, clubIndex, 1)}><ChevronDown className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" title="Өңдеу" onClick={() => setEditing({ cat: categoryIndex, index: clubIndex, draft: { ...club } })}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" title="Өшіру" onClick={() => removeClub(categoryIndex, clubIndex)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <svg aria-hidden viewBox="0 0 200 110" className="pointer-events-none absolute bottom-0 right-0 hidden w-40 md:block lg:w-56">
              <path d="M0 110 V70 Q0 40 22 40 Q44 40 44 70 V110 Z" fill="#86A845" />
              <path d="M40 110 V30 Q40 0 66 0 Q92 0 92 30 V110 Z" fill="#86A845" />
              <path d="M86 110 V55 Q86 25 110 25 Q134 25 134 55 V110 Z" fill="#86A845" />
              {[[150, 70], [166, 60], [158, 88], [178, 78], [140, 92]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="7" fill="#F2C23B" />
              ))}
            </svg>
          </section>

          {(teachers.length > 0 || isAdmin) && (
            <section className="relative bg-[#FCEBB9] py-16 lg:py-24">
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[28px] border-[#F9DC94]/70" />
              <div aria-hidden className="pointer-events-none absolute -left-16 top-1/2 h-44 w-72 rounded-full bg-[#5B9BC9]" />
              <div className="container relative mx-auto px-4">
                <div className="mb-14 text-center">
                  <p className={`mb-3 text-sm font-medium uppercase tracking-[0.18em] ${TEAL}`}>Біздің команда</p>
                  <h2 className={`text-4xl font-extrabold md:text-6xl ${HEADING}`}>Үйірме жетекшілері</h2>
                  {isAdmin && (
                    <Button size="sm" className="mt-6 rounded-full bg-[#24806A] text-white hover:bg-[#1d6b58]" onClick={() => setTeacherEditing({ cat: categoryIndex, originalName: null, draft: { name: "", role: "", photo: "" } })}>
                      <Plus className="mr-1 h-4 w-4" />Жетекші қосу
                    </Button>
                  )}
                </div>
                {teachers.length === 0 && <p className="text-center text-gray-600">Жетекші әзірге қосылмаған.</p>}
                <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-14">
                  {teachers.map((t, i) => {
                    const [surname, ...rest] = t.name.trim().split(/\s+/);
                    return (
                      <div
                        key={t.name}
                        className="group relative mt-10 flex w-full max-w-sm flex-col border border-gray-200 bg-white pb-6 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] lg:max-w-none"
                      >
                        {isAdmin && (
                          <div className="absolute -top-8 right-4 z-20 flex gap-1.5">
                            <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white text-blue-600" title="Өңдеу / фото қосу" onClick={() => setTeacherEditing({ cat: categoryIndex, originalName: t.manual ? t.name : null, draft: { name: t.name, role: t.role, photo: t.photo } })}><Pencil className="h-4 w-4" /></Button>
                            {t.manual && <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white text-red-600" title="Өшіру" onClick={() => removeTeacher(categoryIndex, t.name)}><Trash2 className="h-4 w-4" /></Button>}
                          </div>
                        )}

                        {/* Portrait in a thin frame, overlapping the top edge of the card */}
                        <div className="relative -mt-10 mx-4 aspect-[4/5] overflow-hidden border border-[#2A4A46]/70 bg-gradient-to-br from-[#24806A] to-[#2A4A46] shadow-md">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Users className="h-20 w-20 text-white/50" />
                          </div>
                          {t.photo && (
                            <img
                              src={t.photo}
                              alt={t.name}
                              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          )}
                        </div>

                        <div className="flex-1 px-5 pt-6">
                          <p className="text-xl font-light uppercase tracking-wide text-[#24806A]">{surname}</p>
                          <h3 className="mb-3 text-lg font-bold leading-snug text-[#2A4A46]">{rest.join(" ")}</h3>
                          {t.role && <p className="min-h-[3.5rem] text-sm font-semibold leading-snug text-gray-700">{t.role}</p>}
                        </div>

                        <div className="mx-4 mt-5 h-[2px] bg-[#F2A63B]/40">
                          <div className="ml-auto h-[2px] w-1/4 bg-[#F2A63B]" />
                        </div>

                        <div className="mt-4 flex justify-center">
                          <button
                            type="button"
                            onClick={() => setTeacherDetail(i)}
                            className="flex items-center gap-2 border-b-2 border-[#F2A63B] pb-0.5 text-sm font-bold text-[#2A4A46] transition-colors hover:text-[#24806A]"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F2A63B] text-[#F2A63B]">
                              <ChevronRight className="h-4 w-4" />
                            </span>
                            Толығырақ
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Club editor (admin only) */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">{editing?.index === -1 ? "Жаңа үйірме" : "Үйірмені өңдеу"}</DialogTitle>
            <DialogDescription className="text-gray-600">Мәтін мен суретті өзгертіңіз.</DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={submitEditor} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  {editing.draft.image ? (
                    <img src={editing.draft.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="club-photo" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-black hover:bg-gray-50">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Фото жүктеу
                  </Label>
                  <input
                    id="club-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadPhoto(file);
                      e.target.value = "";
                    }}
                  />
                  {editing.draft.image && (
                    <button type="button" className="block text-xs text-red-600 hover:underline" onClick={() => setEditing({ ...editing, draft: { ...editing.draft, image: "" } })}>
                      Фотоны өшіру
                    </button>
                  )}
                </div>
              </div>
              {CLUB_FIELDS.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={`club-${f.key}`} className="text-black">{f.label}</Label>
                  {f.multiline ? (
                    <Textarea
                      id={`club-${f.key}`}
                      value={editing.draft[f.key]}
                      onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, [f.key]: e.target.value } })}
                      className="min-h-[90px] border-gray-300 bg-white text-black"
                    />
                  ) : (
                    <Input
                      id={`club-${f.key}`}
                      value={editing.draft[f.key]}
                      required={f.required}
                      onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, [f.key]: e.target.value } })}
                      className="border-gray-300 bg-white text-black"
                    />
                  )}
                </div>
              ))}
              <Button type="submit" disabled={saveData.isPending || isUploading} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {saveData.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сақтау
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Direction editor (admin only) */}
      <Dialog open={!!catEditing} onOpenChange={(open) => !open && setCatEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">Бағытты өңдеу</DialogTitle>
            <DialogDescription className="text-gray-600">Атауы, сипаттамасы және беттегі суреттер.</DialogDescription>
          </DialogHeader>
          {catEditing && (
            <form onSubmit={submitCategory} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cat-name" className="text-black">Бағыт атауы</Label>
                <Input
                  id="cat-name"
                  required
                  value={catEditing.draft.category}
                  onChange={(e) => setCatEditing({ ...catEditing, draft: { ...catEditing.draft, category: e.target.value } })}
                  className="border-gray-300 bg-white text-black"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cat-desc" className="text-black">Сипаттамасы</Label>
                <Textarea
                  id="cat-desc"
                  value={catEditing.draft.description}
                  onChange={(e) => setCatEditing({ ...catEditing, draft: { ...catEditing.draft, description: e.target.value } })}
                  className="min-h-[90px] border-gray-300 bg-white text-black"
                />
              </div>
              {[0, 1].map((n) => (
                <PhotoField
                  key={n}
                  label={n === 0 ? "Үлкен сурет" : "Кіші сурет"}
                  value={catEditing.draft.photos[n] ?? ""}
                  onChange={(url) => {
                    const photos = [...catEditing.draft.photos];
                    photos[n] = url;
                    setCatEditing({ ...catEditing, draft: { ...catEditing.draft, photos } });
                  }}
                />
              ))}
              <Button type="submit" disabled={saveData.isPending} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {saveData.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сақтау
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Teacher details */}
      <Dialog open={teacherDetail !== null} onOpenChange={(open) => !open && setTeacherDetail(null)}>
        <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto bg-white text-black">
          {teacherDetail !== null && teachers[teacherDetail] && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#2A4A46]">{teachers[teacherDetail].name}</DialogTitle>
                {teachers[teacherDetail].role && <DialogDescription className="text-base font-semibold text-[#24806A]">{teachers[teacherDetail].role}</DialogDescription>}
              </DialogHeader>
              <div className="relative mx-auto aspect-[4/5] w-48 overflow-hidden border border-[#2A4A46]/70 bg-gradient-to-br from-[#24806A] to-[#2A4A46]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="h-16 w-16 text-white/50" />
                </div>
                {teachers[teacherDetail].photo && (
                  <img
                    src={teachers[teacherDetail].photo}
                    alt={teachers[teacherDetail].name}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Teacher editor (admin only) */}
      <Dialog open={!!teacherEditing} onOpenChange={(open) => !open && setTeacherEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">{teacherEditing?.originalName === null && !teacherEditing.draft.name ? "Жаңа жетекші" : "Жетекші"}</DialogTitle>
            <DialogDescription className="text-gray-600">Аты-жөні, лауазымы және фотосы.</DialogDescription>
          </DialogHeader>
          {teacherEditing && (
            <form onSubmit={submitTeacher} className="space-y-4">
              <PhotoField
                round
                label="Фото жүктеу"
                value={teacherEditing.draft.photo}
                onChange={(url) => setTeacherEditing({ ...teacherEditing, draft: { ...teacherEditing.draft, photo: url } })}
              />
              <div className="space-y-1.5">
                <Label htmlFor="teacher-name" className="text-black">Аты-жөні</Label>
                <Input
                  id="teacher-name"
                  required
                  value={teacherEditing.draft.name}
                  onChange={(e) => setTeacherEditing({ ...teacherEditing, draft: { ...teacherEditing.draft, name: e.target.value } })}
                  className="border-gray-300 bg-white text-black"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="teacher-role" className="text-black">Лауазымы / қай үйірме</Label>
                <Input
                  id="teacher-role"
                  value={teacherEditing.draft.role}
                  onChange={(e) => setTeacherEditing({ ...teacherEditing, draft: { ...teacherEditing.draft, role: e.target.value } })}
                  className="border-gray-300 bg-white text-black"
                />
              </div>
              <Button type="submit" disabled={saveData.isPending} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {saveData.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сақтау
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
