import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Download, Eye, Loader2, Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import SEOHead from "@/components/seo-head";
import type { Document } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const SECTIONS = [
  { id: "school-documents", label: "Мектеп құжаттары" },
  { id: "normative", label: "Нормативтік актілер" },
  { id: "budget", label: "Бюджет" },
  { id: "attestation", label: "Аттестаттау" }
];

export default function SchoolDocumentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("school-documents");

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    section: "school-documents"
  });

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents", activeSection],
    queryFn: async () => {
      const response = await fetch(`/api/documents?section=${activeSection}`);
      if (!response.ok) return [];
      return response.json();
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!uploadFile) throw new Error("Please select a file");

      const formData = new FormData();
      formData.append("file", uploadFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

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
          icon: "file"
        }),
      });

      if (!docRes.ok) throw new Error("Failed to save document info");
      return docRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Құжат сәтті жүктелді" });
      setIsUploadOpen(false);
      setNewDoc({ title: "", description: "", section: activeSection });
      setUploadFile(null);
    },
    onError: (err: Error) => {
      toast({ title: "Қате", description: err.message, variant: "destructive" });
    }
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
      setNewDoc({ title: "", description: "", section: activeSection });
      toast({ title: "Құжат жаңартылды" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/documents/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Құжат өшірілді" });
    }
  });

  const handleEdit = (doc: Document) => {
    setEditingDocId(doc.id);
    setNewDoc({
      title: doc.title,
      description: doc.description || "",
      section: doc.section,
    });
    setIsUploadOpen(true);
  };

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <SEOHead page="documents" />
      <div className="min-h-screen bg-[#0d1117]">

        {/* Header */}
        <div className="border-b border-white/10">
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
                <div className="flex items-center gap-2">
                  <Dialog open={isUploadOpen} onOpenChange={(open) => {
                    setIsUploadOpen(open);
                    if (!open) {
                      setEditingDocId(null);
                      setNewDoc({ title: "", description: "", section: activeSection });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Құжат қосу
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-[#1e293b] border border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-white">
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
                        <div className="space-y-2">
                          <Label className="text-gray-300">Бөлім</Label>
                          <select
                            value={newDoc.section}
                            onChange={(e) => setNewDoc({ ...newDoc, section: e.target.value })}
                            className="w-full p-2 border rounded-md bg-[#0d1117] border-white/20 text-white"
                          >
                            {SECTIONS.map(s => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Атауы</Label>
                          <Input
                            value={newDoc.title}
                            onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                            required
                            className="bg-[#0d1117] border-white/20 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Сипаттамасы</Label>
                          <Textarea
                            value={newDoc.description}
                            onChange={e => setNewDoc({ ...newDoc, description: e.target.value })}
                            className="bg-[#0d1117] border-white/20 text-white"
                          />
                        </div>
                        {!editingDocId && (
                          <div className="space-y-2">
                            <Label className="text-gray-300">Файл</Label>
                            <Input
                              type="file"
                              onChange={e => setUploadFile(e.target.files?.[0] || null)}
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
                  <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-500/10" asChild>
                    <Link href="/upbringing-work">
                      <span className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Тәрбие жұмысы
                      </span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-white mb-1">Мектеп құжаттары</h1>
          <p className="text-gray-400 text-sm mb-8">Мектептің барлық маңызды құжаттарымен танысыңыз</p>

          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Documents List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p>Құжаттар табылмады</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div
                  key={doc.id}
                  className="group flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-sm text-gray-500 w-6 shrink-0">{index + 1}.</span>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{doc.title}</p>
                      {doc.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{doc.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(doc.url)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 px-3 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Көру
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc.url, doc.title)}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10 h-8 px-3 text-xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Жүктеу
                    </Button>

                    {user && (
                      <>
                        <div className="flex items-center gap-1 border-l border-white/10 ml-1 pl-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 px-3 text-xs relative overflow-hidden"
                          >
                            <label className="cursor-pointer flex items-center">
                              <Plus className="w-3.5 h-3.5 mr-1" />
                              Скан қосу
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  try {
                                    const formData = new FormData();
                                    formData.append("file", file);

                                    const uploadRes = await fetch("/api/upload", {
                                      method: "POST",
                                      body: formData,
                                    });

                                    if (!uploadRes.ok) throw new Error("Upload failed");
                                    const { url } = await uploadRes.json();

                                    await updateMutation.mutateAsync({
                                      id: doc.id,
                                      data: { scanUrl: url }
                                    });

                                    toast({ title: "Скан сәтті қосылды" });
                                  } catch (err: any) {
                                    toast({
                                      title: "Қате",
                                      description: err.message,
                                      variant: "destructive"
                                    });
                                  }
                                }}
                              />
                            </label>
                          </Button>

                          {doc.scanUrl && (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleView(doc.scanUrl!)}
                                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 h-8 px-3 text-xs"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                Сканды көру
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Сканды өшіру керек пе?")) {
                                    updateMutation.mutate({
                                      id: doc.id,
                                      data: { scanUrl: null }
                                    });
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-3 text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                Скан өшіру
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 border-l border-white/10 ml-1 pl-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(doc)}
                            className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Құжатты өшіру керек пе?")) {
                                deleteMutation.mutate(doc.id);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div >
    </>
  );
}
