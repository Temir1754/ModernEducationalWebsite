import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowLeft, Download, Eye, Loader2, Plus, Trash2, Pencil,
  ChevronRight, ChevronDown, Folder, FolderOpen, FileText
} from "lucide-react";
import SEOHead from "@/components/seo-head";
import type { Document } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

// ─── Folder structure ────────────────────────────────────────────────────────

interface SubFolder {
  id: string;
  label: string;
}

interface CategoryDef {
  id: string;
  label: string;
  /** "simple" = one flat list of docs; "grouped" = sub-folders */
  type: "simple" | "grouped";
  section?: string;        // used when type === "simple"
  subfolders?: SubFolder[]; // used when type === "grouped"
}

const CATEGORIES: CategoryDef[] = [
  {
    id: "founding",
    label: "Құрылтайшылық құжаттар",
    type: "grouped",
    subfolders: [
      { id: "founding-2024", label: "2024-2025" },
      { id: "founding-2025", label: "2025-2026" },
      { id: "founding-2026", label: "2026-2027" },
    ],
  },
  {
    id: "staff-quality",
    label: "Кадр құрамының сапасы",
    type: "grouped",
    subfolders: [
      { id: "staff-2024", label: "2024-2025" },
      { id: "staff-2025", label: "2025-2026" },
      { id: "staff-2026", label: "2026-2027" },
    ],
  },
  {
    id: "contingent",
    label: "Білім алушылардың контингенті",
    type: "grouped",
    subfolders: [
      { id: "contingent-2024", label: "2024-2025" },
      { id: "contingent-2025", label: "2025-2026" },
      { id: "contingent-2026", label: "2026-2027" },
    ],
  },
  {
    id: "curriculum",
    label: "Оқу жоспары",
    type: "grouped",
    subfolders: [
      { id: "curriculum-2024", label: "2024-2025" },
      { id: "curriculum-2025", label: "2025-2026" },
      { id: "curriculum-2026", label: "2026-2027" },
    ],
  },
  {
    id: "upbringing",
    label: "Мектеп тынысы",
    type: "grouped",
    subfolders: [
      { id: "upbringing-2024", label: "2024-2025" },
      { id: "upbringing-2025", label: "2025-2026" },
      { id: "upbringing-2026", label: "2026-2027" },
    ],
  },
  {
    id: "assets",
    label: "Оқу-материалдық активтер",
    type: "grouped",
    subfolders: [
      { id: "assets-2024", label: "2024-2025" },
      { id: "assets-2025", label: "2025-2026" },
      { id: "assets-2026", label: "2026-2027" },
    ],
  },
  {
    id: "safety",
    label: "Білім алушылардың қауіпсіздігі",
    type: "grouped",
    subfolders: [
      { id: "safety-2024", label: "2024-2025" },
      { id: "safety-2025", label: "2025-2026" },
      { id: "safety-2026", label: "2026-2027" },
    ],
  },
  {
    id: "control",
    label: "Мектепшілік бақылау",
    type: "grouped",
    subfolders: [
      { id: "control-2024", label: "2024-2025" },
      { id: "control-2025", label: "2025-2026" },
      { id: "control-2026", label: "2026-2027" },
    ],
  },
];

// Flat list of all sections for the "add document" dropdown
const ALL_SECTIONS: { id: string; label: string }[] = CATEGORIES.flatMap((cat) => {
  if (cat.type === "simple") {
    return [{ id: cat.section!, label: cat.label }];
  }
  return (cat.subfolders ?? []).map((sf) => ({
    id: sf.id,
    label: `${cat.label} › ${sf.label}`,
  }));
});

// ─── Document row ─────────────────────────────────────────────────────────────

function DocRow({
  doc,
  index,
  user,
  updateMutation,
  deleteMutation,
  onEdit,
  toast,
}: {
  doc: Document;
  index: number;
  user: any;
  updateMutation: any;
  deleteMutation: any;
  onEdit: (doc: Document) => void;
  toast: any;
}) {
  const handleView = (url: string) => window.open(url, "_blank");
  const handleDownload = (url: string, title: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 dark:border-transparent hover:bg-white dark:bg-white/5 dark:hover:bg-white/10 transition-all group shadow-sm hover:shadow-md">
      {/* Left: icon + title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{doc.title}</p>
          {doc.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{doc.description}</p>
          )}
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-1 shrink-0 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleView(doc.url)}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-7 px-2 text-xs"
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          Көру
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownload(doc.url, doc.title)}
          className="text-green-400 hover:text-green-300 hover:bg-green-500/10 h-7 px-2 text-xs"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Жүктеу
        </Button>

        {user && (
          <div className="flex items-center gap-1 border-l border-white/10 ml-1 pl-1">
            {/* Upload scan */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 h-7 px-2 text-xs relative overflow-hidden"
            >
              <label className="cursor-pointer flex items-center">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Скан
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const fd = new FormData();
                      fd.append("file", file);
                      const res = await fetch("/api/upload", { method: "POST", body: fd });
                      if (!res.ok) throw new Error("Upload failed");
                      const { url } = await res.json();
                      await updateMutation.mutateAsync({ id: doc.id, data: { scanUrl: url } });
                      toast({ title: "Скан сәтті қосылды" });
                    } catch (err: any) {
                      toast({ title: "Қате", description: err.message, variant: "destructive" });
                    }
                  }}
                />
              </label>
            </Button>

            {doc.scanUrl && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(doc.scanUrl!)}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-7 px-2 text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Скан
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Сканды өшіру керек пе?")) {
                      updateMutation.mutate({ id: doc.id, data: { scanUrl: null } });
                    }
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(doc)}
              className="text-gray-400 hover:text-white hover:bg-white/10 h-7 w-7 p-0"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Құжатты өшіру керек пе?")) deleteMutation.mutate(doc.id);
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-folder (inner accordion) ────────────────────────────────────────────

function SubFolderAccordion({
  subfolder,
  documents,
  user,
  updateMutation,
  deleteMutation,
  onEdit,
  toast,
}: {
  subfolder: SubFolder;
  documents: Document[];
  user: any;
  updateMutation: any;
  deleteMutation: any;
  onEdit: (doc: Document) => void;
  toast: any;
}) {
  const [open, setOpen] = useState(false);
  const docs = documents.filter((d) => d.section === subfolder.id);

  return (
    <div className="ml-4 border-l border-gray-100 dark:border-white/10 pl-3">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 w-full py-2 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
      >
        {open ? (
          <FolderOpen className="w-4 h-4 text-yellow-500 shrink-0" />
        ) : (
          <Folder className="w-4 h-4 text-yellow-500 shrink-0" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1">{subfolder.label}</span>
        <span className="text-xs text-gray-400 mr-1">{docs.length}</span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="mt-1 mb-2 space-y-1.5 pl-1">
          {docs.length === 0 ? (
            <p className="text-xs text-gray-600 px-4 py-2">Құжаттар жоқ</p>
          ) : (
            docs.map((doc, i) => (
              <DocRow
                key={doc.id}
                doc={doc}
                index={i}
                user={user}
                updateMutation={updateMutation}
                deleteMutation={deleteMutation}
                onEdit={onEdit}
                toast={toast}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Top-level category accordion ────────────────────────────────────────────

function CategoryAccordion({
  category,
  documents,
  user,
  updateMutation,
  deleteMutation,
  onEdit,
  toast,
}: {
  category: CategoryDef;
  documents: Document[];
  user: any;
  updateMutation: any;
  deleteMutation: any;
  onEdit: (doc: Document) => void;
  toast: any;
}) {
  const [open, setOpen] = useState(false);

  const docCount =
    category.type === "simple"
      ? documents.filter((d) => d.section === category.section).length
      : (category.subfolders ?? []).reduce(
        (acc, sf) => acc + documents.filter((d) => d.section === sf.id).length,
        0
      );

  const simpleDocs =
    category.type === "simple"
      ? documents.filter((d) => d.section === category.section)
      : [];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#1e293b] shadow-sm">
      {/* Category header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-3 w-full px-5 py-4 transition-colors text-left ${open ? "bg-blue-50 dark:bg-blue-600/20" : "bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/8"
          }`}
      >
        {open ? (
          <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
        ) : (
          <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
        )}
        <span className="font-semibold text-gray-800 dark:text-white flex-1">{category.label}</span>
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
          {docCount}
        </span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />
        )}
      </button>

      {/* Category body */}
      {open && (
        <div className="bg-gray-50/50 dark:bg-[#0d1117] px-3 py-3 space-y-1.5 border-t border-gray-100 dark:border-white/5">
          {category.type === "simple" ? (
            simpleDocs.length === 0 ? (
              <p className="text-sm text-gray-600 px-3 py-3 text-center">Құжаттар жоқ</p>
            ) : (
              simpleDocs.map((doc, i) => (
                <DocRow
                  key={doc.id}
                  doc={doc}
                  index={i}
                  user={user}
                  updateMutation={updateMutation}
                  deleteMutation={deleteMutation}
                  onEdit={onEdit}
                  toast={toast}
                />
              ))
            )
          ) : (
            (category.subfolders ?? []).map((sf) => (
              <SubFolderAccordion
                key={sf.id}
                subfolder={sf}
                documents={documents}
                user={user}
                updateMutation={updateMutation}
                deleteMutation={deleteMutation}
                onEdit={onEdit}
                toast={toast}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SchoolDocumentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const defaultSection = ALL_SECTIONS[0]?.id || "";

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    section: defaultSection,
  });

  // Fetch ALL documents in one request
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    queryFn: async () => {
      const res = await fetch("/api/documents");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!uploadFile) throw new Error("Please select a file");

      const fd = new FormData();
      fd.append("file", uploadFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) throw new Error("File upload failed");
      const { url } = await uploadRes.json();

      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDoc.title,
          description: newDoc.description,
          section: newDoc.section,
          url,
          color: "blue",
          icon: "file",
        }),
      });
      if (!docRes.ok) throw new Error("Failed to save document info");
      return docRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Құжат сәтті жүктелді" });
      setIsUploadOpen(false);
      setNewDoc({ title: "", description: "", section: defaultSection });
      setUploadFile(null);
    },
    onError: (err: Error) =>
      toast({ title: "Қате", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update document");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setIsUploadOpen(false);
      setEditingDocId(null);
      setNewDoc({ title: "", description: "", section: defaultSection });
      toast({ title: "Құжат жаңартылды" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/documents/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Құжат өшірілді" });
    },
  });

  const handleEdit = (doc: Document) => {
    setEditingDocId(doc.id);
    setNewDoc({ title: doc.title, description: doc.description || "", section: doc.section });
    setIsUploadOpen(true);
  };

  return (
    <>
      <SEOHead page="documents" />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">

        {/* ── Header ── */}
        <div className="bg-white dark:bg-[#1e293b] shadow-sm border-b border-gray-200 dark:border-white/10">
          <div className="container mx-auto px-4 py-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Басты бетке оралу
              </Link>

              {user && (
                <Dialog
                  open={isUploadOpen}
                  onOpenChange={(open) => {
                    setIsUploadOpen(open);
                    if (!open) {
                      setEditingDocId(null);
                      setNewDoc({ title: "", description: "", section: defaultSection });
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Құжат қосу
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white">
                        {editingDocId ? "Құжатты өңдеу" : "Жаңа құжат жүктеу"}
                      </DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (editingDocId) {
                          updateMutation.mutate({ id: editingDocId, data: newDoc });
                        } else {
                          uploadMutation.mutate(e);
                        }
                      }}
                      className="space-y-4"
                    >
                      {/* Section selector */}
                      <div className="space-y-2">
                        <Label className="text-gray-300">Бөлім</Label>
                        <select
                          value={newDoc.section}
                          onChange={(e) => setNewDoc({ ...newDoc, section: e.target.value })}
                          className="w-full p-2 border rounded-md bg-[#0d1117] border-white/20 text-white text-sm"
                        >
                          {ALL_SECTIONS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Title */}
                      <div className="space-y-2">
                        <Label className="text-gray-300">Атауы</Label>
                        <Input
                          value={newDoc.title}
                          onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                          required
                          className="bg-[#0d1117] border-white/20 text-white"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label className="text-gray-300">Сипаттамасы</Label>
                        <Textarea
                          value={newDoc.description}
                          onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                          className="bg-[#0d1117] border-white/20 text-white"
                        />
                      </div>

                      {/* File (only on create) */}
                      {!editingDocId && (
                        <div className="space-y-2">
                          <Label className="text-gray-300">Файл</Label>
                          <Input
                            type="file"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            required
                            className="bg-[#0d1117] border-white/20 text-white"
                          />
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={uploadMutation.isPending || updateMutation.isPending}
                      >
                        {(uploadMutation.isPending || updateMutation.isPending) && (
                          <Loader2 className="animate-spin mr-2" />
                        )}
                        {editingDocId ? "Жаңарту" : "Жүктеу"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Мектеп құжаттары</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Мектептің барлық маңызды құжаттарымен танысыңыз
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : (
            <div className="space-y-3">
              {CATEGORIES.map((cat) => (
                <CategoryAccordion
                  key={cat.id}
                  category={cat}
                  documents={documents}
                  user={user}
                  updateMutation={updateMutation}
                  deleteMutation={deleteMutation}
                  onEdit={handleEdit}
                  toast={toast}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
