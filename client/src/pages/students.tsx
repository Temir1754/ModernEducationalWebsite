import { useEffect, useState, type ReactNode } from "react";
import { Brain, Loader2, Pencil, Target, Trash2, Trophy, Type, Upload, Image as ImageIcon, type LucideIcon } from "lucide-react";
import SEOHead from "@/components/seo-head";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EditableText from "@/components/admin/editable-text";
import { PhotoSlot, saveContent, usePhotoSlots } from "@/components/admin/photo-slots";
import EditableGallery from "@/components/admin/editable-gallery";
import StudentsAchievements from "@/components/students-achievements";
import StudentsUpay from "@/components/students-upay";
import ContactCta from "@/components/contact-cta";

interface BannerTextField {
  key: string;
  label: string;
  defaultValue: string;
}

// One form for all banner texts; writes the same content keys the inline EditableText fields read
function BannerTextEditor({ open, onClose, fields }: { open: boolean; onClose: () => void; fields: BannerTextField[] }) {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setValues(null);
      return;
    }
    Promise.all(
      fields.map(async ({ key, defaultValue }) => {
        const data = await fetch(`/api/content?key=${key}&lang=kz`).then((r) => (r.ok ? r.json() : []));
        return [key, data?.[0]?.value || defaultValue] as const;
      }),
    ).then((entries) => setValues(Object.fromEntries(entries)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    try {
      await Promise.all(fields.map(({ key }) => saveContent(key, values[key] ?? "")));
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Сақталды" });
      onClose();
    } catch (err: any) {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-black">Баннер мәтіні</DialogTitle>
          <DialogDescription className="text-gray-600">Баннердегі жазуларды өзгертіңіз.</DialogDescription>
        </DialogHeader>
        {!values ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {fields.map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-black">{label}</Label>
                <Input
                  id={key}
                  value={values[key] ?? ""}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  className="border-gray-300 bg-white text-black"
                />
              </div>
            ))}
            <Button type="submit" disabled={saving} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сақтау
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface EventSectionProps {
  /** Content-key prefix, e.g. "students.game" */
  prefix: string;
  icon: LucideIcon;
  /** Round outlined badge (logic game) or a bare yellow icon (olympiad) */
  iconStyle?: "ring" | "plain";
  eyebrow?: string;
  title1: string;
  title2: string;
  motto: string;
  texts: string[];
  goalTitle: string;
  goalText: string;
  /** Extra overlay on the right side of the banner (legend, slogan) */
  bannerExtra?: ReactNode;
  /** Texts inside bannerExtra, so the banner text form can edit them too */
  extraTextFields?: BannerTextField[];
  photoCaptions?: string[];
}

// Event block: banner with photo background (or the uploaded image alone), description, goal card and optional photo grid
function EventSection({
  prefix,
  icon: Icon,
  iconStyle = "ring",
  eyebrow,
  title1,
  title2,
  motto,
  texts,
  goalTitle,
  goalText,
  bannerExtra,
  extraTextFields = [],
  photoCaptions = [],
}: EventSectionProps) {
  // Edit controls are admin-only; inspectors get a read-only view.
  const { isAdmin, user: authUser } = useAuth();
  const user = isAdmin ? authUser : null;
  // Banner slot 0 is the image, slot 1 the display mode ("image" = uploaded picture only, no text overlay)
  const bannerSlots = usePhotoSlots(`${prefix}.banner`, 2);
  const [bannerImage, bannerMode] = bannerSlots.photos;
  const bannerImageOnly = bannerMode === "image" && !!bannerImage;
  const [editingText, setEditingText] = useState(false);
  const idBase = prefix.replace(/\./g, "-");

  return (
    <section className="mb-16 last:mb-0">
      {/* Banner */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-[#2A4A46] shadow-lg">
        {bannerImageOnly ? (
          <img src={bannerImage} alt={`${title1} ${title2}`} className="block h-auto w-full" />
        ) : (
          <div className="relative flex min-h-[240px] items-center sm:min-h-[300px]">
            <PhotoSlot slots={bannerSlots} index={0} inputId={`${idBase}-banner`} hideControls className="!absolute inset-0 !bg-[#2F5A55]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#2A4A46] via-[#2A4A46]/85 to-[#2A4A46]/10 sm:via-[#2A4A46]/70 sm:to-transparent md:from-[#2A4A46] md:from-30% md:via-[#2A4A46]/60 md:via-50% md:to-transparent md:to-70%" />

            {bannerExtra}

            <div className="relative z-10 flex items-center gap-5 p-6 sm:p-10">
              {iconStyle === "ring" ? (
                <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-white/30 text-white sm:flex">
                  <Icon className="h-9 w-9" />
                </span>
              ) : (
                <Icon className="hidden h-20 w-20 shrink-0 text-[#F2A63B] sm:block" strokeWidth={1.5} />
              )}
              <div>
                {eyebrow && (
                  <EditableText
                    contentKey={`${prefix}.eyebrow`}
                    defaultValue={eyebrow}
                    tag="p"
                    className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/80"
                  />
                )}
                <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">
                  <EditableText contentKey={`${prefix}.title1`} defaultValue={title1} tag="span" className="block text-white" />
                  <EditableText contentKey={`${prefix}.title2`} defaultValue={title2} tag="span" className="block text-[#F2A63B]" />
                </h2>
                <EditableText
                  contentKey={`${prefix}.motto`}
                  defaultValue={motto}
                  tag="p"
                  className="mt-4 text-base font-medium text-white/90 sm:text-lg"
                />
              </div>
            </div>
          </div>
        )}

        {user && (
          <div className="absolute right-3 top-3 z-20 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#2A4A46] shadow-md hover:bg-gray-100"
              onClick={() => setEditingText(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Мәтінді өңдеу
            </button>
            <Label
              htmlFor={`${idBase}-banner-upload`}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#2A4A46] shadow-md hover:bg-gray-100"
            >
              {bannerSlots.uploadingIndex === 0 ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              Суретті ауыстыру
            </Label>
            <input
              id={`${idBase}-banner-upload`}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={bannerSlots.uploadingIndex !== null}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) bannerSlots.upload(0, file);
                e.target.value = "";
              }}
            />
            {bannerImage && (
              <>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#2A4A46] shadow-md hover:bg-gray-100"
                  onClick={() => bannerSlots.set(1, bannerImageOnly ? "" : "image")}
                >
                  {bannerImageOnly ? <Type className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                  {bannerImageOnly ? "Мәтінмен" : "Тек сурет"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-md hover:bg-gray-100"
                  onClick={() => bannerSlots.remove(0)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Өшіру
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Description + goal */}
      <div className={`grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start mb-10`}>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          {texts.map((text, index) => (
            <EditableText key={index} contentKey={`${prefix}.text${index + 1}`} defaultValue={text} tag="p" multiline />
          ))}
        </div>
        <div className="flex items-start gap-5 rounded-2xl bg-[#EAF4F0] p-6 dark:bg-[#131722] sm:p-8">
          <Target className="h-14 w-14 shrink-0 text-[#24806A]" />
          <div className="border-l-2 border-[#F2A63B] pl-5">
            <EditableText
              contentKey={`${prefix}.goal.title`}
              defaultValue={goalTitle}
              tag="h3"
              className="mb-2 text-xl font-bold text-[#2A4A46] dark:text-gray-100"
            />
            <EditableText
              contentKey={`${prefix}.goal.text`}
              defaultValue={goalText}
              tag="p"
              multiline
              className="text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>

      {user && (
        <BannerTextEditor
          open={editingText}
          onClose={() => setEditingText(false)}
          fields={[
            ...(eyebrow ? [{ key: `${prefix}.eyebrow`, label: "Жоғарғы жазу", defaultValue: eyebrow }] : []),
            { key: `${prefix}.title1`, label: "Тақырып (ақ)", defaultValue: title1 },
            { key: `${prefix}.title2`, label: "Тақырып (сары)", defaultValue: title2 },
            { key: `${prefix}.motto`, label: "Ұран", defaultValue: motto },
            ...extraTextFields,
          ]}
        />
      )}

      {/* Photo gallery (admin can add, edit, reorder and delete photos) */}
      <EditableGallery contentKey={`${prefix}.gallery`} defaultCaptions={photoCaptions} />
    </section>
  );
}

export default function StudentsPage() {
  return (
    <>
      <SEOHead page="students" />

      <div className="min-h-screen bg-white bg-grid-pattern dark:bg-[#0f172a]">
        <div className="container mx-auto px-4 py-10 sm:py-12">

          {/* Students achievements */}
          <StudentsAchievements />

          {/* FGS olympiad */}
          <EventSection
            prefix="students.olympiad"
            icon={Trophy}
            iconStyle="plain"
            title1="FGS-"
            title2="олимпиадасы"
            motto="Білім • Логика • Бәсеке • Жетістік"
            texts={[
              "Біздің мектепте FGS-олимпиадасы сәтті өтті. Бұл іс-шара оқушылардың білімін тереңдетіп, логикалық ойлауын дамытуға және шығармашылық қабілеттерін шыңдауға бағытталған. Олимпиадаға әртүрлі сынып оқушылары қатысып, өз білімін сынап, жоғары нәтижелерге қол жеткізуге тырысты.",
              "Оқушылар тапсырмаларды қызығушылықпен орындап, өзара білімін салыстырып, нағыз зияткерлік бәсекеде бақ сынады.",
            ]}
            goalTitle="Олимпиаданың мақсаты:"
            goalText="оқушылардың білімін, логикалық ойлауын және шығармашылық қабілеттерін дамыту."
            photoCaptions={[
              "Олимпиадаға қатысушылар",
              "Тапсырмаларды орындау",
              "Жауаптарды тексеру",
            ]}
            extraTextFields={[
              { key: "students.olympiad.slogan", label: "Слоган", defaultValue: "Бүгінгі білім — ертеңгі жетістік!" },
            ]}
            bannerExtra={
              <div className="pointer-events-none absolute bottom-6 right-8 z-10 hidden max-w-[200px] -rotate-6 md:block">
                <EditableText
                  contentKey="students.olympiad.slogan"
                  defaultValue="Бүгінгі білім — ертеңгі жетістік!"
                  tag="p"
                  multiline
                  className="pointer-events-auto text-right text-2xl font-bold italic leading-snug text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                />
                <div className="ml-auto mt-1 h-1 w-32 rounded-full bg-[#F2A63B]" />
              </div>
            }
          />

          {/* UPay */}
          <div className="mb-16">
            <StudentsUpay />
          </div>

          {/* Logic game: "Bulls and cows" */}
          <EventSection
            prefix="students.game"
            icon={Brain}
            eyebrow="Логикалық ойын"
            title1="Бұқалар мен"
            title2="сиырлар"
            motto="Ойлан • Талда • Жең!"
            texts={[
              "Біздің мектебімізде оқушылар арасында «Бұқалар мен сиырлар» логикалық ойыны өтті. Бұл ойын оқушылардың логикалық ойлау қабілетін, зейінін және талдау дағдыларын дамытуға бағытталған.",
              "Ойын барысында қатысушылар түрлі комбинацияларды ойлап тауып, өз болжамдарын тексеріп, бір-бірімен жарысты. Балалар тапсырмаларды шешуде өте қызығушылық танытып, белсенділік көрсетті.",
              "Іс-шара мектеп оқушылары арасында достық атмосферада өтті және барлығына жақсы көңіл-күй сыйлады.",
            ]}
            goalTitle="Ойынның мақсаты:"
            goalText="оқушылардың логикалық ойлау қабілетін, зейінін және аналитикалық дағдыларын дамыту."
            photoCaptions={[
              "Ойынға қатысушылар",
              "Комбинацияны талқылау",
              "Жауабын тексеру",
              "Командалық жұмыс",
              "Ойын процесі",
              "Қорытынды кезең",
            ]}
            extraTextFields={[
              { key: "students.game.legend.cow", label: "Белгі 1", defaultValue: "– сиыр" },
              { key: "students.game.legend.cowHint", label: "Белгі 1 түсіндірмесі", defaultValue: "(дұрыс сан, қате орын)" },
              { key: "students.game.legend.bull", label: "Белгі 2", defaultValue: "– бұқа" },
              { key: "students.game.legend.bullHint", label: "Белгі 2 түсіндірмесі", defaultValue: "(дұрыс сан, дұрыс орын)" },
            ]}
            bannerExtra={
              <div className="pointer-events-none absolute bottom-4 right-4 z-10 hidden gap-3 md:flex">
                <div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md">
                  <span className="h-5 w-5 shrink-0 rounded-full bg-gray-900" />
                  <div className="leading-tight">
                    <EditableText contentKey="students.game.legend.cow" defaultValue="– сиыр" tag="p" className="text-sm font-bold text-[#2A4A46]" />
                    <EditableText contentKey="students.game.legend.cowHint" defaultValue="(дұрыс сан, қате орын)" tag="p" className="text-xs text-gray-600" />
                  </div>
                </div>
                <div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md">
                  <span className="h-5 w-5 shrink-0 rounded-full bg-red-500" />
                  <div className="leading-tight">
                    <EditableText contentKey="students.game.legend.bull" defaultValue="– бұқа" tag="p" className="text-sm font-bold text-[#2A4A46]" />
                    <EditableText contentKey="students.game.legend.bullHint" defaultValue="(дұрыс сан, дұрыс орын)" tag="p" className="text-xs text-gray-600" />
                  </div>
                </div>
              </div>
            }
          />

          {/* Contact CTA */}
          <ContactCta className="mt-16 sm:mt-20" />
        </div>
      </div>
    </>
  );
}
