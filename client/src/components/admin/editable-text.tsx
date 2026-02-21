import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditableTextProps {
    contentKey: string;
    defaultValue: string;
    tag?: "h1" | "h2" | "h3" | "p" | "span" | "div";
    className?: string;
    multiline?: boolean;
}

export default function EditableText({
    contentKey,
    defaultValue,
    tag: Tag = "p",
    className = "",
    multiline = false,
}: EditableTextProps) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(defaultValue);

    // Fetch content from database
    const { data: contentData } = useQuery({
        queryKey: ["/api/content", contentKey],
        queryFn: async () => {
            const res = await fetch(`/api/content?key=${contentKey}&lang=kz`);
            if (!res.ok) return null;
            const data = await res.json();
            return data[0] || null;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (value: string) => {
            if (contentData?.id) {
                // Update existing
                const res = await fetch(`/api/content/${contentData.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ value }),
                });
                if (!res.ok) throw new Error("Update failed");
                return res.json();
            } else {
                // Create new
                const res = await fetch("/api/content", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        key: contentKey,
                        lang: "kz",
                        value,
                        type: "text",
                    }),
                });
                if (!res.ok) throw new Error("Create failed");
                return res.json();
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/content"] });
            setIsEditing(false);
        },
    });

    const handleSave = () => {
        updateMutation.mutate(editValue);
    };

    const handleCancel = () => {
        setEditValue(contentData?.value || defaultValue);
        setIsEditing(false);
    };

    const displayValue = contentData?.value || defaultValue;

    if (!user) {
        // Not admin - just show text
        return <Tag className={className}>{displayValue}</Tag>;
    }

    if (isEditing) {
        return (
            <div className="relative group">
                {multiline ? (
                    <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={`${className} min-h-[100px]`}
                        autoFocus
                    />
                ) : (
                    <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={className}
                        autoFocus
                    />
                )}
                <div className="flex gap-2 mt-2">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                    >
                        <Check className="w-4 h-4 mr-1" />
                        Сохранить
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updateMutation.isPending}
                    >
                        <X className="w-4 h-4 mr-1" />
                        Отмена
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group inline-block w-full">
            <Tag className={className}>{displayValue}</Tag>
            <Button
                size="sm"
                variant="secondary"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={() => {
                    setEditValue(displayValue);
                    setIsEditing(true);
                }}
            >
                <Pencil className="w-3 h-3" />
            </Button>
        </div>
    );
}
