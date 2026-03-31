import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ArrowLeft, Download, Eye, Loader2, Plus, Trash2, Pencil,
  ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Search, X, Check, FolderPlus
} from "lucide-react";
import SEOHead from "@/components/seo-head";
import type { Document, DocumentFolder } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

// ─── Folder structure ────────────────────────────────────────────────────────

interface SubFolder {
  id: string;
  label: string;
  subfolders?: SubFolder[];
}

interface CategoryDef {
  id: string;
  label: string;
  /** "simple" = one flat list of docs; "grouped" = sub-folders */
  type: "simple" | "grouped";
  section?: string;        // used when type === "simple"
  subfolders?: SubFolder[]; // used when type === "grouped"
}

// Helper to get doc count for a subfolder
function getDocCount(sf: SubFolder, docs: Document[]): number {
  let count = docs.filter((d) => d.section === sf.id).length;
  if (sf.subfolders) {
    count += sf.subfolders.reduce((acc, child) => acc + getDocCount(child, docs), 0);
  }
  return count;
}

// Dynamic categories will be fetched inside the component

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
  const [isDeleting, setIsDeleting] = useState(false);
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
              disabled={isDeleting}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            
            {isDeleting ? (
              <div className="flex items-center gap-1 bg-red-500/10 rounded-md p-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    deleteMutation.mutate(doc.id);
                    setIsDeleting(false);
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-7 w-7 p-0"
                  title="Растау"
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleting(false)}
                  className="text-gray-400 hover:text-gray-300 hover:bg-white/10 h-7 w-7 p-0"
                  title="Болдырмау"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleting(true)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
                title="Өшіру"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
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
  deleteFolderMutation,
  updateFolderMutation,
  onEdit,
  toast,
}: {
  subfolder: SubFolder;
  documents: Document[];
  user: any;
  updateMutation: any;
  deleteMutation: any;
  deleteFolderMutation: any;
  updateFolderMutation: any;
  onEdit: (doc: Document) => void;
  toast: any;
}) {
  const [open, setOpen] = useState(false);
  const docs = documents.filter((d) => d.section === subfolder.id);
  const hasSubfolders = subfolder.subfolders && subfolder.subfolders.length > 0;
  const count = getDocCount(subfolder, documents);

  return (
    <div className="ml-4 border-l border-gray-100 dark:border-white/10 pl-3">
      <div className="flex items-center w-full rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 w-full py-2 px-2 text-left"
        >
          {open ? (
            <FolderOpen className="w-4 h-4 text-yellow-500 shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1">{subfolder.label}</span>
          <span className="text-xs text-gray-400 mr-1">{count}</span>
          {open ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {user && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mr-1 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`"${subfolder.label}" папкасын өшіруге сенімдісіз бе? Ішіндегі мәліметтер жойылуы мүмкін.`)) {
                deleteFolderMutation.mutate(subfolder.id);
              }
            }}
            title="Папканы өшіру"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
        {user && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 mr-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
                title="Папка атауын өзгерту"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111827] border-white/10 text-white" onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Папка атауын өзгерту</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Папканың жаңа атауын енгізіңіз.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor={`folder-name-${subfolder.id}`} className="text-gray-300 mb-2 block">Атауы</Label>
                <Input
                  id={`folder-name-${subfolder.id}`}
                  defaultValue={subfolder.label}
                  className="bg-[#0d1117] border-white/20 text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateFolderMutation.mutate({ id: subfolder.id, name: e.currentTarget.value });
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="ghost">Болдырмау</Button>
                </DialogTrigger>
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.closest('[role="dialog"]')?.querySelector('input');
                    if (input) {
                      updateFolderMutation.mutate({ id: subfolder.id, name: input.value });
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Сақтау
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {open && (
        <div className="mt-1 mb-2 space-y-1.5 pl-1">
          {hasSubfolders && subfolder.subfolders!.map((sf) => (
            <SubFolderAccordion
              key={sf.id}
              subfolder={sf}
              documents={documents}
              user={user}
              updateMutation={updateMutation}
              deleteMutation={deleteMutation}
              deleteFolderMutation={deleteFolderMutation}
              updateFolderMutation={updateFolderMutation}
              onEdit={onEdit}
              toast={toast}
            />
          ))}
          {!hasSubfolders && docs.length === 0 ? (
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
  deleteFolderMutation,
  updateFolderMutation,
  onEdit,
  toast,
}: {
  category: CategoryDef;
  documents: Document[];
  user: any;
  updateMutation: any;
  deleteMutation: any;
  deleteFolderMutation: any;
  updateFolderMutation: any;
  onEdit: (doc: Document) => void;
  toast: any;
}) {
  const [open, setOpen] = useState(false);

  const docCount =
    category.type === "simple"
      ? documents.filter((d) => d.section === category.section).length
      : (category.subfolders ?? []).reduce(
        (acc, sf) => acc + getDocCount(sf, documents),
        0
      );

  const simpleDocs =
    category.type === "simple"
      ? documents.filter((d) => d.section === category.section)
      : [];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#1e293b] shadow-sm">
      {/* Category header */}
      <div className={`flex items-center w-full transition-colors ${open ? "bg-blue-50 dark:bg-blue-600/20" : "bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/8"}`}>
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-3 w-full px-5 py-4 text-left"
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
        {user && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mr-3 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`"${category.label}" папкасын өшіруге сенімдісіз бе? Ішіндегі барлық мәліметтер өшуі мүмкін!`)) {
                deleteFolderMutation.mutate(category.id);
              }
            }}
            title="Папканы өшіру"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
        {user && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 mr-3 shrink-0"
                onClick={(e) => e.stopPropagation()}
                title="Категория атауын өзгерту"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111827] border-white/10 text-white" onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Категория атауын өзгерту</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Категорияның жаңа атауын енгізіңіз.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor={`category-name-${category.id}`} className="text-gray-300 mb-2 block">Атауы</Label>
                <Input
                  id={`category-name-${category.id}`}
                  defaultValue={category.label}
                  className="bg-[#0d1117] border-white/20 text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateFolderMutation.mutate({ id: category.id, name: e.currentTarget.value });
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <DialogTrigger asChild>
                  <Button variant="ghost">Болдырмау</Button>
                </DialogTrigger>
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.closest('[role="dialog"]')?.querySelector('input');
                    if (input) {
                      updateFolderMutation.mutate({ id: category.id, name: input.value });
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Сақтау
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

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
                deleteFolderMutation={deleteFolderMutation}
                updateFolderMutation={updateFolderMutation}
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

// ─── Search Result Section ───────────────────────────────────────────────────

function SearchSection({
  label,
  docs,
  user,
  updateMutation,
  deleteMutation,
  onEdit,
  toast,
}: {
  label: string;
  docs: Document[];
  user: any;
  updateMutation: any;
  deleteMutation: any;
  onEdit: (doc: Document) => void;
  toast: any;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#1e293b] shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-3 w-full px-4 py-3 transition-colors text-left ${
          open ? "bg-blue-50 dark:bg-blue-600/10" : "bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/8"
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          {open ? (
            <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <Folder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
            {label}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider uppercase">
            {docs.length} құжат табылды
          </p>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="bg-gray-50/50 dark:bg-[#0d1117] p-2 space-y-1.5 border-t border-gray-100 dark:border-white/5">
          {docs.map((doc, i) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Nested Section Selector ────────────────────────────────────────────────

function FolderSelection({
  folder,
  selectedId,
  onSelect,
  level = 0,
}: {
  folder: SubFolder;
  selectedId: string;
  onSelect: (id: string, label: string) => void;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = selectedId === folder.id;
  const hasChildren = folder.subfolders && folder.subfolders.length > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 group/row">
        <motion.div
          whileHover={{ x: 2 }}
          className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
            isSelected
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
              : "hover:bg-white/10 text-gray-400 hover:text-white"
          }`}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={() => {
            onSelect(folder.id, folder.label);
          }}
        >
          <div 
            className="shrink-0 w-5 flex items-center justify-center cursor-pointer hover:bg-white/20 rounded"
            onClick={(e) => {
              if (hasChildren) {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }
            }}
          >
            {hasChildren ? (
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-gray-500"}`} />
              </motion.div>
            ) : (
              <div className={`w-2 h-2 rounded-full border ${isSelected ? "bg-white border-white scale-110" : "bg-blue-500/20 border-blue-500/50"}`} />
            )}
          </div>
          <span className={`text-sm tracking-tight flex-1 truncate ${isSelected ? "font-bold" : "font-medium"}`}>
            {folder.label}
          </span>
          {!hasChildren && isSelected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.div>
        
        {hasChildren && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`h-9 px-2 text-[10px] uppercase font-bold tracking-tighter transition-all ${
              isSelected ? "text-blue-400 bg-white/10" : "text-gray-600 hover:text-blue-400 opacity-0 group-hover/row:opacity-100"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(folder.id, folder.label);
            }}
          >
            {isSelected ? "Таңдалды" : "Бұны таңдау"}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-0.5 ml-4 pl-3 border-l-2 border-white/5 space-y-1">
              {folder.subfolders!.map((sf) => (
                <FolderSelection
                  key={sf.id}
                  folder={sf}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  level={level}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NestedSectionSelector({
  selectedId,
  onSelect,
  categories,
  allSections,
}: {
  selectedId: string;
  onSelect: (id: string, label: string) => void;
  categories: CategoryDef[];
  allSections: {id: string, label: string}[];
}) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const selectedSection = allSections.find((s) => s.id === selectedId);
  const breadcrumbs = selectedSection?.label.split(" › ") || [];

  return (
    <div className="space-y-4">
      {/* Premium Breadcrumb Path */}
      <div className="p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 to-transparent backdrop-blur-md shadow-inner">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
          <p className="text-[10px] text-blue-400 uppercase tracking-[0.2em] font-black">Таңдалған бағыт</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 min-h-[1.5rem]">
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className={`px-2 py-1 rounded-md text-xs transition-colors ${
                  idx === breadcrumbs.length - 1 
                    ? "bg-blue-600 text-white font-bold shadow-sm" 
                    : "bg-white/5 text-gray-400 font-medium"
                }`}>
                  {crumb}
                </span>
                {idx < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                )}
              </React.Fragment>
            ))
          ) : (
            <span className="text-xs text-gray-600 italic pl-1">Тізімнен бөлімді таңдаңыз...</span>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar p-1">
        {categories.map((cat) => (
          <div key={cat.id} className="group border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition-all shadow-sm">
            <button
              type="button"
              onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
              className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all ${
                openCategory === cat.id ? "bg-blue-600/10" : ""
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  openCategory === cat.id ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-white/5 text-gray-500 group-hover:text-gray-300"
                }`}>
                  <Folder className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className={`block text-xs font-black truncate uppercase tracking-widest ${
                    openCategory === cat.id ? "text-blue-400" : "text-gray-400 group-hover:text-gray-300"
                  }`}>
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-gray-600 mt-0.5 block">Разделдерді көру</span>
                </div>
              </div>
              <motion.div animate={{ rotate: openCategory === cat.id ? 180 : 0 }}>
                <ChevronDown className={`w-4 h-4 transition-colors ${openCategory === cat.id ? "text-blue-400" : "text-gray-700"}`} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {openCategory === cat.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-[#0a0f1a]/80"
                >
                  <div className="p-3 pb-4 space-y-2 border-t border-white/5 shadow-inner">
                    {cat.type === "simple" ? (
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                          selectedId === cat.section
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                            : "hover:bg-white/10 text-gray-400"
                        }`}
                        onClick={() => onSelect(cat.section!, cat.label)}
                      >
                        <div className={`w-2 h-2 rounded-full border ${selectedId === cat.section ? "bg-white border-white scale-110" : "bg-blue-500/20 border-blue-500/50"}`} />
                        <span className={`text-sm tracking-tight truncate ${selectedId === cat.section ? "font-bold" : "font-medium"}`}>
                          {cat.label}
                        </span>
                        {selectedId === cat.section && <Check className="w-4 h-4 text-white ml-auto" />}
                      </div>
                    ) : (
                      cat.subfolders?.map((sf) => (
                        <FolderSelection
                          key={sf.id}
                          folder={sf}
                          selectedId={selectedId}
                          onSelect={onSelect}
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SchoolDocumentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: dbFolders = [], isLoading: isFoldersLoading } = useQuery<DocumentFolder[]>({
    queryKey: ["/api/folders"],
    queryFn: async () => {
      const res = await fetch("/api/folders");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const categories: CategoryDef[] = React.useMemo(() => {
    const rootFolders = dbFolders.filter((f) => f.isCategory).sort((a,b) => Number(a.order) - Number(b.order));
    const buildSubfolders = (parentId: string): SubFolder[] => {
      return dbFolders
        .filter((f) => f.parentId === parentId)
        .sort((a,b) => Number(a.order) - Number(b.order))
        .map(f => ({
          id: f.id,
          label: f.name,
          subfolders: buildSubfolders(f.id)
        }));
    };

    return rootFolders.map(cat => {
      const subs = buildSubfolders(cat.id);
      return {
        id: cat.id,
        label: cat.name,
        type: subs.length > 0 ? "grouped" : "simple",
        section: subs.length === 0 ? cat.id : undefined,
        subfolders: subs.length > 0 ? subs : undefined,
      };
    });
  }, [dbFolders]);

  const allSections: { id: string; label: string }[] = React.useMemo(() => {
    const flattenSubfolders = (catLabel: string, sfs: SubFolder[]): { id: string; label: string }[] => {
      return sfs.flatMap(sf => {
        const currentLabel = `${catLabel} › ${sf.label}`;
        const rest = sf.subfolders ? flattenSubfolders(currentLabel, sf.subfolders) : [];
        return [{ id: sf.id, label: currentLabel }, ...rest];
      });
    };

    return categories.flatMap((cat) => {
      if (cat.type === "simple") {
        return [{ id: cat.section!, label: cat.label }];
      }
      return [{ id: cat.id, label: cat.label }, ...flattenSubfolders(cat.label, cat.subfolders ?? [])];
    });
  }, [categories]);

  const defaultSection = allSections[0]?.id || "";

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    section: defaultSection,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [newFolder, setNewFolder] = useState({
    name: "",
    subName: "",
    parentId: "null",
    autoCreateYears: false,
  });

  const selectedParent = dbFolders.find(f => f.id === newFolder.parentId);
  const isParentYear = selectedParent && selectedParent.name.match(/20\d\d[\s\-–—]20\d\d/);

  const folderUploadMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload1: any = {
        name: newFolder.name,
        order: "0",
        isCategory: newFolder.parentId === "null"
      };
      if (newFolder.parentId !== "null") {
        payload1.parentId = newFolder.parentId;
      }

      const res1 = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload1)
      });
      if (!res1.ok) {
        throw new Error("Папканы жасау кезінде қате кетті");
      }
      const createdFolder = await res1.json();

      let targetId = createdFolder.id;

      if (newFolder.subName.trim() !== "") {
        const payload2 = {
          name: newFolder.subName.trim(),
          parentId: createdFolder.id,
          order: "0",
          isCategory: false
        };
        const res2 = await fetch("/api/folders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload2)
        });
        if (!res2.ok) throw new Error("Ішкі папканы жасау кезінде қате кетті");
        const createdSubFolder = await res2.json();
        targetId = createdSubFolder.id;
      }

      if (newFolder.autoCreateYears) {
        if (isParentYear) {
          const siblings = dbFolders.filter(f => f.parentId === selectedParent.parentId && f.id !== selectedParent.id);
          for (const sib of siblings) {
            const sibRes = await fetch("/api/folders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: newFolder.name,
                parentId: sib.id,
                order: "0",
                isCategory: false
              })
            });
            if (sibRes.ok && newFolder.subName.trim() !== "") {
              const sibFolder = await sibRes.json();
              await fetch("/api/folders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: newFolder.subName.trim(),
                  parentId: sibFolder.id,
                  order: "0",
                  isCategory: false
                })
              });
            }
          }
        } else {
          const years = ["2024-2025", "2025-2026", "2026-2027"];
          for (let i = 0; i < years.length; i++) {
            await fetch("/api/folders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: years[i],
                parentId: targetId,
                order: String(i),
                isCategory: false
              })
            });
          }
        }
      }

      return createdFolder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      toast({ title: "Папка сәтті қосылды!" });
      setIsFolderOpen(false);
      // Keep parentId so the user can add another folder to the same section easily
      setNewFolder(prev => ({ ...prev, name: "", subName: "", autoCreateYears: false }));
    },
    onError: (err: Error) => toast({ title: "Қате", description: err.message, variant: "destructive" })
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
      if (!uploadRes.ok) {
        const errText = await uploadRes.text().catch(() => "");
        let errMsg = "File upload failed";
        try {
          const errData = JSON.parse(errText);
          if (errData.message) errMsg = errData.message;
        } catch {
          if (errText) errMsg = errText.slice(0, 100);
        }
        throw new Error(errMsg);
      }
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
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || "Өшіру сәтсіз аяқталды");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Құжат өшірілді" });
    },
    onError: (err: Error) =>
      toast({ title: "Қате", description: err.message, variant: "destructive" }),
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/folders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Өшіру сәтсіз аяқталды");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      toast({ title: "Папка өшірілді" });
    },
    onError: (err: Error) =>
      toast({ title: "Қате", description: err.message, variant: "destructive" }),
  });
  
  const updateFolderMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await fetch(`/api/folders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Атауын өзгерту сәтсіз аяқталды");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      toast({ title: "Папка атауы жаңартылды" });
    },
    onError: (err: Error) =>
      toast({ title: "Қате", description: err.message, variant: "destructive" }),
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
              <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                <Link
                  href="/"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 bg-blue-50 dark:bg-[#1e293b] hover:bg-blue-100 dark:hover:bg-slate-700 px-3 py-2 rounded-lg shadow-sm shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Басты бет
                </Link>

                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Құжаттарды іздеу..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-[#0d1117] border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {user && (
                <div className="flex items-center gap-2">
                  <Dialog open={isFolderOpen} onOpenChange={setIsFolderOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/30">
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Папка қосу
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111827] border-white/10 text-white max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
                      <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-bold text-white">
                          Жаңа папка қосу
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Құжаттарды жүйелеу үшін жаңа папка немесе категория жасаңыз.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar space-y-6">
                        <form onSubmit={(e) => folderUploadMutation.mutate(e)} className="space-y-6">
                          {/* Folder Section Selector */}
                          <div className="space-y-3">
                            <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Орналасатын жері</Label>
                            
                            <div
                              onClick={() => setNewFolder({ ...newFolder, parentId: "null" })}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border ${
                                newFolder.parentId === "null"
                                  ? "bg-blue-600/20 border-blue-500/50"
                                  : "bg-white/5 border-white/10 hover:bg-white/10"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                newFolder.parentId === "null" ? "border-blue-400" : "border-gray-500"
                              }`}>
                                {newFolder.parentId === "null" && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                              </div>
                              <span className={`text-sm font-medium ${newFolder.parentId === "null" ? "text-blue-400" : "text-gray-300"}`}>
                                Негізгі бөлім (Жаңа категория)
                              </span>
                            </div>

                            <div className="pt-2">
                              <NestedSectionSelector
                                selectedId={newFolder.parentId !== "null" ? newFolder.parentId : ""}
                                onSelect={(id) => setNewFolder({ ...newFolder, parentId: id })}
                                categories={categories}
                                allSections={allSections}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300">Папка атауы</Label>
                            <Input
                              value={newFolder.name}
                              onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                              required
                              className="bg-[#0d1117] border-white/20 text-white h-11"
                              placeholder="Атауын енгізіңіз..."
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-300">Ішкі папка атауы (Міндетті емес)</Label>
                            <Input
                              value={newFolder.subName}
                              onChange={(e) => setNewFolder({ ...newFolder, subName: e.target.value })}
                              className="bg-[#0d1117] border-white/20 text-white h-11"
                              placeholder="Егер ішкі папка қосқыңыз келсе жазыңыз..."
                            />
                          </div>
                          
                          <div className="flex items-center gap-3 mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <input 
                              type="checkbox" 
                              id="autoCreateYears" 
                              checked={newFolder.autoCreateYears}
                              onChange={(e) => setNewFolder(f => ({ ...f, autoCreateYears: e.target.checked }))}
                              className="w-5 h-5 rounded border-blue-500/30 text-blue-600 focus:ring-blue-500/50 bg-[#0d1117]"
                            />
                            <Label htmlFor="autoCreateYears" className="text-sm font-medium text-blue-100 cursor-pointer flex-1">
                              {isParentYear 
                                ? "Басқа оқу жылдарында да дәл осы папканы жасау (Дубликат)" 
                                : "Оқу жылдарын автоматты түрде қосу (2024-2027)"}
                            </Label>
                          </div>

                          <div className="pt-2 sticky bottom-0 bg-[#111827] pb-2">
                            <Button
                              type="submit"
                              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/20"
                              disabled={folderUploadMutation.isPending}
                            >
                              {folderUploadMutation.isPending && <Loader2 className="animate-spin mr-2" />}
                              Сақтау
                            </Button>
                          </div>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>

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
                  <DialogContent className="bg-[#111827] border-white/10 text-white max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <DialogHeader className="p-6 pb-2">
                      <DialogTitle className="text-xl font-bold text-white">
                        {editingDocId ? "Құжатты өңдеу" : "Жаңа құжат жүктеу"}
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        {editingDocId ? "Құжат мәліметтерін өзгертіңіз." : "Керекті бөлімді таңдап, құжат файлын жүктеңіз."}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar space-y-6">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (editingDocId) {
                            updateMutation.mutate({ id: editingDocId, data: newDoc });
                          } else {
                            uploadMutation.mutate(e);
                          }
                        }}
                        className="space-y-6"
                      >
                        {/* Combined Section Selector */}
                        <div className="space-y-3">
                          <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Бөлім таңдау</Label>
                          <NestedSectionSelector
                            selectedId={newDoc.section}
                            onSelect={(id) => setNewDoc({ ...newDoc, section: id })}
                            categories={categories}
                            allSections={allSections}
                          />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                          <Label className="text-gray-300">Атауы</Label>
                          <Input
                            value={newDoc.title}
                            onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                            required
                            className="bg-[#0d1117] border-white/20 text-white h-11"
                            placeholder="Құжат атауын енгізіңіз..."
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label className="text-gray-300">Сипаттамасы</Label>
                          <Textarea
                            value={newDoc.description}
                            onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                            className="bg-[#0d1117] border-white/20 text-white min-h-[100px]"
                            placeholder="Қосымша мәліметтер (міндетті емес)..."
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
                              className="bg-[#0d1117] border-white/20 text-white h-11 py-2"
                            />
                          </div>
                        )}

                        <div className="pt-2 sticky bottom-0 bg-[#111827] pb-2">
                          <Button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-900/20"
                            disabled={uploadMutation.isPending || updateMutation.isPending}
                          >
                            {(uploadMutation.isPending || updateMutation.isPending) && (
                              <Loader2 className="animate-spin mr-2" />
                            )}
                            {editingDocId ? "Жаңарту" : "Жүктеу"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
                </div>
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
          ) : searchTerm ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Іздеу нәтижелері: {searchTerm}
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                  Табылды: {
                    documents.filter(d =>
                      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      d.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length
                  }
                </span>
              </div>

              <div className="space-y-4">
                {(() => {
                  const filtered = documents.filter(d =>
                    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    d.description?.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  
                  // Group by section
                  const groups: Record<string, Document[]> = {};
                  filtered.forEach(d => {
                    if (!groups[d.section]) groups[d.section] = [];
                    groups[d.section].push(d);
                  });

                  const sectionIds = Object.keys(groups);
                  if (sectionIds.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Сұраныс бойынша ештеңе табылмады</p>
                      </div>
                    );
                  }

                  return sectionIds.map(sid => {
                    const section = allSections.find(s => s.id === sid);
                    return (
                      <SearchSection
                        key={sid}
                        label={section?.label || sid}
                        docs={groups[sid]}
                        user={user}
                        updateMutation={updateMutation}
                        deleteMutation={deleteMutation}
                        onEdit={handleEdit}
                        toast={toast}
                      />
                    );
                  });
                })()}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <CategoryAccordion
                  key={cat.id}
                  category={cat}
                  documents={documents}
                  user={user}
                  updateMutation={updateMutation}
                  deleteMutation={deleteMutation}
                  deleteFolderMutation={deleteFolderMutation}
                  updateFolderMutation={updateFolderMutation}
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
