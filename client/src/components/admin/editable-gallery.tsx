import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Pencil, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { saveContent, uploadImage } from "@/components/admin/photo-slots";

export interface GalleryItem {
  image: string;
  caption: string;
}

/**
 * Photo grid with captions that an admin can add to, edit, reorder and delete.
 * Stored as a JSON array under `contentKey`; `defaultCaptions` seed empty slots until the first save.
 */
export default function EditableGallery({ contentKey, defaultCaptions }: { contentKey: string; defaultCaptions: string[] }) {
  // Edit controls are admin-only; inspectors get a read-only view.
  const { isAdmin, user: authUser } = useAuth();
  const user = isAdmin ? authUser : null;
  const { toast } = useToast();
  const [editing, setEditing] = useState<{ index: number; draft: GalleryItem } | null>(null);
  const [uploading, setUploading] = useState(false);
  const idBase = contentKey.replace(/\./g, "-");

  const { data: record } = useQuery<any>({
    queryKey: ["/api/content", contentKey],
    queryFn: async () => {
      const res = await fetch(`/api/content?key=${contentKey}&lang=kz`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    },
  });

  const items: GalleryItem[] = useMemo(() => {
    if (record?.value) {
      try {
        const parsed = JSON.parse(record.value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* fall back to the default slots */
      }
    }
    return defaultCaptions.map((caption) => ({ image: "", caption }));
  }, [record, defaultCaptions]);

  const save = useMutation({
    mutationFn: (list: GalleryItem[]) => saveContent(contentKey, JSON.stringify(list), "json"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setEditing(null);
      toast({ title: "Сақталды" });
    },
    onError: (err: Error) => toast({ title: "Қате", description: err.message, variant: "destructive" }),
  });

  const move = (index: number, dir: -1 | 1) => {
    const to = index + dir;
    if (to < 0 || to >= items.length) return;
    const list = [...items];
    [list[index], list[to]] = [list[to], list[index]];
    save.mutate(list);
  };

  const remove = (index: number) => {
    if (!window.confirm("Бұл суретті өшіресіз бе?")) return;
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

  if (items.length === 0 && !user) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-6 lg:grid-cols-3">
        {items.map((item, index) => (
          <figure key={index} className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-md dark:bg-gray-800">
              {item.image ? (
                <img src={item.image} alt={item.caption} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}
            </div>
            {item.caption && (
              <figcaption className="mt-2 text-sm font-bold text-[#2A4A46] dark:text-gray-100 sm:mt-3 sm:text-base">{item.caption}</figcaption>
            )}
            {user && (
              <div className="absolute right-2 top-2 z-10 flex gap-1.5">
                <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white" title="Солға" disabled={index === 0 || save.isPending} onClick={() => move(index, -1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white" title="Оңға" disabled={index === items.length - 1 || save.isPending} onClick={() => move(index, 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white text-blue-600" title="Өңдеу" onClick={() => setEditing({ index, draft: item })}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="outline" className="h-7 w-7 rounded-full bg-white text-red-600" title="Өшіру" onClick={() => remove(index)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </figure>
        ))}

        {user && (
          <button
            type="button"
            onClick={() => setEditing({ index: -1, draft: { image: "", caption: "" } })}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600"
          >
            <Plus className="h-8 w-8" />
            <span className="text-sm font-semibold">Сурет қосу</span>
          </button>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black">{editing?.index === -1 ? "Жаңа сурет" : "Суретті өңдеу"}</DialogTitle>
            <DialogDescription className="text-gray-600">Сурет жүктеп, астына жазу қосыңыз.</DialogDescription>
          </DialogHeader>
          {editing && (
            <form onSubmit={submitEditor} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  {editing.draft.image ? (
                    <img src={editing.draft.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${idBase}-photo`} className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-black hover:bg-gray-50">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Сурет жүктеу
                  </Label>
                  <input
                    id={`${idBase}-photo`}
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
                    <button
                      type="button"
                      className="block text-xs text-red-600 hover:underline"
                      onClick={() => setEditing({ ...editing, draft: { ...editing.draft, image: "" } })}
                    >
                      Суретті өшіру
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${idBase}-caption`} className="text-black">Жазуы</Label>
                <Input
                  id={`${idBase}-caption`}
                  value={editing.draft.caption}
                  onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, caption: e.target.value } })}
                  className="border-gray-300 bg-white text-black"
                />
              </div>
              <Button type="submit" disabled={save.isPending || uploading} className="w-full bg-blue-600 text-white hover:bg-blue-700">
                {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сақтау
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
