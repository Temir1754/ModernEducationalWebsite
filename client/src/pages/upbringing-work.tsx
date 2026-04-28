import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft, Heart, Users, BookOpen, Shield, Star, Calendar,
  Phone, Mail, User, Clock, MapPin, MessageCircle, Send,
  Camera, Image, Trophy, Target, CheckCircle, AlertTriangle,
  Music, Palette, Code, Microscope, Globe, Calculator,
  ChevronRight, ChevronDown, ChevronUp, TrendingUp, Award, Activity, Download, ExternalLink,
  Plus, Trash2, Loader2, X, Eye, Pencil, FileText
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Media, Document } from "@shared/schema";

function AdminDocActions({ doc, updateMutation, scansDeleteMutation, onEdit }: {
  doc: any;
  updateMutation: any;
  scansDeleteMutation: any;
  onEdit: (doc: any) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 ml-1 pl-1">
      {/* 1. Көру (View original doc) */}
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        onClick={() => window.open(doc.url, '_blank')}
        title="Көру"
      >
        <Eye className="w-3.5 h-3.5" />
      </Button>

      {/* 2. Жүктеу (Download original doc) */}
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
        onClick={() => {
          const link = document.createElement('a');
          link.href = doc.url;
          link.download = doc.title;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        title="Жүктеу"
      >
        <Download className="w-3.5 h-3.5" />
      </Button>

      {/* 3. Скан (View attached scan) */}
      <Button
        size="sm"
        variant="ghost"
        disabled={!doc.scanUrl}
        className={`h-7 w-7 p-0 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30`}
        onClick={() => doc.scanUrl && window.open(doc.scanUrl, '_blank')}
        title="Сканды көру"
      >
        <FileText className="w-3.5 h-3.5" />
      </Button>

      {/* 4. Қосу (Add/Upload scan) */}
      <label htmlFor="admin-scan-upload" className="cursor-pointer">
        <input
          id="admin-scan-upload"
          name="admin-scan-upload"
          type="file"
          className="hidden"
          accept=".pdf,image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            try {
              const res = await fetch("/api/upload", { method: "POST", body: formData });
              if (!res.ok) throw new Error("Upload failed");
              const { url } = await res.json();
              updateMutation.mutate({ id: doc.id, data: { scanUrl: url } });
            } catch (err) {
              console.error(err);
            }
          }}
        />
        <div className="h-7 w-7 flex items-center justify-center text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors" title="Скан қосу">
          <Plus className="w-3.5 h-3.5" />
        </div>
      </label>

      {/* 5. Өңдеу (Edit document title/url) */}
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
        onClick={() => onEdit(doc)}
        title="Өңдеу"
      >
        <Pencil className="w-3.5 h-3.5" />
      </Button>

      {/* 6. Өшіру (Delete entire document) */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        onClick={() => { if (confirm("Құжатты толық өшіруді растайсыз ба?")) scansDeleteMutation.mutate(doc.id); }}
        title="Өшіру"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

function DocumentItem({
  doc,
  updateMutation,
  scansDeleteMutation,
  onEdit,
  color = "blue",
  isCard = false
}: {
  doc: any;
  updateMutation: any;
  scansDeleteMutation: any;
  onEdit: (doc: any) => void;
  color?: string;
  isCard?: boolean;
}) {
  const { user } = useAuth();
  const isAdmin = user?.role?.trim().toLowerCase() === "admin";

  const colorVariants: Record<string, any> = {
    blue: {
      border: "border-blue-200 dark:border-gray-600",
      bg: "bg-blue-50 dark:bg-blue-900/10",
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
      outline: "border-blue-300 text-blue-700"
    },
    pink: {
      border: "border-pink-200 dark:border-gray-600",
      bg: "bg-pink-50 dark:bg-pink-900/10",
      icon: "text-pink-600",
      button: "bg-pink-600 hover:bg-pink-700",
      outline: "border-pink-300 text-pink-700"
    },
    indigo: {
      border: "border-indigo-100 dark:border-gray-700",
      bg: "bg-white/50 dark:bg-gray-800/40",
      icon: "text-indigo-600",
      button: "bg-indigo-600 hover:bg-indigo-700",
      outline: "border-indigo-300 text-indigo-700"
    },
    green: {
      border: "border-green-200 dark:border-gray-600",
      bg: "bg-white/50 dark:bg-gray-800/40",
      icon: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
      outline: "border-green-300 text-green-700"
    },
    purple: {
      border: "border-purple-200 dark:border-gray-600",
      bg: "bg-white/50 dark:bg-gray-800/40",
      icon: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700",
      outline: "border-purple-300 text-purple-700"
    },
    orange: {
      border: "border-orange-200 dark:border-gray-600",
      bg: "bg-white/50 dark:bg-gray-800/40",
      icon: "text-orange-600",
      button: "bg-orange-600 hover:bg-orange-700",
      outline: "border-orange-300 text-orange-700"
    },
    red: {
      border: "border-red-200 dark:border-gray-600",
      bg: "bg-red-50 dark:bg-red-900/10",
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
      outline: "border-red-300 text-red-700"
    },
    amber: {
      border: "border-amber-200 dark:border-gray-600",
      bg: "bg-amber-50 dark:bg-amber-900/10",
      icon: "text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700",
      outline: "border-amber-300 text-amber-700"
    }
  };

  const v = colorVariants[color] || colorVariants.blue;

  if (isCard) {
    return (
      <div className={`${v.bg} p-4 rounded-lg border ${v.border} flex flex-col justify-between`}>
        <div className="mb-3">
          <h5 className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-1">{doc.title}</h5>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <AdminDocActions doc={doc} updateMutation={updateMutation} scansDeleteMutation={scansDeleteMutation} onEdit={onEdit} />
          ) : (
            <>
              <Button size="sm" className={`${v.button} text-xs h-8 px-3`} onClick={() => window.open(doc.url, '_blank')}>
                <ExternalLink className="w-3 h-3 mr-1" /> Көру
              </Button>
              <Button variant="outline" size="sm" className={`text-xs h-8 px-3 ${v.outline} dark:border-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 font-semibold`} onClick={() => {
                const link = document.createElement('a');
                link.href = doc.url;
                link.download = doc.title;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}>
                <Download className="w-3 h-3 mr-1" /> Жүктеу
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-row items-center justify-between p-3 rounded-lg border ${v.border} ${v.bg}`}>
      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
        <BookOpen className={`w-4 h-4 ${v.icon}`} />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{doc.title}</span>
      </div>
      <div className="flex gap-2">
        {isAdmin ? (
          <AdminDocActions doc={doc} updateMutation={updateMutation} scansDeleteMutation={scansDeleteMutation} onEdit={onEdit} />
        ) : (
          <>
            <Button size="sm" className={`${v.button} text-xs`} onClick={() => window.open(doc.url, '_blank')}>
              <ExternalLink className="w-3 h-3 mr-1" />Көру
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`text-xs ${v.outline} font-semibold dark:border-gray-600 dark:text-gray-300 bg-white dark:bg-[#1e293b]`}
              onClick={() => {
                const link = document.createElement('a');
                link.href = doc.url;
                link.download = doc.title;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="w-3 h-3 mr-1" />Жүктеу
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function CollapsibleDocList({
  docs,
  updateMutation,
  scansDeleteMutation,
  onEdit,
  color,
  isCard = false
}: {
  docs: any[];
  updateMutation: any;
  scansDeleteMutation: any;
  onEdit: (doc: any) => void;
  color?: string;
  isCard?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!docs || docs.length === 0) return null;
  const limit = 3;
  const hasMore = docs.length > limit;
  const visibleDocs = isExpanded ? docs : docs.slice(0, limit);

  return (
    <div className="space-y-3">
      <div className={isCard ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
        <AnimatePresence initial={false}>
          {visibleDocs.map((doc, idx) => (
            <motion.div
              key={doc.id || idx}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DocumentItem
                doc={doc}
                updateMutation={updateMutation}
                scansDeleteMutation={scansDeleteMutation}
                onEdit={onEdit}
                color={color}
                isCard={isCard}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 font-bold border border-dashed border-blue-200 dark:border-blue-900/50 rounded-xl py-6"
        >
          {isExpanded ? (
            <div className="flex items-center gap-2">
              <ChevronUp className="w-4 h-4" />
              <span>Жасыру</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4" />
              <span>Барлығын көрсету ({docs.length - limit} құжат қалды)</span>
            </div>
          )}
        </Button>
      )}
    </div>
  );
}

export default function UpbringingWorkPage() {
  const { user, isLoading } = useAuth();



  console.log("AUTH USER:", user);
  console.log("USER ROLE:", user?.role);

  const isAdmin = user?.role?.trim().toLowerCase() === "admin";

  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [isGalleryUploadOpen, setIsGalleryUploadOpen] = useState(false);
  const [galleryUploadFile, setGalleryUploadFile] = useState<File | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isScansUploadOpen, setIsScansUploadOpen] = useState(false);
  const [scansUploadFile, setScansUploadFile] = useState<File | null>(null);
  const [scansTitle, setScansTitle] = useState("");
  const [activeUploadSection, setActiveUploadSection] = useState<string | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [isProgramUploadOpen, setIsProgramUploadOpen] = useState(false);
  const [uploadYear, setUploadYear] = useState("2025-2026");
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isEventEditDialogOpen, setIsEventEditDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    dateText: "",
    month: "Тамыз",
    description: "",
    academicYear: "2025-2026"
  });
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set(["Тамыз"]));
  const [activeSection, setActiveSection] = useState<string>("");
  const [isProgramsDropdownOpen, setIsProgramsDropdownOpen] = useState(false);

  // Scroll Spy Logic
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ['goals', 'programs', 'contacts', 'code', 'prevention', 'events'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleClickOutside = (event: any) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        setIsProgramsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      observer.disconnect();
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // --- Queries ---
  const { data: galleryItems = [], isLoading: galleryLoading } = useQuery<Media[]>({
    queryKey: ["/api/media", "events"],
    queryFn: async () => {
      const res = await fetch("/api/media?section=events");
      if (!res.ok) return [];
      const data = await res.json();
      return data.filter((m: any) => m.section === "events");
    }
  });

  const { data: scansItems = [], isLoading: scansLoading } = useQuery<any[]>({
    queryKey: ["/api/documents", "upbringing-scans"],
    queryFn: async () => {
      const res = await fetch("/api/documents?section=upbringing-scans");
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: allEvents = [] } = useQuery<any[]>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: programDocs = [] } = useQuery<any[]>({
    queryKey: ["/api/documents", "upbringing-work-all"],
    queryFn: async () => {
      const res = await fetch("/api/documents");
      if (!res.ok) return [];
      const data = await res.json();
      return data.filter((doc: any) =>
        doc.section && (
          doc.section.startsWith("upbringing-program-") ||
          doc.section.startsWith("crime-prevention-") ||
          doc.section === "upbringing-student-code"
        )
      );
    }
  });


  const galleryUploadMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!galleryUploadFile) return;
      const formData = new FormData();
      formData.append("file", galleryUploadFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();
      const mediaRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image",
          url,
          section: "events",
          eventId: activeEventId
        }),
      });
      if (!mediaRes.ok) throw new Error("Failed to save");
      return mediaRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setIsGalleryUploadOpen(false);
      setGalleryUploadFile(null);
      setActiveEventId(null);
    }
  });

  const galleryDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
    }
  });

  const eventUpdateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Event update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsEventEditDialogOpen(false);
      setEditingEvent(null);
    }
  });

  const eventCreateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Event creation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsAddEventDialogOpen(false);
      setNewEvent({ title: "", dateText: "", month: "Тамыз", description: "", academicYear: "2025-2026" });
    }
  });

  const eventDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    }
  });

  const scansUploadMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!scansUploadFile) return;
      const formData = new FormData();
      formData.append("file", scansUploadFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: scansTitle || scansUploadFile.name,
          description: "",
          section: "upbringing-scans",
          url,
          color: "blue",
          icon: "file",
          academicYear: uploadYear
        }),
      });
      if (!docRes.ok) throw new Error("Failed to save");
      return docRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setIsScansUploadOpen(false);
      setScansUploadFile(null);
      setScansTitle("");
    }
  });

  const scansDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/documents/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    }
  });

  const monthNames = [
    "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан", "Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр"
  ];

  const academicYears = ["2025-2026", "2026-2027"];

  const expandedEvents = [
    {
      month: "Тамыз",
      events: [
        {
          id: "tamyz-1",
          title: "FGS IV олимпиадасы",
          date: "20 тамыз",
          description: "FGS IV олимпиадасы өтті, олимпиадаға қаланың барлық мектептерінен оқушылар қатысты. Олар өз білімдерін байқап шыңдай білді.",
          photos: [] as string[]
        },
        {
          id: "tamyz-2",
          title: "Ашық есік күні «Білім мен мүмкіндіктер әлемі»",
          date: "25 тамыз",
          description: "Ашық есік күні барысында мектептің әкімшілігі мен педагогикалық ұжым ата-аналар мен оқушыларды қарсы алып, жаңа оқу жылындағы жоспарлар мен жаңалықтар таныстырылды.",
          photos: [] as string[]
        }
      ]
    },
    {
      month: "Қыркүйек",
      events: [
        { id: "qyr-1", title: "Білім күні мерекесі", date: "1 қыркүйек", description: "Жаңа оқу жылын ашу салтанаты", photos: [] as string[] },
        { id: "qyr-2", title: "Адаптация аптасы", date: "5-9 қыркүйек", description: "Жаңа оқушыларды бейімдеу", photos: [] as string[] }
      ]
    },
    {
      month: "Қазан",
      events: [
        { id: "qaz-1", title: "Ұстаздар күні", date: "7 қазан", description: "Мұғалімдерді құрметтеу шарасы", photos: [] as string[] },
        { id: "qaz-2", title: "Күз мерекесі", date: "15 қазан", description: "Шығармашылық көрме-конкурс", photos: [] as string[] }
      ]
    },
    {
      month: "Қараша",
      events: [
        { id: "qar-1", title: "Тәуелсіздік күні қарсаңындағы шаралар", date: "Қараша", description: "Патриоттық тәрбие шаралары", photos: [] as string[] }
      ]
    },
    {
      month: "Желтоқсан",
      events: [
        { id: "zhel-1", title: "Тәуелсіздік күні", date: "16 желтоқсан", description: "Мерекелік іс-шара", photos: [] as string[] },
        { id: "zhel-2", title: "Жаңа жыл мерекесі", date: "Желтоқсан", description: "Мерекелік ертеңгілік", photos: [] as string[] }
      ]
    },
    {
      month: "Қаңтар",
      events: [
        { id: "qan-1", title: "Қысқы мектеп", date: "Қаңтар", description: "Оқушылардың білімін толықтыру", photos: [] as string[] }
      ]
    },
    {
      month: "Ақпан",
      events: [
        { id: "aqp-1", title: "Ғылым апталығы", date: "Ақпан", description: "Жас зерттеушілер көрмесі", photos: [] as string[] }
      ]
    },
    {
      month: "Наурыз",
      events: [
        { id: "nau-1", title: "Наурыз мейрамы", date: "22 наурыз", description: "Ұлттық мерекені тойлау", photos: [] as string[] }
      ]
    },
    {
      month: "Сәуір",
      events: [
        { id: "sau-1", title: "Бенефис шоу", date: "Сәуір", description: "Шығармашылық есеп беру кеші", photos: [] as string[] }
      ]
    },
    {
      month: "Мамыр",
      events: [
        { id: "mam-1", title: "Жеңіс күні", date: "9 мамыр", description: "Патриоттық шара", photos: [] as string[] },
        { id: "mam-2", title: "Сыңғырла, соңғы қоңырау!", date: "25 мамыр", description: "Оқу жылын қорытындылау", photos: [] as string[] }
      ]
    }
  ];

  const groupedEvents = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    monthNames.forEach(m => grouped[m] = []);

    const filteredEvents = allEvents.filter(evt => evt.academicYear === selectedYear);

    filteredEvents.forEach(evt => {
      const targetMonth = evt.month || monthNames.find(m => evt.dateText?.toLowerCase().includes(m.toLowerCase())) || monthNames[0];
      if (!grouped[targetMonth]) grouped[targetMonth] = [];
      grouped[targetMonth].push({
        ...evt,
        date: evt.dateText // Map dateText to date for UI consistency if needed, though better to fix UI
      });
    });

    if (filteredEvents.length === 0 && allEvents.length === 0) {
      return expandedEvents; // Show mock data for all years to demonstrate functionality
    }

    return monthNames
      .map(month => ({
        month,
        events: grouped[month]
      }))
      .filter(m => m.events.length > 0);
  }, [allEvents, selectedYear]);

  const toggleMonth = (month: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(month)) {
      newExpanded.delete(month);
    } else {
      newExpanded.add(month);
    }
    setExpandedMonths(newExpanded);
  };

  const toggleAllMonths = (expand: boolean) => {
    if (expand) {
      setExpandedMonths(new Set(groupedEvents.map(m => m.month)));
    } else {
      setExpandedMonths(new Set());
    }
  };

  const programUploadMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!scansUploadFile || !activeUploadSection) return;
      const formData = new FormData();
      formData.append("file", scansUploadFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: scansTitle || scansUploadFile.name,
          description: "",
          section: activeUploadSection,
          url,
          color: "blue",
          icon: "file",
          academicYear: uploadYear
        }),
      });
      if (!docRes.ok) throw new Error("Failed to save");
      return docRes.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Interactive Statistics
  const statistics = [
    {
      icon: <Users className="w-8 h-8" />,
      number: "100%",
      label: "оқушы қамтылған",
      color: "bg-blue-50 text-blue-600 border-blue-200",
      bgColor: "bg-blue-600"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      number: "15+",
      label: "үйірме мен секция",
      color: "bg-green-50 text-green-600 border-green-200",
      bgColor: "bg-green-600"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      number: "50+",
      label: "жылдық іс-шара",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      bgColor: "bg-purple-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "95%",
      label: "белсенділік деңгейі",
      color: "bg-orange-50 text-orange-600 border-orange-200",
      bgColor: "bg-orange-600"
    }
  ];

  // Responsible Persons Contacts
  const responsiblePersons = [
    {
      name: "Утепбаева Махаббат Анарбековна",
      position: "Тәрбие жұмысы жөніндегі орынбасар",
      phone: "+7‒775‒790‒63‒63",
      email: "fgs.school.2022@gmail.com",
      icon: <User className="w-6 h-6" />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      name: "Катаева Молдир Сабырхановна",
      position: "Психолог",
      phone: "+7‒775‒790‒63‒63",
      email: "fgs.school.2022@gmail.com",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-green-50 border-green-200"
    },
    {
      name: "Бекболат Жасмин Жанаділқызы",
      position: "Әлеуметтік педагог",
      phone: "+7‒775‒790‒63‒63",
      email: "fgs.school.2022@gmail.com",
      icon: <Users className="w-6 h-6" />,
      color: "bg-purple-50 border-purple-200"
    },
    {
      name: "Насурлаев Бауыржан Ташабаевич",
      position: '"Жас сарбаз" жетекшісі',
      phone: "+7‒775‒790‒63‒63",
      email: "fgs.school.2022@gmail.com",
      icon: <Star className="w-6 h-6" />,
      color: "bg-red-50 border-red-200"
    }
  ];

  // Clubs Schedule
  const clubsSchedule = [
    {
      day: "Дүйсенбі",
      clubs: [
        { name: "Хореография", time: "15:00-16:30", icon: <Music className="w-4 h-4" /> },
        { name: "Дизайн", time: "14:30-16:00", icon: <Palette className="w-4 h-4" /> }
      ]
    },
    {
      day: "Сейсенбі",
      clubs: [
        { name: "Домбыра", time: "16:00-17:00", icon: <Music className="w-4 h-4" /> },
        { name: "Робототехника", time: "15:30-17:00", icon: <Code className="w-4 h-4" /> }
      ]
    },
    {
      day: "Сәрсенбі",
      clubs: [
        { name: "Хореография", time: "15:00-16:30", icon: <Music className="w-4 h-4" /> },
        { name: "Дизайн", time: "14:30-16:00", icon: <Palette className="w-4 h-4" /> }
      ]
    },
    {
      day: "Бейсенбі",
      clubs: [
        { name: "Домбыра", time: "16:00-17:00", icon: <Music className="w-4 h-4" /> },
        { name: "Жас зерттеуші", time: "15:00-16:30", icon: <Microscope className="w-4 h-4" /> }
      ]
    },
    {
      day: "Жұма",
      clubs: [
        { name: "Хореография", time: "15:00-16:30", icon: <Music className="w-4 h-4" /> },
        { name: "Ағылшын тілі клубы", time: "16:00-17:00", icon: <Globe className="w-4 h-4" /> }
      ]
    }
  ];

  // Expanded Annual Events

  // Crime Prevention structured data
  const preventionMeasures = [
    {
      category: "Психологиялық қолдау",
      icon: <Heart className="w-5 h-5" />,
      color: "text-blue-600",
      measures: [
        "Психологпен жеке кеңес беру",
        "Топтық психологиялық тренингтер",
        "Отбасылық консультациялар",
        "Стресс басқару дағдылары"
      ]
    },
    {
      category: "Әлеуметтік жұмыс",
      icon: <Users className="w-5 h-5" />,
      color: "text-green-600",
      measures: [
        "Әлеуметтік педагогпен кеңес",
        "Қиын отбасылармен жұмыс",
        "Әлеуметтік бейімдеу",
        "Қоғамдық қызметке тарту"
      ]
    },
    {
      category: "Құқықтық ағарту",
      icon: <Shield className="w-5 h-5" />,
      color: "text-purple-600",
      measures: [
        "Құқықтық білім беру",
        "Заң қорғау органдарымен әңгімелесу",
        "Жауапкершілік туралы дәрістер",
        "Құқықтық викториналар"
      ]
    },
    {
      category: "Дене тәрбиесі",
      icon: <Trophy className="w-5 h-5" />,
      color: "text-orange-600",
      measures: [
        "Спорт секцияларына тарту",
        "Спорттық жарыстар ұйымдастыру",
        "Туристік жорықтар",
        "Салауатты өмір салты насихаты"
      ]
    }
  ];

  const programs = [
    {
      title: "Сынып жетекшілігі",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      description: "Әр сыныпта тәжірибелі сынып жетекшісі бар. Олар оқушылармен жеке жұмыс жасайды.",
      activities: ["Жеке кеңес беру", "Ата-аналармен жұмыс", "Сыныптан тыс іс-шаралар", "Академиялық бақылау"],
      color: "border-blue-200 bg-blue-50",
      pdfUrl: "#"
    },
    {
      title: "Жас сарбаз ұйымы",
      icon: <Star className="w-8 h-8 text-red-600" />,
      description: "Патриоттық тәрбие беруге арналған ұйым. Оқушылардың азаматтық қасиеттерін дамытады.",
      activities: ["Әскери-патриоттық тәрбие", "Саптық дайындық", "Спорттық жарыстар", "Ант қабылдау рәсімі"],
      color: "border-red-200 bg-red-50",
      pdfUrl: "#"
    },
    {
      title: "Мектеп парламенті",
      icon: <Shield className="w-8 h-8 text-green-600" />,
      description: "Оқушылардың өзін-өзі басқару органы. Мектеп өмірінде белсенді қатысуға үйретеді.",
      activities: ["Мектеп өзін-өзі басқару", "Іс-шараларды жоспарлау", "Қайырымдылық акциялары", "Оқушылар құқығын қорғау"],
      color: "border-green-200 bg-green-50",
      pdfUrl: "#"
    },
    {
      title: "Инабатты қыздар",
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      description: "Қыз балаларға арналған тәрбие бағдарламасы. Әдептілік пен мәдениетті дамытады.",
      activities: ["Өнер үйірмелері", "Мәдени бағдарламалар", "Жанашырлық тәрбие", "Дәстүрлі құндылықтар"],
      color: "border-pink-200 bg-pink-50",
      pdfUrl: "#"
    },
    {
      title: "Адал азамат",
      icon: <Award className="w-8 h-8 text-amber-600" />,
      description: "Адал азаматтық қасиеттерді қалыптастыруға арналған бағдарлама. Адалдық пен шынайылықты дамытады.",
      activities: ["Адалдық сабақтары", "Сыбайлас жемқорлыққа қарсы тәрбие", "Этика және эстетика", "Рухани құндылықтар"],
      color: "border-amber-200 bg-amber-50",
      pdfUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      {/* Sub-Navigation Menu */}
      <div className="sticky top-[64px] sm:top-[80px] lg:top-[96px] z-30 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-gray-200 dark:border-blue-500/20 shadow-lg transition-all duration-500">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-start md:justify-center space-x-1 py-3 whitespace-nowrap overflow-x-auto scrollbar-hide w-full">
            <button
              onClick={() => document.getElementById('goals')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'goals' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Мектеп тынысының мақсаты
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'goals' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>

            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

            <div className="relative dropdown-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProgramsDropdownOpen(!isProgramsDropdownOpen);
                  document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 flex items-center gap-2 relative group/nav ${
                  (activeSection === 'programs' || activeSection.startsWith('program-')) || isProgramsDropdownOpen
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                }`}
              >
                Тәрбие бағдарламалары
                <ChevronDown className={`w-4 h-4 transition-transform ${isProgramsDropdownOpen ? 'rotate-180 text-blue-500' : ''} ${activeSection === 'programs' ? 'text-blue-500' : ''}`} />
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'programs' || isProgramsDropdownOpen ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
              </button>
              
              <AnimatePresence>
                {isProgramsDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 bg-white dark:bg-[#1e293b] backdrop-blur-2xl border border-gray-200 dark:border-blue-500/30 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden"
                  >
                    <div className="grid gap-0.5">
                      {programs.map((prog, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            const el = document.getElementById(`program-${idx}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            setIsProgramsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-xl transition-all flex items-center gap-3 group/item"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20 group-hover/item:bg-blue-500 group-hover/item:scale-150 transition-all duration-300"></div>
                          {prog.title}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>

            <button
              onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'contacts' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Байланыстар
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'contacts' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>

            <button
              onClick={() => document.getElementById('code')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'code' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Шәкірттердің кодексі
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'code' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>

            <button
              onClick={() => document.getElementById('prevention')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'prevention' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Құқықбұзушылықтың алдын алу
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'prevention' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>

            <button
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-5 py-2.5 text-[13px] font-bold rounded-full transition-all active:scale-95 relative group/nav ${
                activeSection === 'events' 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40" 
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              }`}
            >
              Іс-шаралар
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all ${activeSection === 'events' ? 'w-1/2' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-12 pb-6 sm:pb-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Мектеп <span className="text-blue-500">өмірі</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Біздің мектептің күнделікті өміріне көз жүгіртіңіз
          </p>
        </div>


        {/* Interactive Statistics */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statistics.map((stat, index) => (
              <Card
                key={index}
                className={`${stat.color} dark:bg-[#1e293b] border-2 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                data-testid={`stat-card-${index}`}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${stat.bgColor} dark:opacity-90 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2 dark:text-gray-100">{stat.number}</div>
                  <div className="text-sm font-medium dark:text-gray-300">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Overview */}
        <Card id="goals" className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-gray-700 scroll-mt-24">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-400 flex items-center space-x-2">
              <Target className="w-6 h-6" />
              <span>Мектеп тынысының мақсаты</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              FGS мектебінде тәрбие жұмысы оқушылардың рухани-адамгершілік қасиеттерін қалыптастыруға,
              патриоттық сезімдерін дамытуға және қоғамдық белсенділігін арттыруға бағытталған.
              Біз әрбір баланың жеке дарынын ашып, оларды болашақ өмірге дайындауға ұмтыламыз.
            </p>
          </CardContent>
        </Card>

        {/* Programs */}
        <section id="programs" className="mb-12 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <span>Тәрбие <span className="text-blue-500">бағдарламалары</span></span>
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
                {academicYears.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-6 py-2.5 rounded-xl text-sm md:text-base font-bold transition-all duration-300 ${selectedYear === year
                      ? "bg-blue-600 text-white shadow-xl scale-105"
                      : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {selectedYear === "2026-2027" ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <Clock className="w-16 h-16 text-blue-500/50 mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Жақын арада</h3>
              <p className="text-gray-600 dark:text-gray-400">Бұл бөлім 2026-2027 оқу жылына дайындалуда</p>
            </div>
          ) : (
            <div className="grid gap-6">
            {programs.map((program, index) => (
              <Card key={index} id={`program-${index}`} className={`hover:shadow-lg transition-all duration-300 border-2 ${program.color} dark:bg-[#1e293b] dark:border-gray-700 scroll-mt-24`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {program.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{program.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{program.description}</p>
                      <div className="grid md:grid-cols-2 gap-2 mb-4">
                        {program.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {activity}
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Құжаттар:</h4>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              onClick={() => {
                                setActiveUploadSection(`upbringing-program-${program.title.replace(/\s+/g, '-').toLowerCase()}`);
                                setUploadYear(selectedYear);
                                setIsProgramUploadOpen(true);
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Скан қосу
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <CollapsibleDocList
                            docs={programDocs.filter(doc => 
                              doc.section === `upbringing-program-${program.title.replace(/\s+/g, '-').toLowerCase()}` &&
                              (!doc.academicYear || doc.academicYear === selectedYear)
                            )}
                            updateMutation={updateMutation}
                            scansDeleteMutation={scansDeleteMutation}
                            onEdit={(d) => { setEditingDoc(d); setIsEditDialogOpen(true); }}
                            color={program.color.split('-')[1]}
                          />
                          {/* Single PDF program case */}
                          {programDocs.filter(d => d.section === `upbringing-program-${program.title.replace(/\s+/g, '-').toLowerCase()}`).length === 0 && program.pdfUrl !== "#" && (
                            <DocumentItem
                              doc={{
                                id: `fallback-${program.title.replace(/\s+/g, '-').toLowerCase()}`,
                                title: `${program.title} құжаты`,
                                url: program.pdfUrl,
                                scanUrl: null,
                                section: `upbringing-program-${program.title.replace(/\s+/g, '-').toLowerCase()}`
                              }}
                              updateMutation={updateMutation}
                              scansDeleteMutation={scansDeleteMutation}
                              onEdit={(d) => { setEditingDoc(d); setIsEditDialogOpen(true); }}
                              color={program.color.split('-')[1]}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </section>

        {/* ДосболLike Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-600" />
              <span>ДосболLike бағдарламасы</span>
            </h2>
            {isAdmin && (
              <Button
                size="sm"
                className="bg-pink-600 hover:bg-pink-700 text-white"
                onClick={() => {
                  setActiveUploadSection("upbringing-program-dosbollike");
                  setUploadYear(selectedYear);
                  setIsProgramUploadOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Скан қосу
              </Button>
            )}
          </div>
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-gray-700">
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 italic border-l-4 border-pink-500 pl-4">
                «ДосболLike» — оқушылар арасындағы достық, өзара сыйластық және буллингтің алдын алу бағдарламасы.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Documents will be rendered dynamically below */}
              </div>

                    <CollapsibleDocList
                      docs={programDocs.filter(doc => doc.section === "upbringing-program-dosbollike")}
                      updateMutation={updateMutation}
                      scansDeleteMutation={scansDeleteMutation}
                      onEdit={(d) => { setEditingDoc(d); setIsEditDialogOpen(true); }}
                      color="pink"
                      isCard={true}
                    />
            </CardContent>
          </Card>
        </section>

        {/* Responsible Persons Contacts */}
        <section id="contacts" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center space-x-2">
            <Phone className="w-6 h-6 text-blue-600" />
            <span>Жауапты тұлғалардың байланыстары</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {responsiblePersons.map((person, index) => (
              <Card key={index} className={`${person.color} dark:bg-[#1e293b] border-2 dark:border-gray-700 hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        {person.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{person.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{person.position}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <Phone className="w-4 h-4 mr-2" />
                          <a href={`tel:${person.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                            {person.phone}
                          </a>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <Mail className="w-4 h-4 mr-2" />
                          <a href={`mailto:${person.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                            {person.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>



        {/* Scanned Documents - Admin Only */}
        {isAdmin && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span>Скан нұсқалар</span>
              </h2>
              <Dialog open={isScansUploadOpen} onOpenChange={setIsScansUploadOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                    setUploadYear(selectedYear);
                    setIsScansUploadOpen(true);
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Скан қосу
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] bg-[#1e293b] border border-white/10">
                  <DialogHeader>
                  <DialogTitle className="text-white">Құжатты жүктеу</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Тәрбие жұмысының жоспарлары мен бағдарламаларын жүктеңіз.
                  </DialogDescription>
                </DialogHeader>
                  <form onSubmit={(e) => scansUploadMutation.mutate(e)} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Атауы (міндетті)</Label>
                      <Input
                        id="admin-program-title"
                        name="title"
                        value={scansTitle}
                        onChange={e => setScansTitle(e.target.value)}
                        placeholder="Әзірші атау..."
                        className="bg-[#0d1117] border-white/20 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Файл (PDF немесе сурет)</Label>
                      <Input
                        id="admin-program-file"
                        name="file"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={e => setScansUploadFile(e.target.files?.[0] || null)}
                        required
                        className="bg-[#0d1117] border-white/20 text-white"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={scansUploadMutation.isPending}
                    >
                      {scansUploadMutation.isPending && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
                      Жүктеу
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {scansLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : scansItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p>Скан нұсқалар элі қосылмаған</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scansItems.filter(doc => !doc.academicYear || doc.academicYear === selectedYear).map((doc, index) => (
                  <div
                    key={doc.id}
                    className="group flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 dark:bg-gray-800/50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm text-gray-400 w-6 shrink-0">{index + 1}.</span>
                      <p className="font-medium text-gray-800 dark:text-white truncate">{doc.title}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 px-3 text-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" />
                        Көру
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = doc.url;
                          link.download = doc.title;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10 h-8 px-3 text-xs"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Жүктеу
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Нұсқаны өшіру керек пе?")) scansDeleteMutation.mutate(doc.id);
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Student Code */}
        <section id="code" className="mb-12 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span>Шәкірттердің кодексі</span>
            </h2>
            {isAdmin && (
              <Button
                size="sm"
                variant="outline"
                className="border-green-400 text-green-700 dark:border-green-500 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => {
                  setActiveUploadSection("upbringing-student-code");
                  setUploadYear(selectedYear);
                  setIsProgramUploadOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Скан қосу
              </Button>
            )}
          </div>
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-gray-700">
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 italic border-l-4 border-green-500 pl-4">
                «Мен — өз мектебімнің абыройын ойлайтын, тәртіпті, мәдениетті, жауапты тұлғамын» деген ұстанымын қалыптастыратын құжат.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
                {/* 1. Оқу мәдениеті */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-3 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-green-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span>1. Оқу мәдениеті</span>
                  </h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Сабаққа уақытында келу, кешікпеу</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Үй тапсырмасын орындау</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Мұғалімнің және сыныптастардың сөзін бөлмеу</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Оқу құралдарын ұқыпты сақтау</span>
                    </li>
                  </ul>
                </motion.div>

                {/* 2. Тәртіп пен жауапкершілік */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-3 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-blue-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>2. Тәртіп пен жауапкершілік</span>
                  </h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Мектептің ішкі тәртіп ережесін сақтау</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Өз іс-әрекетіне жауап беру</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Мектеп мүлкіне, жиһазына, құрал-жабдықтарына ұқыпты қарау</span>
                    </li>
                  </ul>
                </motion.div>

                {/* 3. Қарым-қатынас мәдениеті */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-purple-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>3. Қарым-қатынас мәдениеті</span>
                  </h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Үлкендерді сыйлау, сәлем беру, сыпайы сөйлеу</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Достарына көмектесу, әлсіздерді ренжітпеу</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Кикілжің тудырмау, әдепті болу</span>
                    </li>
                  </ul>
                </motion.div>

                {/* 4. Тазалық пен тәртіп сақтау */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-cyan-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center space-x-2">
                    <Star className="w-5 h-5 text-cyan-600" />
                    <span>4. Тазалық пен тәртіп сақтау</span>
                  </h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <span>Мектеп ауласын, сынып бөлмесін таза ұстау</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <span>Қоқысты кез келген жерге тастамау</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <span>Гигиена мен киім кию ережелерін сақтау</span>
                    </li>
                  </ul>
                </motion.div>

                {/* 5. Қауіпсіздік ережелері */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-orange-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span>5. Қауіпсіздік ережелері</span>
                  </h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Жолда жүру ережелерін сақтау</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Электр құралдары мен спорттық жабдықтарды қауіпсіз пайдалану</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>Қауіпсіз интернет пен әлеуметтік желі мәдениетін ұстану</span>
                    </li>
                  </ul>
                </motion.div>

                {/* 6. Отансүйгіштік және адамгершілік қасиеттер */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-3 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-red-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span>6. Отансүйгіштік және адамгершілік</span>
                  </h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Елін, тілін, тарихын құрметтеу</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Мектептің абыройын қорғау</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Қайырымдылық, достық, әділдік, еңбексүйгіштік қасиеттерді дамыту</span>
                    </li>
                  </ul>
                </motion.div>

                {/* 7. Ішкі тәртіп ережесі */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-3 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-indigo-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <span>7. Ішкі тәртіп ережесі</span>
                  </h4>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Мектепке келу уақыты</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Киім кию ережелері</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Сабақ кезіндегі тәртіп</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Мектеп мүлкіне қатысты ережелер</span>
                    </li>
                  </ul>
                  <div className="pt-3 border-t border-indigo-100 dark:border-gray-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">Төмендегі «Қосымша құжаттар» бөлімінен толық ақпаратты көре аласыз.</p>
                  </div>
                </motion.div>
              </div>

              {/* Dynamic Documents for Student Code */}
              {programDocs.filter(doc => doc.section === "upbringing-student-code").length > 0 && (
                <div className="mt-8 pt-6 border-t border-indigo-100 dark:border-gray-700">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 px-1">Қосымша құжаттар:</h4>
                  <CollapsibleDocList
                    docs={programDocs.filter(doc => 
                      doc.section === "upbringing-student-code" &&
                      (!doc.academicYear || doc.academicYear === selectedYear)
                    )}
                    updateMutation={updateMutation}
                    scansDeleteMutation={scansDeleteMutation}
                    onEdit={(d) => { setEditingDoc(d); setIsEditDialogOpen(true); }}
                    color="indigo"
                    isCard={true}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Crime Prevention */}
        <section id="prevention" className="mb-20 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-3 mb-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <span>Құқықбұзушылықтың <span className="text-blue-500">алдын алу</span></span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl">
                Оқушылардың қауіпсіздігі мен құқықтық сауаттылығын арттыруға бағытталған шаралар жүйесі
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
                {academicYears.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-6 py-2.5 rounded-xl text-sm md:text-base font-bold transition-all duration-300 ${selectedYear === year
                      ? "bg-blue-600 text-white shadow-xl scale-105"
                      : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {selectedYear === "2026-2027" ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <Clock className="w-16 h-16 text-blue-500/50 mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Жақын арада</h3>
              <p className="text-gray-600 dark:text-gray-400">Бұл бөлім 2026-2027 оқу жылына дайындалуда</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
            {preventionMeasures.map((pm, idx) => {
              const sectionId = pm.category === "Психологиялық қолдау" ? "crime-prevention-psychological" :
                pm.category === "Әлеуметтік жұмыс" ? "crime-prevention-social" :
                  pm.category === "Құқықтық ағарту" ? "crime-prevention-legal" :
                    "crime-prevention-physical";

              const colorKey = pm.color.split('-')[1]; // Extracts 'blue', 'green', etc.
              const borderStyles: Record<string, string> = {
                blue: "border-blue-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10",
                green: "border-green-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/10",
                purple: "border-purple-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/10",
                orange: "border-orange-200 dark:border-gray-700 bg-orange-50 dark:bg-orange-900/10"
              };

              return (
                <Card key={idx} className={`border-2 ${borderStyles[colorKey]} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold flex items-center space-x-2 ${pm.color} dark:text-gray-100`}>
                        {pm.icon}
                        <span>{pm.category}</span>
                      </h3>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-7 text-xs ${pm.color} dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50`}
                          onClick={() => {
                            setActiveUploadSection(sectionId);
                            setUploadYear(selectedYear);
                            setIsProgramUploadOpen(true);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Скан қосу
                        </Button>
                      )}
                    </div>

                    <ul className="space-y-2 mb-4">
                      {pm.measures.map((measure, mIdx) => (
                        <li key={mIdx} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{measure}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Dynamic Documents */}
                    <CollapsibleDocList
                      docs={programDocs.filter(doc => 
                        doc.section === sectionId &&
                        (!doc.academicYear || doc.academicYear === selectedYear)
                      )}
                      updateMutation={updateMutation}
                      scansDeleteMutation={scansDeleteMutation}
                      onEdit={(d) => { setEditingDoc(d); setIsEditDialogOpen(true); }}
                      color={colorKey}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
          )}
        </section>

        {/* Expanded Annual Events */}
        <section id="events" className="mb-12 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span>Жылдық <span className="text-blue-500">іс-шаралар</span></span>
            </h2>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
                {academicYears.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-6 py-2.5 rounded-xl text-sm md:text-base font-bold transition-all duration-300 ${selectedYear === year
                      ? "bg-blue-600 text-white shadow-xl scale-105"
                      : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              {isAdmin && (
                <Button
                  onClick={() => setIsAddEventDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Іс-шара қосу
                </Button>
              )}
            </div>
          </div>
          
          {selectedYear === "2026-2027" ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 mb-12">
              <Clock className="w-16 h-16 text-blue-500/50 mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Жақын арада</h3>
              <p className="text-gray-600 dark:text-gray-400">Бұл бөлім 2026-2027 оқу жылына дайындалуда</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAllMonths(true)}
                className="text-xs border-blue-200 dark:border-gray-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Барлығын ашу
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAllMonths(false)}
                className="text-xs border-gray-200 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                Жию
              </Button>
            </div>

          <div className="grid gap-4">
            {groupedEvents.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 bg-transparent">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20 text-gray-500" />
                  <p className="text-gray-500 dark:text-gray-400">Бұл оқу жылына іс-шаралар әлі қосылмаған</p>
                </CardContent>
              </Card>
            ) : groupedEvents.map((monthData, index) => (
              <Card key={`${selectedYear}-${monthData.month}`} className="hover:shadow-lg transition-shadow duration-300 dark:bg-[#1e293b] dark:border-gray-700 overflow-hidden border-none shadow-sm">
                <button
                  onClick={() => toggleMonth(monthData.month)}
                  className="w-full text-left bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 px-6 py-4 flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-colors ${expandedMonths.has(monthData.month) ? "bg-blue-600 text-white" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{monthData.month}</span>
                    <span className="text-xs text-gray-400 ml-2">({monthData.events.length} іс-шара)</span>
                  </div>
                  <div className={`transition-transform duration-300 ${expandedMonths.has(monthData.month) ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedMonths.has(monthData.month) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800/50">
                        <div className="grid gap-4 mt-6">
                    {monthData.events.map((event) => (
                      <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</h4>
                                {isAdmin && (
                                  <div className="flex gap-1 shrink-0">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                      onClick={() => {
                                        setEditingEvent(event);
                                        setIsEventEditDialogOpen(true);
                                      }}
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                                      onClick={() => {
                                        if (window.confirm("Бұл іс-шараны өшіруді растайсыз ба?")) {
                                          eventDeleteMutation.mutate(event.id);
                                        }
                                      }}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full ml-3 whitespace-nowrap">
                              {event.date}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs border-purple-300 dark:border-gray-600 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                          >
                            <Camera className="w-3 h-3 mr-1" />
                            Фотогалерея
                            {expandedEvent === event.id ? (
                              <ChevronDown className="w-3 h-3 ml-1" />
                            ) : (
                              <ChevronRight className="w-3 h-3 ml-1" />
                            )}
                          </Button>
                        </div>
                        {expandedEvent === event.id && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                            {isAdmin && (
                              <div className="mb-4">
                                <Button
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                                  onClick={() => {
                                    setActiveEventId(event.id);
                                    setIsGalleryUploadOpen(true);
                                  }}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Сурет қосу
                                </Button>
                              </div>
                            )}
                            {([...(event.photos || []), ...galleryItems.filter(p => p.eventId === event.id).map(p => p.url)]).length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[...(event.photos || []), ...galleryItems.filter(p => p.eventId === event.id).map(p => p.url)].map((photo, photoIdx) => {
                                  const isDynamic = photoIdx >= (event.photos?.length || 0);
                                  const dynamicId = isDynamic ? galleryItems.filter(p => p.eventId === event.id)[photoIdx - (event.photos?.length || 0)].id : null;

                                  return (
                                    <div key={photoIdx} className="relative group">
                                      <img
                                        src={photo}
                                        alt={`${event.title} - фото ${photoIdx + 1}`}
                                        className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                                        onClick={() => setLightboxImage(photo)}
                                      />
                                      {isDynamic && isAdmin && (
                                        <button
                                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm("Өшіруді растайсыз ба?")) galleryDeleteMutation.mutate(dynamicId!);
                                          }}
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Фотосуреттер жақын арада қосылады</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
          </>
          )}
        </section>

        {/* Feedback Form */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <span>Кері байланыс формасы</span>
          </h2>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-400">Пікірлер мен ұсыныстар</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="feedback-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Аты-жөніңіз
                  </label>
                  <input
                    id="feedback-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Толық аты-жөнінізді енгізіңіз"
                    value={feedbackForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
                      setFeedbackForm({ ...feedbackForm, name: capitalized });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Электрондық пошта
                  </label>
                  <input
                    id="feedback-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="feedback-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Тақырып
                  </label>
                  <input
                    id="feedback-subject"
                    name="subject"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Хат тақырыбы"
                    value={feedbackForm.subject}
                    onChange={(e) => {
                      const val = e.target.value;
                      const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
                      setFeedbackForm({ ...feedbackForm, subject: capitalized });
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Хабарлама
                  </label>
                  <textarea
                    id="feedback-message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Пікіріңіз бен ұсыныстарыңызды жазыңыз..."
                    value={feedbackForm.message}
                    onChange={(e) => {
                      const val = e.target.value;
                      const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
                      setFeedbackForm({ ...feedbackForm, message: capitalized });
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <Button 
                    onClick={() => {
                      const message = `Сәлеметсіз бе! Менің атым: ${feedbackForm.name}. Электрондық пошта: ${feedbackForm.email}. Тақырып: ${feedbackForm.subject}. Хабарлама: ${feedbackForm.message}`;
                      const encodedMessage = encodeURIComponent(message);
                      window.open(`https://wa.me/77757906363?text=${encodedMessage}`, '_blank');
                      alert("Хабарламаңыз сәтті жіберілді!");
                      setFeedbackForm({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center space-x-3 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                  >
                    <Send className="w-5 h-5" />
                    <span className="font-bold">WhatsApp арқылы жіберу</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Photo Gallery Upload Dialog */}
        <Dialog open={isGalleryUploadOpen} onOpenChange={setIsGalleryUploadOpen}>
          <DialogContent className="sm:max-w-[400px] bg-[#1e293b] border border-white/10 text-white" aria-describedby={undefined}>
            <DialogTitle className="sr-only">Суретті үлкейту</DialogTitle>
            <DialogHeader>
              <DialogTitle className="text-white">Іс-шара суретін жүктеу</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => galleryUploadMutation.mutate(e)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Сурет таңдау</Label>
                <Input
                  id="gallery-photo-upload"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={e => setGalleryUploadFile(e.target.files?.[0] || null)}
                  className="bg-[#0d1117] border-white/20 text-white cursor-pointer"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
                disabled={galleryUploadMutation.isPending}
              >
                {galleryUploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Жүктелуде...
                  </>
                ) : (
                  "Жүктеу"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Global Program Scan Dialog */}
        <Dialog open={isProgramUploadOpen} onOpenChange={setIsProgramUploadOpen}>
          <DialogContent className="sm:max-w-[400px] bg-[#1e293b] border border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Сқан жүктеу</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => programUploadMutation.mutate(e)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="program-doc-title" className="text-gray-300">Құжат атауы</Label>
                <Input
                  id="program-doc-title"
                  name="title"
                  placeholder="Мәселен: Іс-шара жоспары"
                  value={scansTitle}
                  onChange={e => setScansTitle(e.target.value)}
                  className="bg-[#0d1117] border-white/20 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-doc-file" className="text-gray-300">Файл (PDF/Сурет)</Label>
                <Input
                  id="program-doc-file"
                  name="file"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={e => setScansUploadFile(e.target.files?.[0] || null)}
                  className="bg-[#0d1117] border-white/20 text-white cursor-pointer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Оқу жылы</Label>
                <select
                  className="w-full bg-[#0d1117] border border-white/20 text-white rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  value={uploadYear}
                  onChange={(e) => setUploadYear(e.target.value)}
                >
                  {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                disabled={programUploadMutation.isPending}
              >
                {programUploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Жүктелуде...
                  </>
                ) : (
                  "Жүктеу"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        {/* Edit Document Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[400px] bg-[#1e293b] border border-white/10 text-white">
            <DialogHeader>
            <DialogTitle className="text-white">Құжатты өңдеу</DialogTitle>
            <DialogDescription className="text-gray-400">
              Құжаттың атауы мен сілтемесін өзгертіңіз.
            </DialogDescription>
          </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editingDoc) return;
              updateMutation.mutate({
                id: editingDoc.id,
                data: {
                  title: editingDoc.title,
                  url: editingDoc.url,
                  academicYear: editingDoc.academicYear
                }
              });
              setIsEditDialogOpen(false);
            }} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-doc-title" className="text-gray-300">Құжат атауы</Label>
                <Input
                  id="edit-doc-title"
                  name="title"
                  value={editingDoc?.title || ""}
                  onChange={e => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="bg-[#0d1117] border-white/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-doc-url" className="text-gray-300">Сілтеме (URL)</Label>
                <Input
                  id="edit-doc-url"
                  name="url"
                  value={editingDoc?.url || ""}
                  onChange={e => setEditingDoc({ ...editingDoc, url: e.target.value })}
                  className="bg-[#0d1117] border-white/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Оқу жылы</Label>
                <select
                  className="w-full bg-[#0d1117] border border-white/20 text-white rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  value={editingDoc?.academicYear || "2025-2026"}
                  onChange={(e) => setEditingDoc({ ...editingDoc, academicYear: e.target.value })}
                >
                  {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сақталуда...
                  </>
                ) : (
                  "Сақтау"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>


        {/* Annual Event Edit Dialog */}
        <Dialog open={isEventEditDialogOpen} onOpenChange={setIsEventEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-[#1e293b] border border-white/10 text-white">
            <DialogHeader>
            <DialogTitle className="text-white">Іс-шараны өңдеу</DialogTitle>
            <DialogDescription className="text-gray-400">
              Іс-шараның атауы мен мерзімін өзгертіңіз.
            </DialogDescription>
          </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-title" className="text-gray-300">Тақырыбы</Label>
                <Input
                  id="edit-event-title"
                  name="title"
                  value={editingEvent?.title || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="bg-[#0d1117] border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-date" className="text-gray-300">Күні</Label>
                <Input
                  id="edit-event-date"
                  name="date"
                  value={editingEvent?.dateText || editingEvent?.date || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, dateText: e.target.value })}
                  className="bg-[#0d1117] border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Айы</Label>
                <select
                  id="edit-event-month"
                  name="month"
                  className="w-full bg-[#0d1117] border border-white/20 text-white rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  value={editingEvent?.month || "Тамыз"}
                  onChange={(e) => setEditingEvent({ ...editingEvent, month: e.target.value })}
                >
                  {monthNames.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Сипаттамасы</Label>
                <textarea
                  id="edit-event-description"
                  name="description"
                  className="w-full bg-[#0d1117] border border-white/20 text-white rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px]"
                  value={editingEvent?.description || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Оқу жылы</Label>
                <select
                  id="edit-event-year"
                  name="academicYear"
                  className="w-full bg-[#0d1117] border border-white/20 text-white rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  value={editingEvent?.academicYear || "2025-2026"}
                  onChange={(e) => setEditingEvent({ ...editingEvent, academicYear: e.target.value })}
                >
                  {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => eventUpdateMutation.mutate({
                    id: editingEvent.id,
                    data: {
                      title: editingEvent.title,
                      dateText: editingEvent.dateText || editingEvent.date,
                      month: editingEvent.month,
                      description: editingEvent.description,
                      academicYear: editingEvent.academicYear
                    }
                  })}
                  disabled={eventUpdateMutation.isPending}
                >
                  {eventUpdateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сақтау"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-[#1e293b] text-white border-white/10 hover:bg-white/5"
                  onClick={() => setIsEventEditDialogOpen(false)}
                >
                  Болдырмау
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Annual Event Add Dialog */}
        <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-[#1e293b] border border-white/10 text-white">
            <DialogHeader>
            <DialogTitle className="text-white">Жаңа іс-шара қосу</DialogTitle>
            <DialogDescription className="text-gray-400">
              Күнтізбеге жаңа іс-шара мәліметтерін енгізіңіз.
            </DialogDescription>
          </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="new-event-title" className="text-gray-300">Тақырыбы</Label>
                <Input
                  id="new-event-title"
                  name="title"
                  placeholder="Мәселен: Білім күні"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="bg-[#0d1117] border-white/20 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-event-date" className="text-gray-300">Күні</Label>
                <Input
                  id="new-event-date"
                  name="date"
                  placeholder="Мәселен: 1 қыркүйек"
                  value={newEvent.dateText}
                  onChange={(e) => setNewEvent({ ...newEvent, dateText: e.target.value })}
                  className="bg-[#0d1117] border-white/20 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Айы</Label>
                <select
                  id="new-event-month"
                  name="month"
                  className="w-full bg-[#0d1117] border border-white/20 text-white rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  value={newEvent.month}
                  onChange={(e) => setNewEvent({ ...newEvent, month: e.target.value })}
                >
                  {monthNames.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Сипаттамасы</Label>
                <textarea
                  id="new-event-description"
                  name="description"
                  placeholder="Іс-шара туралы қысқаша мәлімет..."
                  className="w-full bg-[#0d1117] border border-white/20 text-white rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none min-h-[100px] placeholder:text-gray-500"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Оқу жылы</Label>
                <select
                  id="new-event-year"
                  name="academicYear"
                  className="w-full bg-[#0d1117] border border-white/20 text-white rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  value={newEvent.academicYear}
                  onChange={(e) => setNewEvent({ ...newEvent, academicYear: e.target.value })}
                >
                  {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => eventCreateMutation.mutate(newEvent)}
                  disabled={eventCreateMutation.isPending}
                >
                  {eventCreateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Қосу"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-[#1e293b] text-white border-white/10 hover:bg-white/5"
                  onClick={() => setIsAddEventDialogOpen(false)}
                >
                  Болдырмау
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Global Lightbox for galleries */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={lightboxImage || ""}
              alt="Увеличенное фото"
              className="max-w-full max-h-[90vh] rounded-lg object-contain shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
}