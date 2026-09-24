import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Loader2, Pencil, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditableText from "@/components/admin/editable-text";
import { PhotoSlot, uploadImage, usePhotoSlots } from "@/components/admin/photo-slots";

type Category = "olympiad" | "contest" | "sport" | "art";

interface Achievement {
  image: string;
  title: string;
  subject: string;
  grade: string;
  place: string;
  category: Category;
  /** "dark": photo fills the card with text on top; "light": text panel beside the photo */
  variant: "dark" | "light";
  photoSide: "left" | "right";
}

const ITEMS_KEY = "students.achievements.items";
const PAGE_SIZE = 9;

const SERIF = "font-['Alegreya',serif] [font-variant-numeric:lining-nums]";
const CREAM = "bg-[#F4EFE7]";
const BROWN = "text-[#7A5C3E]";

const categories: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "Барлығы" },
  { key: "olympiad", label: "Олимпиадалар" },
  { key: "contest", label: "Байқаулар" },
  { key: "sport", label: "Спорт" },
  { key: "art", label: "Өнер" },
];

// Placeholder cards from the design mockup, shown until an admin saves the real list
const defaultItems: Achievement[] = [
  { image: "", title: "Республикалық олимпиада", subject: "Математика", grade: "6 сынып", place: "I орын", category: "olympiad", variant: "dark", photoSide: "right" },
  { image: "", title: "«Жас зерттеуші» байқауы", subject: "Жаратылыстану", grade: "7 сынып", place: "II орын", category: "contest", variant: "light", photoSide: "right" },
  { image: "", title: "Шахматтан республикалық турнир", subject: "Шахмат", grade: "5–6 сынып", place: "I орын", category: "sport", variant: "light", photoSide: "left" },
  { image: "", title: "«Дарын» республикалық байқауы", subject: "Қазақ тілі мен әдебиеті", grade: "8 сынып", place: "III орын", category: "contest", variant: "light", photoSide: "right" },
  { image: "", title: "Республикалық ғылыми жоба конкурсы", subject: "Ғылым", grade: "9 сынып", place: "II орын", category: "contest", variant: "dark", photoSide: "right" },
  { image: "", title: "«Зерде» байқауы", subject: "Орыс тілі", grade: "7 сынып", place: "I орын", category: "contest", variant: "light", photoSide: "left" },
  { image: "", title: "Футболдан қалалық турнир", subject: "Спорт", grade: "6–7 сынып", place: "I орын", category: "sport", variant: "dark", photoSide: "right" },
  { image: "", title: "«Бозторғай» өнер байқауы", subject: "Домбыра", grade: "6–8 сынып", place: "II орын", category: "art", variant: "light", photoSide: "left" },
  { image: "", title: "IT Olympiad", subject: "Информатика", grade: "8–9 сынып", place: "III орын", category: "olympiad", variant: "light", photoSide: "left" },
];

const emptyItem: Achievement = {
  image: "", title: "", subject: "", grade: "", place: "", category: "olympiad", variant: "light", photoSide: "left",
};

const pad = (n: number) => String(n).padStart(2, "0");

function CardPhoto({ image, dark = false, className = "" }: { image: string; dark?: boolean; className?: string }) {
  return image ? (
    <img src={image} alt="" className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`flex h-full w-full items-center justify-center ${dark ? "bg-[#2A2622] text-white/20" : "bg-[#E6DED2] text-[#B9A994]"} ${className}`}>
      <ImageIcon className="h-10 w-10" />
    </div>
  );
}

function CardText({ item, number, dark }: { item: Achievement; number: number; dark: boolean }) {
  const muted = dark ? "text-white/70" : "text-[#8A8175]";
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        <p className={`${SERIF} text-3xl font-normal leading-none sm:text-4xl ${dark ? "text-white/90" : "text-[#9C8A73]"}`}>{pad(number)}</p>
        <h3 className={`${SERIF} mt-3 line-clamp-3 text-[17px] font-medium leading-snug ${dark ? "text-white" : "text-[#1F1B16]"}`}>{item.title}</h3>
        {item.subject && <p className={`mt-1.5 line-clamp-2 text-sm leading-snug ${dark ? "text-white/90" : "text-[#3A342C]"}`}>{item.subject}</p>}
        {item.grade && <p className={`mt-1 text-xs ${muted}`}>{item.grade}</p>}
      </div>
      {item.place && <p className={`${SERIF} mt-2 shrink-0 text-2xl leading-tight ${dark ? "text-white" : BROWN}`}>{item.place}</p>}
      <span
        className={`mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
          dark ? "border-white/60 text-white group-hover:bg-white group-hover:text-black" : "border-[#3A342C]/50 text-[#3A342C] group-hover:bg-[#3A342C] group-hover:text-white"
        }`}
      >
        <ArrowRight className="h-4 w-4" />
      </span>
    </div>
  );
}

export default function StudentsAchievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const heroSlots = usePhotoSlots("students.achievements.hero", 1);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [viewing, setViewing] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ index: number; draft: Achievement } | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: record } = useQuery<any>({
    queryKey: ["/api/content", ITEMS_KEY],
    queryFn: async () => {
      const res = await fetch(`/api/content?key=${ITEMS_KEY}&lang=kz`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    },
  });

  const items: Achievement[] = useMemo(() => {
    if (record?.value) {
      try {
        const parsed = JSON.parse(record.value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* fall back to the placeholder cards */
      }
    }
    return defaultItems;
  }, [record]);

  const save = useMutation({
    mutationFn: async (list: Achievement[]) => {
      const value = JSON.stringify(list);
      const res = record?.id
        ? await fetch(`/api/content/${record.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
            credentials: "include",
          })
        : await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: ITEMS_KEY, lang: "kz", value, type: "json" }),
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

  // Keep each card's position in the full list so numbering stays stable under filters
  const filtered = items.map((item, index) => ({ item, index })).filter(({ item }) => filter === "all" || item.category === filter);
  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);

  const move = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    const list = [...items];
    [list[index], list[to]] = [list[to], list[index]];
    save.mutate(list);
  };

  const remove = (index: number) => {
    if (!window.confirm("Бұл жетістікті өшіресіз бе?")) return;
    save.mutate(items.filter((_, i) => i !== index));
  };

  const submitEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const list = [...items];
    if (editing.index === -1) list.push(editing.draft);
    else list[editing.index] = editing.draft;
    save.mutate(list);
  };

  const uploadDraftPhoto = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditing((cur) => (cur ? { ...cur, draft: { ...cur.draft, image: url } } : cur));
    } catch (err: any) {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const setDraft = (patch: Partial<Achievement>) =>
    setEditing((cur) => (cur ? { ...cur, draft: { ...cur.draft, ...patch } } : cur));

  const viewed = viewing !== null ? items[viewing] : null;
  const selectClass = "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-black";

  return (
    <section className={`mb-16 overflow-hidden rounded-[2rem] ${CREAM} p-5 sm:p-8 lg:p-10`}>
      {/* Hero */}
      <div className="relative mb-10 grid overflow-hidden rounded-2xl lg:grid-cols-[1fr_1.15fr]">
        <div className="relative z-10 py-4 lg:py-12 lg:pr-4">
          <EditableText
            contentKey="students.achievements.eyebrow"
            defaultValue="Оқушылардың жетістіктері"
            tag="p"
            className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#3A342C]"
          />
          <EditableText
            contentKey="students.achievements.title"
            defaultValue={"Оқушылардың\nжетістіктері"}
            tag="h2"
            multiline
            className={`${SERIF} whitespace-pre-line text-4xl font-normal uppercase leading-[1.05] text-[#1F1B16] sm:text-5xl xl:text-6xl`}
          />
          <EditableText
            contentKey="students.achievements.subtitle"
            defaultValue="Мектеп қабырғасынан тыс жерде"
            tag="p"
            className={`${SERIF} mt-5 text-2xl italic text-[#5C5247]`}
          />
          <EditableText
            contentKey="students.achievements.text"
            defaultValue="Оқушыларымыздың білімі, таланты мен еңбегі түрлі олимпиадалар мен байқауларда өз нәтижесін көрсетуде."
            tag="p"
            multiline
            className="mt-6 max-w-md text-[#3A342C]"
          />
        </div>

        <div className="relative min-h-[260px] overflow-hidden rounded-2xl sm:min-h-[340px] lg:min-h-0">
          <PhotoSlot slots={heroSlots} index={0} inputId="students-achievements-hero" className="!absolute inset-0 !bg-[#E6DED2]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-[#F4EFE7] to-transparent lg:block" />
          <div className="pointer-events-none absolute right-5 top-5 hidden flex-col items-center text-xs text-white/90 drop-shadow sm:flex">
            <span>01</span>
            <span className="my-1 h-10 w-px bg-white/70" />
            <span>{pad(items.length)}</span>
          </div>
          <a
            href="#achievements-grid"
            className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-sm text-white backdrop-blur-sm hover:bg-black/50"
          >
            Біздің жетістіктеріміз
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Filters */}
      <div id="achievements-grid" className="mb-6 flex scroll-mt-24 flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key);
                setShowAll(false);
              }}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                filter === key ? "bg-[#7A5C3E] text-white" : "text-[#3A342C] hover:bg-[#E6DED2]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <Button
              size="sm"
              className="rounded-full bg-[#7A5C3E] text-white hover:bg-[#654b32]"
              onClick={() => setEditing({ index: -1, draft: { ...emptyItem, category: filter === "all" ? "olympiad" : filter } })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Жетістік қосу
            </Button>
          )}
          {filtered.length > PAGE_SIZE && (
            <button type="button" onClick={() => setShowAll((v) => !v)} className="flex items-center gap-2 text-sm text-[#3A342C] hover:text-[#7A5C3E]">
              {showAll ? "Жасыру" : "Барлық жетістіктер"}
              <ArrowRight className={`h-4 w-4 transition-transform ${showAll ? "-rotate-90" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      {visible.length === 0 ? (
        <p className="py-10 text-center text-[#8A8175]">Бұл санатта әзірге жетістік жоқ.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ item, index }) => {
            const dark = item.variant === "dark";
            return (
              <div key={index} className="relative">
                <button
                  type="button"
                  onClick={() => setViewing(index)}
                  className="group relative block h-[250px] w-full overflow-hidden rounded-lg text-left shadow-sm transition-shadow hover:shadow-lg sm:h-[270px]"
                >
                  {dark ? (
                    <>
                      <div className="absolute inset-0 bg-[#1B1B1F]">
                        <CardPhoto image={item.image} dark className="transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
                      <div className="relative h-full w-3/5 p-5">
                        <CardText item={item} number={index + 1} dark />
                      </div>
                    </>
                  ) : (
                    <div className={`flex h-full ${item.photoSide === "left" ? "flex-row-reverse" : ""}`}>
                      <div className="w-3/5 bg-[#EEE7DC] p-4 sm:w-[55%] sm:p-5">
                        <CardText item={item} number={index + 1} dark={false} />
                      </div>
                      <div className="w-2/5 overflow-hidden sm:w-[45%]">
                        <CardPhoto image={item.image} className="transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    </div>
                  )}
                </button>

                {user && (
                  <div className="absolute right-2 top-2 z-10 flex gap-1.5">
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white" title="Алға" disabled={index === 0 || save.isPending} onClick={() => move(index, -1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white" title="Артқа" disabled={index === items.length - 1 || save.isPending} onClick={() => move(index, 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white text-blue-600" title="Өңдеу" onClick={() => setEditing({ index, draft: item })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white text-red-600" title="Өшіру" onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Card details */}
      <Dialog open={!!viewed} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-2xl overflow-hidden bg-[#F4EFE7] p-0 text-black">
          {viewed && (
            <div className="grid sm:grid-cols-2">
              <div className="aspect-[4/5] sm:aspect-auto sm:min-h-[360px]">
                <CardPhoto image={viewed.image} />
              </div>
              <div className="p-6 sm:p-8">
                <DialogHeader className="text-left">
                  <p className={`${SERIF} text-4xl text-[#9C8A73]`}>{pad((viewing ?? 0) + 1)}</p>
                  <DialogTitle className={`${SERIF} mt-2 text-2xl font-medium text-[#1F1B16]`}>{viewed.title}</DialogTitle>
                  <DialogDescription className="text-[#3A342C]">{viewed.subject}</DialogDescription>
                </DialogHeader>
                {viewed.grade && <p className="mt-3 text-sm text-[#8A8175]">{viewed.grade}</p>}
                {viewed.place && <p className={`${SERIF} mt-4 text-3xl ${BROWN}`}>{viewed.place}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Editor (admin only) */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">{editing?.index === -1 ? "Жаңа жетістік" : "Жетістікті өңдеу"}</DialogTitle>
            <DialogDescription className="text-gray-600">Сурет, атауы, пәні, сыныбы және орны.</DialogDescription>
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
                  <Label htmlFor="achievement-photo" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-black hover:bg-gray-50">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Сурет жүктеу
                  </Label>
                  <input
                    id="achievement-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadDraftPhoto(file);
                      e.target.value = "";
                    }}
                  />
                  {editing.draft.image && (
                    <button type="button" className="block text-xs text-red-600 hover:underline" onClick={() => setDraft({ image: "" })}>
                      Суретті өшіру
                    </button>
                  )}
                </div>
              </div>

              {([
                ["title", "Атауы (мысалы: Республикалық олимпиада)"],
                ["subject", "Пәні / бағыты"],
                ["grade", "Сыныбы (мысалы: 6 сынып)"],
                ["place", "Орны (мысалы: I орын)"],
              ] as const).map(([field, label]) => (
                <div key={field} className="space-y-1.5">
                  <Label htmlFor={`achievement-${field}`} className="text-black">{label}</Label>
                  <Input
                    id={`achievement-${field}`}
                    value={editing.draft[field]}
                    onChange={(e) => setDraft({ [field]: e.target.value })}
                    required={field === "title"}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
              ))}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="achievement-category" className="text-black">Санаты</Label>
                  <select id="achievement-category" className={selectClass} value={editing.draft.category} onChange={(e) => setDraft({ category: e.target.value as Category })}>
                    {categories.filter((c) => c.key !== "all").map(({ key, label }) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="achievement-variant" className="text-black">Карточка түрі</Label>
                  <select id="achievement-variant" className={selectClass} value={editing.draft.variant} onChange={(e) => setDraft({ variant: e.target.value as Achievement["variant"] })}>
                    <option value="light">Ашық</option>
                    <option value="dark">Қараңғы</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="achievement-side" className="text-black">Сурет жағы</Label>
                  <select id="achievement-side" className={selectClass} value={editing.draft.photoSide} disabled={editing.draft.variant === "dark"} onChange={(e) => setDraft({ photoSide: e.target.value as Achievement["photoSide"] })}>
                    <option value="left">Сол жақта</option>
                    <option value="right">Оң жақта</option>
                  </select>
                </div>
              </div>

              <Button type="submit" disabled={save.isPending || uploading} className="w-full bg-[#7A5C3E] text-white hover:bg-[#654b32]">
                {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сақтау
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
