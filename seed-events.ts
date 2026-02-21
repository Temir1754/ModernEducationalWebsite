import "dotenv/config";
import { db } from "./server/db";
import { events } from "@shared/schema";
import { eq } from "drizzle-orm";

const schoolEvents = [
    {
        title: "Жас сарбаз ұйымы",
        description: "Жас сарбаз ұйымының іс-шаралары мен жаттығулары",
        date: new Date("2024-09-01"),
        location: "FGS мектебі"
    },
    {
        title: "Сынып жетекшілігі",
        description: "Сынып жетекшілерінің жұмысы және іс-шаралары",
        date: new Date("2024-09-01"),
        location: "FGS мектебі"
    },
    {
        title: "Мектеп парламенті",
        description: "Оқушылар парламентінің отырыстары мен шешімдері",
        date: new Date("2024-09-01"),
        location: "FGS мектебі"
    },
    {
        title: "Инабатты қыздар",
        description: "Инабатты қыздар бағдарламасының іс-шаралары",
        date: new Date("2024-09-01"),
        location: "FGS мектебі"
    },
    {
        title: "Адал азамат",
        description: "Адал азамат бағдарламасы бойынша іс-шаралар",
        date: new Date("2024-09-01"),
        location: "FGS мектебі"
    },
    {
        title: "ДосболLike бағдарламасы",
        description: "ДосболLike волонтерлік бағдарламасының іс-шаралары",
        date: new Date("2024-09-01"),
        location: "FGS мектебі"
    },
    {
        title: "Шәкірттердің кодексі",
        description: "Оқушылардың мінез-құлық кодексі және тәртіп ережелері",
        date: new Date("2024-09-01"),
        location: "FGS мектебі"
    },
    {
        title: "Құқықбұзушылықтың алдын алу",
        description: "Құқықбұзушылықтың алдын алу бойынша іс-шаралар",
        date: new Date("2024-09-01"),
        location: "FGS мектебі"
    },
    {
        title: "Жылдық іс-шаралар",
        description: "Мектептің жылдық іс-шаралары мен мерекелері",
        date: new Date("2024-09-01"),
        location: "FGS мектебі"
    }
];

async function seedEvents() {
    console.log("Seeding school events...");

    for (const event of schoolEvents) {
        // Check if event already exists
        const [existing] = await db.select().from(events).where(eq(events.title, event.title));

        if (!existing) {
            await db.insert(events).values({
                id: crypto.randomUUID(),
                ...event,
                createdAt: new Date(),
            });
            console.log(`✓ Added: ${event.title}`);
        } else {
            console.log(`⊘ Skipped (exists): ${event.title}`);
        }
    }

    console.log("Seeding complete!");
    process.exit(0);
}

seedEvents().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
