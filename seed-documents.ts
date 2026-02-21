import "dotenv/config";
import { db } from "./server/db";
import { documents } from "@shared/schema";
import { eq } from "drizzle-orm";

const schoolDocuments = [
    {
        title: "Мектеп Жарғысы",
        description: "FGS мектебінің негізгі құрылтай құжаты",
        section: "school-documents",
        url: "#", // Замените на реальный URL файла
        color: "blue",
        icon: "file"
    },
    {
        title: "Ұжымдық келісім шарт",
        description: "Мектеп қызметкерлерінің еңбек шарттары мен құқықтары",
        section: "school-documents",
        url: "#",
        color: "blue",
        icon: "file"
    },
    {
        title: "Мектеп ішкі тәртібі",
        description: "Оқушылар мен қызметкерлерге арналған ішкі тәртіп ережелері",
        section: "school-documents",
        url: "#",
        color: "blue",
        icon: "file"
    },
    {
        title: "Оқу жоспары",
        description: "2024-2025 оқу жылына арналған толық оқу жоспары",
        section: "school-documents",
        url: "#",
        color: "blue",
        icon: "file"
    },
    {
        title: "Педагогикалық кеңес хаттамасы",
        description: "Педагогикалық кеңес отырысының хаттамасы",
        section: "school-documents",
        url: "#",
        color: "blue",
        icon: "file"
    },
    {
        title: "Әдістемелік кеңес отырыс жоспары",
        description: "2025–2026 оқу жылы",
        section: "school-documents",
        url: "#",
        color: "blue",
        icon: "file"
    },
    {
        title: "Директор жанындағы кеңес отырыстарының жоспары",
        description: "Жаңа оқу жылына арналған толық жұмыс жоспары",
        section: "school-documents",
        url: "#",
        color: "blue",
        icon: "file"
    },
    {
        title: "Бірінші педагогикалық кеңес материалдары",
        description: "Жылдық педагогикалық кеңес отырыстарының жоспары",
        section: "school-documents",
        url: "#",
        color: "blue",
        icon: "file"
    },
    {
        title: "Таңдау пәндерінің кестесі",
        description: "2025-2026 оқу жылына арналған таңдау пәндерінің кестесі",
        section: "school-documents",
        url: "#",
        color: "blue",
        icon: "file"
    }
];

async function seedDocuments() {
    console.log("Seeding school documents...");

    for (const doc of schoolDocuments) {
        // Check if document already exists
        const [existing] = await db.select().from(documents).where(eq(documents.title, doc.title));

        if (!existing) {
            await db.insert(documents).values({
                id: crypto.randomUUID(),
                ...doc,
                createdAt: new Date(),
            });
            console.log(`✓ Added: ${doc.title}`);
        } else {
            console.log(`⊘ Skipped (exists): ${doc.title}`);
        }
    }

    console.log("Seeding complete!");
    process.exit(0);
}

seedDocuments().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
