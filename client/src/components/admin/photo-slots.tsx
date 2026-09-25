import { useMemo, useState } from "react";
import { Loader2, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Label } from "@/components/ui/label";

/** Upload a file through /api/upload and return its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Сурет жүктелмеді");
  }
  const { url } = await res.json();
  return url;
}

/** Create or update one site_content record by key (the same records EditableText reads). */
export async function saveContent(key: string, value: string, type: "text" | "json" = "text") {
  const found = await fetch(`/api/content?key=${key}&lang=kz`).then((r) => (r.ok ? r.json() : []));
  const id = found?.[0]?.id;
  const res = id
    ? await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
        credentials: "include",
      })
    : await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, lang: "kz", value, type }),
        credentials: "include",
      });
  if (!res.ok) throw new Error("Сақтау мүмкін болмады");
}

// A fixed number of admin-uploadable photo slots stored as a JSON array under one content key
export function usePhotoSlots(contentKey: string, count: number) {
  const { toast } = useToast();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const { data: record } = useQuery<any>({
    queryKey: ["/api/content", contentKey],
    queryFn: async () => {
      const res = await fetch(`/api/content?key=${contentKey}&lang=kz`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    },
  });

  const photos: string[] = useMemo(() => {
    let list: string[] = [];
    if (record?.value) {
      try {
        const parsed = JSON.parse(record.value);
        if (Array.isArray(parsed)) list = parsed;
      } catch {
        /* fall back to empty slots */
      }
    }
    return Array.from({ length: count }, (_, i) => list[i] || "");
  }, [record, count]);

  const save = useMutation({
    mutationFn: async (list: string[]) => {
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
            body: JSON.stringify({ key: contentKey, lang: "kz", value, type: "json" }),
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

  const upload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await uploadImage(file);
      const next = [...photos];
      next[index] = url;
      save.mutate(next);
    } catch (err: any) {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    } finally {
      setUploadingIndex(null);
    }
  };

  const set = (index: number, value: string) => {
    const next = [...photos];
    next[index] = value;
    save.mutate(next);
  };

  const remove = (index: number) => set(index, "");

  return { photos, upload, remove, set, uploadingIndex };
}

export type PhotoSlots = ReturnType<typeof usePhotoSlots>;

export function PhotoSlot({
  slots,
  index,
  inputId,
  className,
  hideControls = false,
}: {
  slots: PhotoSlots;
  index: number;
  inputId: string;
  className: string;
  hideControls?: boolean;
}) {
  const { user: authUser } = useAuth();
  const user = hideControls || authUser?.role !== "admin" ? null : authUser;
  const photo = slots.photos[index];
  return (
    <div className={`group relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}>
      {photo ? (
        <img src={photo} alt="" className="h-full w-full object-cover" />
      ) : hideControls ? null : (
        <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
          <ImageIcon className="h-10 w-10" />
        </div>
      )}
      {user && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Label htmlFor={inputId} className="cursor-pointer rounded-full bg-white p-2 text-[#2A4A46] hover:bg-gray-100">
            {slots.uploadingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          </Label>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={slots.uploadingIndex !== null}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) slots.upload(index, file);
              e.target.value = "";
            }}
          />
          {photo && (
            <button type="button" className="rounded-full bg-white p-2 text-red-600 hover:bg-gray-100" onClick={() => slots.remove(index)}>
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
