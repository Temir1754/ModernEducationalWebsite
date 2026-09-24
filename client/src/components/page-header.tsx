import type { ReactNode } from "react";
import EditableText from "@/components/admin/editable-text";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Small uppercase line above the title */
  eyebrow?: string;
  /** When set, admins can edit the title inline (same key the page used before) */
  titleKey?: string;
  align?: "center" | "left";
  className?: string;
  /** Extra content under the header, e.g. admin buttons */
  children?: ReactNode;
}

const TITLE_CLASS = "font-heading text-3xl font-extrabold leading-tight text-[#2A4A46] dark:text-gray-100 md:text-5xl";

// Shared page title block so every page heading has the same font, size and colors
export default function PageHeader({ title, subtitle, eyebrow, titleKey, align = "center", className = "mb-12", children }: PageHeaderProps) {
  const center = align === "center";
  return (
    <header className={`${center ? "text-center" : ""} ${className}`}>
      {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#24806A]">{eyebrow}</p>}
      {titleKey ? (
        <EditableText contentKey={titleKey} defaultValue={title} tag="h1" className={TITLE_CLASS} />
      ) : (
        <h1 className={TITLE_CLASS}>{title}</h1>
      )}
      <div
        className={`my-5 h-[3px] w-24 ${
          center ? "mx-auto bg-gradient-to-r from-transparent via-[#F2A63B] to-transparent" : "bg-gradient-to-r from-[#F2A63B] to-transparent"
        }`}
      />
      {subtitle && (
        <p className={`text-lg leading-relaxed text-gray-600 dark:text-gray-400 ${center ? "mx-auto max-w-3xl" : "max-w-xl"}`}>{subtitle}</p>
      )}
      {children}
    </header>
  );
}
