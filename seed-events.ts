import "dotenv/config";
import { db } from "./server/db";
import { events } from "./shared/schema";
import { eq } from "drizzle-orm";

const schoolEvents = [
    // August
    { month: "Тамыз", title: "FGS IV олимпиадасы", dateText: "20 тамыз", description: "FGS IV олимпиадасы өтті, олимпиадаға қаланың барлық мектептерінен оқушылар қатысты. Олар өз білімдерін байқап шыңдай білді." },
    { month: "Тамыз", title: "Ашық есік күні «Білім мен мүмкіндіктер әлемі»", dateText: "25 тамыз", description: "Ашық есік күні барысында мектептің әкімшілігі мен педагогикалық ұжым ата-аналар мен оқушыларды қарсы алып, жаңа оқу жылындағы жоспарлар мен жаңалықтар таныстырылды." },
    // September
    { month: "Қыркүйек", title: "Білім күні мерекесі", dateText: "1 қыркүйек", description: "Жаңа оқу жылын ашу салтанаты" },
    { month: "Қыркүйек", title: "Адаптация аптасы", dateText: "5-9 қыркүйек", description: "Жаңа оқушыларды бейімдеу" },
    // October
    { month: "Қазан", title: "Ұстаздар күні", dateText: "7 қазан", description: "Мұғалімдерді құрметтеу шарасы" },
    { month: "Қазан", title: "Күз мерекесі", dateText: "15 қазан", description: "Шығармашылық көрме-конкурс" },
    // November
    { month: "Қараша", title: "Тәуелсіздік күні қарсаңындағы шаралар", dateText: "Қараша", description: "Патриоттық тәрбие шаралары" },
    // December
    { month: "Желтоқсан", title: "Тәуелсіздік күні", dateText: "16 желтоқсан", description: "Мерекелік іс-шара" },
    { month: "Желтоқсан", title: "Жаңа жыл мерекесі", dateText: "Желтоқсан", description: "Мерекелік ертеңгілік" },
    // January
    { month: "Қаңтар", title: "Қысқы мектеп", dateText: "Қаңтар", description: "Оқушылардың білімін толықтыру" },
    // February
    { month: "Ақпан", title: "Ғылым апталығы", dateText: "Ақпан", description: "Жас зерттеушілер көрмесі" },
    // March
    { month: "Наурыз", title: "Наурыз мейрамы", dateText: "22 наурыз", description: "Ұлттық мерекені тойлау" },
    // April
    { month: "Сәуір", title: "Бенефис шоу", dateText: "Сәуір", description: "Шығармашылық есеп беру кеші" },
    // May
    { month: "Мамыр", title: "Жеңіс күні", dateText: "9 мамыр", description: "Патриоттық шара" },
    { month: "Мамыр", title: "Сыңғырла, соңғы қоңырау!", dateText: "25 мамыр", description: "Оқу жылын қорытындылау" }
];

async function seedEvents() {
    console.log("Seeding school events...");

    // Clear existing events to ensure clean state
    console.log("Clearing existing events...");
    await db.delete(events);
    console.log("✓ Events cleared");

    for (const event of schoolEvents) {
        await db.insert(events).values({
            id: crypto.randomUUID(),
            ...event,
            createdAt: new Date(),
        });
        console.log(`✓ Added: ${event.title}`);
    }

    console.log("Seeding complete!");
    process.exit(0);
}

seedEvents().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
