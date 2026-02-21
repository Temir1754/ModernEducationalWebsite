
import "dotenv/config";
import { db } from "./server/db";
import { news, media } from "@shared/schema";
import { eq } from "drizzle-orm";

const existingNews = [
    {
        dateText: "19 Тамыз 2025",
        title: "Ашық есік күні - 19.08.2025",
        body: "Ұстаздармен танысыңыз! Үйірмелерді сынап көріңіз! Әр сабақтан бағалау алыңыз! 50%-ға дейін грант мүмкіндігі! Сағат 10:00-де, Өтегенов 43А мекенжайында",
        coverUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250",
    },
    {
        dateText: "15 Тамыз 2025",
        title: "Жаксыбек Ерхан - біздің мектебіміздің мақтанышы!",
        body: "НИШ, РФМШ және БИЛ-ға бірден түсті! \"Алтын сақа\" және \"Дарын\" облыстық олимпиадаларында 1-орын! Үздік оқушы атанып, iPhone сыйлығын алды!",
        coverUrl: "/news-achievement.jpg",
    },
    {
        dateText: "10 Тамыз 2025",
        title: "Ашірбекова Гулмира Султановна - жаңа мұғалім",
        body: "Мектебімізге жаңа тәжірибелі мұғалім Ашірбекова Гулмира Султановна қосылды. Балаларымызды сапалы білім беруге дайын!",
        coverUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250",
    },
];

const galleryImages = [
    "/gallery/9E3A3836_1760365917103.jpg",
    "/gallery/9E3A3915_1760365922838.jpg",
    "/gallery/9E3A4095_1760365929211.jpg",
    "/gallery/9E3A5027_1760365940814.jpg",
    "/gallery/9E3A6335_1760365960419.jpg",
    "/gallery/9E3A7383_1760365970212.jpg",
    "/gallery/9E3A8477_1760365981392.jpg",
    "/gallery/9E3A8615_1760365987324.jpg",
    "/gallery/9E3A9948_1760366017872.jpg",
    "/gallery/9E3A9968_1760366020310.jpg",
    "/gallery/9E3A9986_1760366022789.jpg",
    "/gallery/9E3AE5505_1760366009876.jpg",
    "/gallery/IMG_6155_1760366041989.jpg",
    "/gallery/untitled-2318_1760366037457.jpg",
    "/gallery/untitled-2392_1760366031680.jpg",
    "/gallery/untitled-222-of-259_1760366044933.jpg"
];

async function seed() {
    console.log("Seeding news...");
    for (const item of existingNews) {
        const [existing] = await db.select().from(news).where(eq(news.title, item.title));
        if (!existing) {
            await db.insert(news).values({
                id: crypto.randomUUID(),
                ...item,
                createdAt: new Date(),
            });
            console.log(`Added news: ${item.title}`);
        } else {
            console.log(`Skipped news (exists): ${item.title}`);
        }
    }

    console.log("Seeding gallery...");
    for (const url of galleryImages) {
        const [existing] = await db.select().from(media).where(eq(media.url, url));
        if (!existing) {
            await db.insert(media).values({
                id: crypto.randomUUID(),
                type: "image",
                url: url,
                section: "gallery",
                createdAt: new Date(),
            });
            console.log(`Added gallery image: ${url}`);
        } else {
            console.log(`Skipped gallery image (exists): ${url}`);
        }
    }

    console.log("Seeding complete.");
    process.exit(0);
}

seed().catch(console.error);
