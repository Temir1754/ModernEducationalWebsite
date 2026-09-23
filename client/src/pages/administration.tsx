import { useMemo, useState } from "react";
import { Users, Mail, Phone, ChevronDown, ChevronUp, Pencil, Plus, Trash2, Loader2, Upload, ChevronRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditableText from "@/components/admin/editable-text";

interface Staff {
  name: string;
  position: string;
  education: string;
  experience: string;
  category?: string;
  email: string;
  phone: string;
  photo: string;
}

/** The whole staff list is stored as JSON in site_content under this key. */
const STAFF_KEY = "administration.staff";

const STAFF_FIELDS: { key: keyof Staff; label: string; required?: boolean }[] = [
  { key: "name", label: "Аты-жөні", required: true },
  { key: "position", label: "Лауазымы", required: true },
  { key: "education", label: "Білімі" },
  { key: "experience", label: "Тәжірибе" },
  { key: "category", label: "Санаты (міндетті емес)" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Телефон" },
];

const defaultAdministrators: Staff[] = [
  {
    name: "Сарсенбаева Алия Раманкуловна",
    position: "Мектеп директоры",
    education: "Халықаралық Қазақ Түрік университеті",
    experience: "32 жыл педагогикалық тәжірибе",
    category: "Зерттеуші",
    email: "fgs.school.2022@gmail.com",
    phone: "+7-775-790-63-63",
    photo: "/staff/director.jpg"
  },
  {
    name: "Абжанова Шарапат Молдахановна",
    position: "Бірінші санатты басшы орынбасары",
    education: "Аймақтық әлеуметтік-инновациялық университеті",
    experience: "35 жыл педагогикалық тәжірибе",
    category: "Зерттеуші",
    email: "fgs.school.2022@gmail.com",
    phone: "+7-775-790-63-63",
    photo: "/staff/deputy-upbringing.jpg"
  },
  {
    name: "Утепбаева Махаббат Анарбековна",
    position: "Педагог-әлеуметтанушы",
    education: "Халықаралық Қазақ Түрік университеті",
    experience: "37 жыл педагогикалық тәжірибе",
    email: "fgs.school.2022@gmail.com",
    phone: "+7-775-790-63-63",
    photo: "/staff/social-pedagogue.jpg"
  },
  {
    name: "Романқұл Салтанат Көшербайқызы",
    position: "Іс қағаздарын жүргізуші",
    education: "Абай атындағы Қазақ ұлттық педагогикалық университеті",
    experience: "7 жыл жұмыс тәжірибесі",
    email: "fgs.school.2022@gmail.com",
    phone: "+7-775-790-63-63",
    photo: ""
  },
  {
    name: "Еркеқұл Жансая Молдабекқызы",
    position: "Педагог-психолог",
    education: "Қазақ ұлттық қыздар педагогикалық университеті",
    experience: "6 жыл педагогикалық тәжірибе",
    email: "fgs.school.2022@gmail.com",
    phone: "+7-775-790-63-63",
    photo: ""
  }
];

export default function AdministrationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState<{ index: number; draft: Staff } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [detail, setDetail] = useState<number | null>(null);

  const { data: staffRecord } = useQuery<any>({
    queryKey: ["/api/content", STAFF_KEY],
    queryFn: async () => {
      const res = await fetch(`/api/content?key=${STAFF_KEY}&lang=kz`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    },
  });

  const administrators: Staff[] = useMemo(() => {
    if (staffRecord?.value) {
      try {
        const parsed = JSON.parse(staffRecord.value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* fall back to the defaults */
      }
    }
    return defaultAdministrators;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffRecord]);

  const saveStaff = useMutation({
    mutationFn: async (list: Staff[]) => {
      const value = JSON.stringify(list);
      const res = staffRecord?.id
        ? await fetch(`/api/content/${staffRecord.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value }),
            credentials: "include",
          })
        : await fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: STAFF_KEY, lang: "kz", value, type: "json" }),
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
    const list = [...administrators];
    const to = index + dir;
    if (to < 0 || to >= list.length) return;
    [list[index], list[to]] = [list[to], list[index]];
    saveStaff.mutate(list);
  };

  const remove = (index: number) => {
    if (!window.confirm(`«${administrators[index].name}» өшіресіз бе?`)) return;
    saveStaff.mutate(administrators.filter((_, i) => i !== index));
  };

  const submitEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const draft = { ...editing.draft, category: editing.draft.category?.trim() || undefined };
    const list = [...administrators];
    if (editing.index === -1) list.push(draft);
    else list[editing.index] = draft;
    saveStaff.mutate(list);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Фото жүктелмеді");
      }
      const { url } = await res.json();
      setEditing((cur) => (cur ? { ...cur, draft: { ...cur.draft, photo: url } } : cur));
    } catch (err: any) {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white bg-grid-pattern dark:bg-[#0f172a]">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="mb-8 text-center">
          <EditableText
            contentKey="administration.heading"
            defaultValue="Әкімшілік"
            tag="h1"
            className="text-3xl md:text-4xl font-bold text-center text-[#2A4A46]"
          />
          {user && (
            <Button
              className="mt-6 rounded-full bg-blue-600 px-6 text-white hover:bg-blue-700"
              onClick={() => setEditing({ index: -1, draft: { name: "", position: "", education: "", experience: "", category: "", email: "", phone: "", photo: "" } })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Қызметкер қосу
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {administrators.map((admin, index) => {
            const [surname, ...rest] = admin.name.trim().split(/\s+/);
            return (
              <div key={index} className="group relative mt-8 flex flex-col border border-gray-200 bg-white pb-4 shadow-sm transition-shadow duration-300 hover:shadow-xl">
                {user && (
                  <div className="absolute -top-8 right-4 z-20 flex gap-1.5">
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white" title="Жоғары" disabled={index === 0 || saveStaff.isPending} onClick={() => move(index, -1)}><ChevronUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white" title="Төмен" disabled={index === administrators.length - 1 || saveStaff.isPending} onClick={() => move(index, 1)}><ChevronDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white text-blue-600" title="Өңдеу" onClick={() => setEditing({ index, draft: { ...admin, category: admin.category || "" } })}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-white text-red-600" title="Өшіру" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                )}

                {/* Portrait in a thin frame, overlapping the top edge of the card */}
                <div className="relative -mt-8 mx-4 aspect-[11/10] overflow-hidden border border-[#2A4A46]/70 bg-gradient-to-br from-[#24806A] to-[#2A4A46] shadow-md">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="h-16 w-16 text-white/50" />
                  </div>
                  {admin.photo && (
                    <img
                      src={admin.photo}
                      alt={admin.name}
                      className="absolute inset-0 h-full w-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                </div>

                <div className="flex-1 px-5 pt-4">
                  <p className="break-words text-lg font-light uppercase tracking-wide text-[#24806A]">{surname}</p>
                  <h3 className="mb-2 break-words text-base font-bold leading-snug text-[#2A4A46]">{rest.join(" ")}</h3>
                  <p className="break-words text-sm font-semibold leading-snug text-gray-700">{admin.position}</p>
                </div>

                <div className="mx-4 mt-3 h-[2px] bg-[#F2A63B]/40">
                  <div className="ml-auto h-[2px] w-1/4 bg-[#F2A63B]" />
                </div>

                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setDetail(index)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#F2A63B] bg-[#F2A63B]/10 px-5 py-2 text-sm font-bold text-[#2A4A46] transition-all hover:bg-[#F2A63B] hover:text-white"
                  >
                    Толығырақ
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center sm:mt-20">
          <h2 className="mb-2 text-2xl font-extrabold uppercase tracking-wide text-[#24806A] md:text-3xl">
            Сізде сұрақтар бар ма?
          </h2>
          <p className="mb-8 text-base font-bold text-gray-900 sm:text-lg">
            Бізбен байланысыңыз, біз оларға қуана жауап береміз
          </p>
          <a href="tel:+77757906363" className="group inline-flex items-center gap-4">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              <span className="absolute inset-0 scale-125 rounded-full border-2 border-[#F2A63B] transition-transform duration-300 group-hover:scale-150" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#24806A] text-white">
                <Phone className="h-5 w-5" />
              </span>
            </span>
            <span className="text-lg font-extrabold uppercase tracking-wide text-[#2A4A46]">
              Байланысу
            </span>
          </a>
        </div>
      </div>

      {/* Staff details */}
      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-white text-black">
          {detail !== null && administrators[detail] && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#2A4A46]">{administrators[detail].name}</DialogTitle>
                <DialogDescription className="text-base font-semibold text-[#24806A]">{administrators[detail].position}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
                <div className="relative aspect-[11/10] overflow-hidden border border-[#2A4A46]/70 bg-gradient-to-br from-[#24806A] to-[#2A4A46]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="h-16 w-16 text-white/50" />
                  </div>
                  {administrators[detail].photo && (
                    <img
                      src={administrators[detail].photo}
                      alt={administrators[detail].name}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                </div>
                <div className="space-y-4">
                  {([
                    ["Білімі", administrators[detail].education],
                    ["Тәжірибе", administrators[detail].experience],
                    ["Санаты", administrators[detail].category],
                  ] as const).map(([label, value]) =>
                    value ? (
                      <div key={label}>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
                        <p className="font-medium leading-snug text-gray-800">{value}</p>
                      </div>
                    ) : null,
                  )}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {administrators[detail].email && (
                      <a href={`mailto:${administrators[detail].email}`} className="flex items-center gap-2 rounded-full border-2 border-[#F2A63B] px-5 py-2 text-sm font-bold text-[#2A4A46] transition-transform hover:scale-105">
                        <Mail className="h-4 w-4" />Хабарлама жазу
                      </a>
                    )}
                    {administrators[detail].phone && (
                      <a href={`tel:${administrators[detail].phone.replace(/[-\s]/g, "")}`} className="flex items-center gap-2 rounded-full bg-[#24806A] px-5 py-2 text-sm font-bold text-white transition-transform hover:scale-105">
                        <Phone className="h-4 w-4" />Хабарласу
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Staff editor (admin only) */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">{editing?.index === -1 ? "Жаңа қызметкер" : "Қызметкерді өңдеу"}</DialogTitle>
            <DialogDescription className="text-gray-600">Мәліметтер мен фотосуретті өзгертіңіз.</DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={submitEditor} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  {editing.draft.photo ? (
                    <img src={editing.draft.photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Users className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff-photo" className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-black hover:bg-gray-50">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Фото жүктеу
                  </Label>
                  <input
                    id="staff-photo"
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
                  {editing.draft.photo && (
                    <button type="button" className="block text-xs text-red-600 hover:underline" onClick={() => setEditing({ ...editing, draft: { ...editing.draft, photo: "" } })}>
                      Фотоны өшіру
                    </button>
                  )}
                </div>
              </div>
              {STAFF_FIELDS.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={`staff-${f.key}`} className="text-black">{f.label}</Label>
                  <Input
                    id={`staff-${f.key}`}
                    value={(editing.draft[f.key] as string) || ""}
                    required={f.required}
                    onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, [f.key]: e.target.value } })}
                    className="border-gray-300 bg-white text-black"
                  />
                </div>
              ))}
              <Button type="submit" disabled={saveStaff.isPending || uploading} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {saveStaff.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сақтау
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
