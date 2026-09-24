import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, Pencil, Search, X, FolderPlus } from "lucide-react";
import SEOHead from "@/components/seo-head";
import type { Document, DocumentFolder } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import PageHeader from "@/components/page-header";

// ─── API helper ──────────────────────────────────────────────────────────────

async function api(method: string, url: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Қате кетті");
  }
  return res.json();
}

function refresh() {
  queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
  queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
}

// ─── Table model ─────────────────────────────────────────────────────────────

const DEFAULT_YEARS = ["2024-2025", "2025-2026", "2026-2027"];
const YEAR_RE = /20\d\d\s*[-–—]\s*20\d\d/;

/** One row of the table. Folders with the same name in different years are merged. */
interface RowNode {
  key: string;
  name: string;
  parent?: RowNode;
  children: RowNode[];
  /** year -> folder id (undefined when that year has no such folder yet) */
  folders: Record<string, string | undefined>;
}

interface Category {
  folder: DocumentFolder;
  years: { year: string; folderId: string }[];
  rows: RowNode[];
}

function byOrder(a: DocumentFolder, b: DocumentFolder) {
  return (Number(a.order) || 0) - (Number(b.order) || 0);
}

function buildRows(
  parents: { year: string; folderId: string }[],
  allFolders: DocumentFolder[],
  parentNode: RowNode | undefined,
  keyPrefix: string,
): RowNode[] {
  const kidsPerYear = parents.map((p) => ({
    year: p.year,
    kids: allFolders.filter((f) => f.parentId === p.folderId).sort(byOrder),
  }));
  const nonEmpty = kidsPerYear.filter((k) => k.kids.length > 0);
  if (nonEmpty.length === 0) return [];

  // Same number of rows in every year → match by position (tolerates renamed rows);
  // otherwise match by name.
  const byPosition = nonEmpty.every((k) => k.kids.length === nonEmpty[0].kids.length);
  const nodes: RowNode[] = [];
  const slotOf = new Map<string, RowNode>();

  for (const { year, kids } of kidsPerYear) {
    kids.forEach((kid, i) => {
      const slot = byPosition ? `#${i}` : kid.name.trim().toLowerCase();
      let node = slotOf.get(slot);
      if (!node) {
        node = { key: `${keyPrefix}/${slot}`, name: kid.name, parent: parentNode, children: [], folders: {} };
        slotOf.set(slot, node);
        nodes.push(node);
      }
      node.folders[year] = kid.id;
    });
  }
  for (const node of nodes) {
    const sub = Object.entries(node.folders)
      .filter(([, id]) => !!id)
      .map(([year, folderId]) => ({ year, folderId: folderId! }));
    node.children = buildRows(sub, allFolders, node, node.key);
  }
  return nodes;
}

function buildCategories(folders: DocumentFolder[]): Category[] {
  return folders
    .filter((f) => f.isCategory)
    .sort(byOrder)
    .map((cat) => {
      const yearFolders = folders
        .filter((f) => f.parentId === cat.id && YEAR_RE.test(f.name))
        .sort((a, b) => a.name.localeCompare(b.name));
      const years = yearFolders.length > 0
        ? yearFolders.map((f) => ({ year: f.name.trim(), folderId: f.id }))
        : DEFAULT_YEARS.map((year) => ({ year, folderId: "" }));
      let rows = buildRows(years.filter((y) => y.folderId), folders, undefined, cat.id);
      if (rows.length === 0) {
        // Section without rows: a single row whose cells are the year folders themselves
        const folderMap: Record<string, string> = {};
        years.forEach((y) => { if (y.folderId) folderMap[y.year] = y.folderId; });
        rows = [{ key: `${cat.id}/self`, name: "Құжаттар", children: [], folders: folderMap }];
      }
      return { folder: cat, years, rows };
    });
}

function filterRows(rows: RowNode[], q: string): RowNode[] {
  if (!q) return rows;
  const out: RowNode[] = [];
  for (const r of rows) {
    if (r.name.toLowerCase().includes(q)) out.push(r);
    else {
      const sub = filterRows(r.children, q);
      if (sub.length) out.push({ ...r, children: sub });
    }
  }
  return out;
}

// ─── Small dialogs ───────────────────────────────────────────────────────────

function TextDialog({
  open, title, description, label, initial, submitLabel, pending, onClose, onSubmit,
}: {
  open: boolean;
  title: string;
  description?: string;
  label: string;
  initial: string;
  submitLabel: string;
  pending: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  React.useEffect(() => { if (open) setValue(initial); }, [open, initial]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-white text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-black">{title}</DialogTitle>
          {description && <DialogDescription className="text-gray-600">{description}</DialogDescription>}
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); if (value.trim()) onSubmit(value.trim()); }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="text-dialog-input" className="text-black">{label}</Label>
            <Input id="text-dialog-input" value={value} onChange={(e) => setValue(e.target.value)} required autoFocus className="bg-white text-black border-gray-300" />
          </div>
          <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {pending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{submitLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LinkDialog({
  open, rowName, year, initialUrl, pending, onClose, onSubmit,
}: {
  open: boolean;
  rowName: string;
  year: string;
  initialUrl: string;
  pending: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}) {
  const [url, setUrl] = useState(initialUrl);
  React.useEffect(() => { if (open) setUrl(initialUrl); }, [open, initialUrl]);
  const valid = /^https?:\/\/\S+$/i.test(url.trim());
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-white text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-black">Құжат сілтемесі</DialogTitle>
          <DialogDescription className="text-gray-600">{rowName} — {year}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(url.trim()); }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="link-dialog-input" className="text-black">Google Drive сілтемесі</Label>
            <Input id="link-dialog-input" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://drive.google.com/..." required autoFocus className="bg-white text-black border-gray-300" />
            <p className="text-xs text-gray-600">Google Drive-та файлға «Сілтемесі бар барлық адам» рұқсатын беріп, сілтемені осында қойыңыз.</p>
          </div>
          <Button type="submit" disabled={pending || !valid} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {pending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Сақтау
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

type TextAction =
  | { kind: "newCategory" }
  | { kind: "renameCategory"; cat: Category }
  | { kind: "addRow"; cat: Category; parent?: RowNode }
  | { kind: "renameRow"; cat: Category; row: RowNode };

type LinkAction = { cat: Category; row: RowNode; year: string; doc?: Document };

const CELL = "border border-gray-500 px-3 py-2 align-middle";
const YEAR_CELL = `${CELL} text-center`;
/** Yellow-to-green header of the table */
const HEAD_STYLE: React.CSSProperties = { backgroundImage: "linear-gradient(to bottom, #f3ef5a, #bfd03a)" };

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
const roman = (n: number) => ROMAN[n - 1] ?? String(n);

export default function SchoolDocumentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = !!user;
  const [searchTerm, setSearchTerm] = useState("");
  const [textAction, setTextAction] = useState<TextAction | null>(null);
  const [linkAction, setLinkAction] = useState<LinkAction | null>(null);

  const { data: folders = [], isLoading: foldersLoading } = useQuery<DocumentFolder[]>({
    queryKey: ["/api/folders"],
    queryFn: async () => {
      const res = await fetch("/api/folders");
      return res.ok ? res.json() : [];
    },
  });
  const { data: documents = [], isLoading: docsLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    queryFn: async () => {
      const res = await fetch("/api/documents");
      return res.ok ? res.json() : [];
    },
  });

  const categories = useMemo(() => buildCategories(folders), [folders]);
  const docsByFolder = useMemo(() => {
    const m = new Map<string, Document[]>();
    documents.forEach((d) => {
      // Only external links (Google Drive etc.) are shown; files uploaded earlier (/attached_assets/…) are hidden.
      if (!/^https?:\/\//i.test(d.url)) return;
      const list = m.get(d.section) ?? [];
      list.push(d);
      m.set(d.section, list);
    });
    return m;
  }, [documents]);

  const onError = (err: Error) => toast({ title: "Қате", description: err.message, variant: "destructive" });

  /** Makes sure the year folder of a section exists, creating it when missing. */
  const ensureYear = async (cat: Category, year: string): Promise<string> => {
    let y = cat.years.find((c) => c.year === year);
    if (!y) { y = { year, folderId: "" }; cat.years.push(y); }
    if (y.folderId) return y.folderId;
    const created = await api("POST", "/api/folders", {
      name: year, parentId: cat.folder.id, order: String(cat.years.indexOf(y)), isCategory: false,
    });
    y.folderId = created.id;
    return created.id;
  };

  /** Makes sure the folder for `row` exists in `year`, creating missing parents. */
  const ensureFolder = async (cat: Category, row: RowNode, year: string): Promise<string> => {
    const existing = row.folders[year];
    if (existing) return existing;
    if (row.key.endsWith("/self")) {
      const yearId = await ensureYear(cat, year);
      row.folders[year] = yearId;
      return yearId;
    }
    const parentId = row.parent
      ? await ensureFolder(cat, row.parent, year)
      : await ensureYear(cat, year);
    const created = await api("POST", "/api/folders", { name: row.name, parentId, order: "0", isCategory: false });
    row.folders[year] = created.id;
    return created.id;
  };

  const saveLink = useMutation({
    mutationFn: async ({ action, url }: { action: LinkAction; url: string }) => {
      if (action.doc) return api("PATCH", `/api/documents/${action.doc.id}`, { url });
      const section = await ensureFolder(action.cat, action.row, action.year);
      return api("POST", "/api/documents", {
        title: action.row.name, section, url, color: "blue", icon: "file",
      });
    },
    onSuccess: () => { refresh(); setLinkAction(null); toast({ title: "Сілтеме сақталды" }); },
    onError,
  });

  const deleteLink = useMutation({
    mutationFn: (id: string) => api("DELETE", `/api/documents/${id}`),
    onSuccess: () => { refresh(); toast({ title: "Сілтеме жойылды" }); },
    onError,
  });

  const textMutation = useMutation({
    mutationFn: async ({ action, value }: { action: TextAction; value: string }) => {
      switch (action.kind) {
        case "newCategory": {
          const order = categories.reduce((max, c) => Math.max(max, Number(c.folder.order) || 0), -1) + 1;
          const cat = await api("POST", "/api/folders", { name: value, order: String(order), isCategory: true });
          for (let i = 0; i < DEFAULT_YEARS.length; i++) {
            await api("POST", "/api/folders", { name: DEFAULT_YEARS[i], parentId: cat.id, order: String(i), isCategory: false });
          }
          return;
        }
        case "renameCategory":
          await api("PATCH", `/api/folders/${action.cat.folder.id}`, { name: value });
          return;
        case "addRow": {
          for (const y of action.cat.years) {
            const parentId = action.parent ? action.parent.folders[y.year] : await ensureYear(action.cat, y.year);
            if (!parentId) continue;
            await api("POST", "/api/folders", { name: value, parentId, order: "0", isCategory: false });
          }
          return;
        }
        case "renameRow":
          for (const id of Object.values(action.row.folders)) {
            if (id) await api("PATCH", `/api/folders/${id}`, { name: value });
          }
          return;
      }
    },
    onSuccess: () => { refresh(); setTextAction(null); toast({ title: "Сақталды" }); },
    onError,
  });

  const deleteFolders = useMutation({
    mutationFn: async (ids: string[]) => { for (const id of ids) await api("DELETE", `/api/folders/${id}`); },
    onSuccess: () => { refresh(); toast({ title: "Жойылды" }); },
    onError,
  });

  const q = searchTerm.trim().toLowerCase();
  const visible = categories
    .map((cat, index) => ({ cat, index, rows: filterRows(cat.rows, q) }))
    .filter(({ cat, rows }) => rows.length > 0 || (!q && isAdmin) || (q && cat.folder.name.toLowerCase().includes(q)));

  const iconBtn = "p-1 rounded hover:bg-black/10 text-black transition-colors";
  const bandBtn = "p-1 rounded hover:bg-white/20 text-white transition-colors";
  const columns = Array.from(new Set([...DEFAULT_YEARS, ...categories.flatMap((c) => c.years.map((y) => y.year))])).sort();

  const renderLinkCell = (cat: Category, row: RowNode, year: string) => {
    const folderId = row.folders[year];
    const docs = folderId ? docsByFolder.get(folderId) ?? [] : [];
    return (
      <td key={year} className={`${YEAR_CELL} text-base`}>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {docs.map((d, i) => (
            <span key={d.id} className="inline-flex items-center gap-1">
              <a href={d.url} target="_blank" rel="noopener noreferrer" title={d.title} className="font-bold text-blue-800 underline underline-offset-2 visited:text-purple-800 hover:text-blue-600">
                құжат{docs.length > 1 ? ` ${i + 1}` : ""}
              </a>
              {isAdmin && (
                <>
                  <button className={iconBtn} title="Сілтемені өзгерту" onClick={() => setLinkAction({ cat, row, year, doc: d })}><Pencil className="w-3.5 h-3.5" /></button>
                  <button className={iconBtn} title="Жою" onClick={() => { if (window.confirm("Сілтемені жоясыз ба?")) deleteLink.mutate(d.id); }}><Trash2 className="w-3.5 h-3.5 text-red-600" /></button>
                </>
              )}
            </span>
          ))}
          {isAdmin && docs.length === 0 && (
            <button className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline" onClick={() => setLinkAction({ cat, row, year })}>
              <Plus className="w-3.5 h-3.5" />сілтеме
            </button>
          )}
        </div>
      </td>
    );
  };

  const renderRows = (cat: Category, rows: RowNode[], depth: number): React.ReactNode =>
    rows.map((row) => {
      const isGroup = row.children.length > 0;
      const rowFolderIds = Object.values(row.folders).filter(Boolean) as string[];
      return (
        <React.Fragment key={row.key}>
          <tr className="bg-white">
            <td className={`${CELL} text-lg leading-snug ${isGroup ? "font-semibold" : ""}`} style={{ paddingLeft: `${12 + depth * 20}px` }}>
              <div className="flex items-start justify-between gap-2">
                <span>{row.name}</span>
                {isAdmin && row.key !== `${cat.folder.id}/self` && (
                  <span className="flex shrink-0 items-center">
                    {isGroup && <button className={iconBtn} title="Ішкі жол қосу" onClick={() => setTextAction({ kind: "addRow", cat, parent: row })}><Plus className="w-3.5 h-3.5" /></button>}
                    <button className={iconBtn} title="Атауын өзгерту" onClick={() => setTextAction({ kind: "renameRow", cat, row })}><Pencil className="w-3.5 h-3.5" /></button>
                    <button className={iconBtn} title="Жою" onClick={() => { if (window.confirm(`«${row.name}» жолын барлық жылдарымен жоясыз ба?`)) deleteFolders.mutate(rowFolderIds); }}><Trash2 className="w-3.5 h-3.5 text-red-600" /></button>
                  </span>
                )}
              </div>
            </td>
            {columns.map((y) => (isGroup ? <td key={y} className={YEAR_CELL} /> : renderLinkCell(cat, row, y)))}
          </tr>
          {isGroup && renderRows(cat, row.children, depth + 1)}
        </React.Fragment>
      );
    });

  const textDialogProps = (() => {
    const a = textAction;
    if (!a) return { title: "", label: "", initial: "", submitLabel: "" };
    switch (a.kind) {
      case "newCategory": return { title: "Жаңа бөлім", description: "Бөлім 2024-2027 оқу жылдарымен бірге жасалады.", label: "Бөлім атауы", initial: "", submitLabel: "Қосу" };
      case "renameCategory": return { title: "Бөлім атауын өзгерту", label: "Атауы", initial: a.cat.folder.name, submitLabel: "Сақтау" };
      case "addRow": return { title: a.parent ? `Ішкі жол: ${a.parent.name}` : "Жаңа жол", description: "Жол барлық оқу жылдарына қосылады.", label: "Құжат атауы", initial: "", submitLabel: "Қосу" };
      case "renameRow": return { title: "Жол атауын өзгерту", description: "Барлық оқу жылдарында өзгереді.", label: "Атауы", initial: a.row.name, submitLabel: "Сақтау" };
    }
  })();

  const isLoading = foldersLoading || docsLoading;

  return (
    <>
      <SEOHead page="documents" />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <PageHeader title="Мемлекеттік аттестация" subtitle="Мектептің барлық маңызды құжаттарымен танысыңыз" className="mb-10 mt-4" />

          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[240px] max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <Input
                id="document-search" name="searchTerm" placeholder="Құжаттарды іздеу..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-11 bg-white text-black border-gray-300"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} aria-label="Іздеуді тазалау" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {isAdmin && (
              <Button size="sm" variant="outline" className="border-gray-300 text-black" onClick={() => setTextAction({ kind: "newCategory" })}>
                <FolderPlus className="w-4 h-4 mr-2" />Бөлім қосу
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : visible.length === 0 ? (
            <p className="text-center text-gray-600 py-12">{q ? "Сұраныс бойынша ештеңе табылмады" : "Құжаттар әлі қосылмаған"}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-black">
                <colgroup>
                  <col style={{ width: "46%" }} />
                  {columns.map((c) => <col key={c} />)}
                </colgroup>
                <thead>
                  <tr>
                    <th rowSpan={2} className={`${CELL} text-center text-lg font-bold`} style={HEAD_STYLE}>Құжаттың атауы</th>
                    <th colSpan={columns.length} className={`${CELL} text-center text-lg font-bold`} style={HEAD_STYLE}>Құжатты қарау</th>
                  </tr>
                  <tr>
                    {columns.map((c) => <th key={c} className={`${CELL} text-center text-base font-bold`} style={HEAD_STYLE}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {visible.map(({ cat, index, rows }) => (
                    <React.Fragment key={cat.folder.id}>
                      <tr className="bg-[#3f7d33]">
                        <td colSpan={1 + columns.length} className="border border-gray-500 px-3 py-2 text-white">
                          <div className="relative flex items-center justify-center">
                            <span className="text-center text-lg font-bold uppercase">{roman(index + 1)}. {cat.folder.name}</span>
                            {isAdmin && (
                              <span className="absolute right-0 flex items-center">
                                <button className={bandBtn} title="Жол қосу" onClick={() => setTextAction({ kind: "addRow", cat })}><Plus className="w-4 h-4" /></button>
                                <button className={bandBtn} title="Атауын өзгерту" onClick={() => setTextAction({ kind: "renameCategory", cat })}><Pencil className="w-4 h-4" /></button>
                                <button className={bandBtn} title="Бөлімді жою" onClick={() => { if (window.confirm(`«${cat.folder.name}» бөлімін толығымен жоясыз ба?`)) deleteFolders.mutate([cat.folder.id]); }}><Trash2 className="w-4 h-4 text-red-200" /></button>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {renderRows(cat, rows, 0)}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <TextDialog
        open={!!textAction}
        {...textDialogProps}
        pending={textMutation.isPending}
        onClose={() => setTextAction(null)}
        onSubmit={(value) => textAction && textMutation.mutate({ action: textAction, value })}
      />
      <LinkDialog
        open={!!linkAction}
        rowName={linkAction?.row.name ?? ""}
        year={linkAction?.year ?? ""}
        initialUrl={linkAction?.doc?.url ?? ""}
        pending={saveLink.isPending}
        onClose={() => setLinkAction(null)}
        onSubmit={(url) => linkAction && saveLink.mutate({ action: linkAction, url })}
      />
    </>
  );
}
