import "dotenv/config";
import { db } from "./server/db";
import { documentFolders } from "./shared/schema";
import { eq } from "drizzle-orm";

interface SubFolder {
  id: string;
  label: string;
  subfolders?: SubFolder[];
}

interface CategoryDef {
  id: string;
  label: string;
  type: "simple" | "grouped";
  section?: string;
  subfolders?: SubFolder[];
}

const CATEGORIES: CategoryDef[] = [
  {
    id: "founding",
    label: "Білім беру ұйымының жалпы сипаттамасы",
    type: "grouped",
    subfolders: [
      { 
        id: "founding-2024", 
        label: "2024-2025",
        subfolders: [
          { id: "founding-2024-1", label: "Заңды тұлғаны мемлекеттік тіркеу / қайта тіркеу туралы анықтама" },
          { id: "founding-2024-2", label: "Заңды тұлға өкілін басшы лауазымына тағайындау туралы бұйрық" },
          { id: "founding-2024-3", label: "Білім беру ұйымының Жарғысы" },
          { id: "founding-2024-4", label: "Лиценция және оған қосымша" },
          { id: "founding-2024-5", label: "Мектептің техникалық төлқұжаты" },
          { id: "founding-2024-6", label: "Меншік иесі туралы мәліметтер" }
        ]
      },
      { 
        id: "founding-2025", 
        label: "2025-2026",
        subfolders: [
          { id: "founding-2025-1", label: "Заңды тұлғаны мемлекеттік тіркеу / қайта тіркеу туралы анықтама" },
          { id: "founding-2025-2", label: "Заңды тұлға өкілін басшы лауазымына тағайындау туралы бұйрық" },
          { id: "founding-2025-3", label: "Білім беру ұйымының Жарғысы" },
          { id: "founding-2025-4", label: "Лиценция және оған қосымша" },
          { id: "founding-2025-5", label: "Мектептің техникалық төлқұжаты" },
          { id: "founding-2025-6", label: "Меншік иесі туралы мәліметтер" }
        ]
      },
      { 
        id: "founding-2026", 
        label: "2026-2027",
        subfolders: [
          { id: "founding-2026-1", label: "Заңды тұлғаны мемлекеттік тіркеу / қайта тіркеу туралы анықтама" },
          { id: "founding-2026-2", label: "Заңды тұлға өкілін басшы лауазымына тағайындау туралы бұйрық" },
          { id: "founding-2026-3", label: "Білім беру ұйымының Жарғысы" },
          { id: "founding-2026-4", label: "Лиценция және оған қосымша" },
          { id: "founding-2026-5", label: "Мектептің техникалық төлқұжаты" },
          { id: "founding-2026-6", label: "Меншік иесі туралы мәліметтер" }
        ]
      },
    ],
  },
  {
    id: "staff-quality",
    label: "Кадр құрамының сапасы",
    type: "grouped",
    subfolders: [
      { 
        id: "staff-2024", 
        label: "2024-2025",
        subfolders: [
          { 
            id: "staff-2024-1", 
            label: "1-папка Әкімшілік",
            subfolders: [
              { id: "staff-2024-1-1", label: "Тізім" },
              { id: "staff-2024-1-2", label: "Диплом" },
              { id: "staff-2024-1-3", label: "Біліктілік санат" },
              { id: "staff-2024-1-4", label: "Біліктілік курсы" },
            ]
          },
          { 
            id: "staff-2024-2", 
            label: "2-папка Мұғалімдер",
            subfolders: [
              { id: "staff-2024-2-0-1", label: "Жалпы мұғалімдер тізімі" },
              { id: "staff-2024-2-0-2", label: "Дипломы" },
              { id: "staff-2024-2-0-3", label: "Біліктілік арттыру курсының куәлігі" },
              {
                id: "staff-2024-2-1",
                label: "Бастауыш білім деңгейі",
                subfolders: [
                  { id: "staff-2024-2-1-1", label: "Тізім" },
                  { id: "staff-2024-2-1-2", label: "Біліктілік санаты куәлігі" },
                  { id: "staff-2024-2-1-3", label: "Біліктілік санаты бар мұғалімдер тізімі" },
                ]
              },
              {
                id: "staff-2024-2-2",
                label: "Негізгі білім деңгейі",
                subfolders: [
                  { id: "staff-2024-2-2-1", label: "Тізім" },
                  { id: "staff-2024-2-2-2", label: "Біліктілік санаты куәлігі" },
                  { id: "staff-2024-2-2-3", label: "Біліктілік санаты бар мұғалімдер тізімі" },
                ]
              }
            ]
          },
          { 
            id: "staff-2024-3", 
            label: "3-папка Тарификациялық мәліметтер",
            subfolders: [
              { 
                id: "staff-2024-3-1", 
                label: "Бірінші жартыжылдық",
                subfolders: [
                  { id: "staff-2024-3-1-1", label: "Тарифициялық тізім" },
                  { id: "staff-2024-3-1-2", label: "Штаттық бірліктер саны туралы ақпарат" },
                  { id: "staff-2024-3-1-3", label: "Бірінші жартыжылдықтағы жүктеме саны" }
                ]
              },
              { 
                id: "staff-2024-3-2", 
                label: "Екінші жартыжылдық",
                subfolders: [
                  { id: "staff-2024-3-2-1", label: "Тарифициялық тізім" },
                  { id: "staff-2024-3-2-2", label: "Штаттық бірліктер саны туралы ақпарат" },
                  { id: "staff-2024-3-2-3", label: "Екінші жартыжылдықтағы жүктеме саны" }
                ]
              }
            ]
          }
        ]
      },
      { 
        id: "staff-2025", 
        label: "2025-2026",
        subfolders: [
          { 
            id: "staff-2025-1", 
            label: "1-папка Әкімшілік",
            subfolders: [
              { id: "staff-2025-1-1", label: "Тізім" },
              { id: "staff-2025-1-2", label: "Диплом" },
              { id: "staff-2025-1-3", label: "Біліктілік санат" },
              { id: "staff-2025-1-4", label: "Біліктілік курсы" },
            ]
          },
          { 
            id: "staff-2025-2", 
            label: "2-папка Мұғалімдер",
            subfolders: [
              { id: "staff-2025-2-0-1", label: "Жалпы мұғалімдер тізімі" },
              { id: "staff-2025-2-0-2", label: "Дипломы" },
              { id: "staff-2025-2-0-3", label: "Біліктілік арттыру курсының куәлігі" },
              {
                id: "staff-2025-2-1",
                label: "Бастауыш білім деңгейі",
                subfolders: [
                  { id: "staff-2025-2-1-1", label: "Тізім" },
                  { id: "staff-2025-2-1-2", label: "Біліктілік санаты куәлігі" },
                  { id: "staff-2025-2-1-3", label: "Біліктілік санаты бар мұғалімдер тізімі" },
                ]
              },
              {
                id: "staff-2025-2-2",
                label: "Негізгі білім деңгейі",
                subfolders: [
                  { id: "staff-2025-2-2-1", label: "Тізім" },
                  { id: "staff-2025-2-2-2", label: "Біліктілік санаты куәлігі" },
                  { id: "staff-2025-2-2-3", label: "Біліктілік санаты бар мұғалімдер тізімі" },
                ]
              }
            ]
          },
          { 
            id: "staff-2025-3", 
            label: "3-папка Тарификациялық мәліметтер",
            subfolders: [
              { 
                id: "staff-2025-3-1", 
                label: "Бірінші жартыжылдық",
                subfolders: [
                  { id: "staff-2025-3-1-1", label: "Тарифициялық тізім" },
                  { id: "staff-2025-3-1-2", label: "Штаттық бірліктер саны туралы ақпарат" },
                  { id: "staff-2025-3-1-3", label: "Бірінші жартыжылдықтағы жүктеме саны" }
                ]
              },
              { 
                id: "staff-2025-3-2", 
                label: "Екінші жартыжылдық",
                subfolders: [
                  { id: "staff-2025-3-2-1", label: "Тарифициялық тізім" },
                  { id: "staff-2025-3-2-2", label: "Штаттық бірліктер саны туралы ақпарат" },
                  { id: "staff-2025-3-2-3", label: "Екінші жартыжылдықтағы жүктеме саны" }
                ]
              }
            ]
          }
        ]
      },
      { 
        id: "staff-2026", 
        label: "2026-2027",
        subfolders: [
          { 
            id: "staff-2026-1", 
            label: "1-папка Әкімшілік",
            subfolders: [
              { id: "staff-2026-1-1", label: "Тізім" },
              { id: "staff-2026-1-2", label: "Диплом" },
              { id: "staff-2026-1-3", label: "Біліктілік санат" },
              { id: "staff-2026-1-4", label: "Біліктілік курсы" },
            ]
          },
          { 
            id: "staff-2026-2", 
            label: "2-папка Мұғалімдер",
            subfolders: [
              { id: "staff-2026-2-0-1", label: "Жалпы мұғалімдер тізімі" },
              { id: "staff-2026-2-0-2", label: "Дипломы" },
              { id: "staff-2026-2-0-3", label: "Біліктілік арттыру курсының куәлігі" },
              {
                id: "staff-2026-2-1",
                label: "Бастауыш білім деңгейі",
                subfolders: [
                  { id: "staff-2026-2-1-1", label: "Тізім" },
                  { id: "staff-2026-2-1-2", label: "Біліктілік санаты куәлігі" },
                  { id: "staff-2026-2-1-3", label: "Біліктілік санаты бар мұғалімдер тізімі" },
                ]
              },
              {
                id: "staff-2026-2-2",
                label: "Негізгі білім деңгейі",
                subfolders: [
                  { id: "staff-2026-2-2-1", label: "Тізім" },
                  { id: "staff-2026-2-2-2", label: "Біліктілік санаты куәлігі" },
                  { id: "staff-2026-2-2-3", label: "Біліктілік санаты бар мұғалімдер тізімі" },
                ]
              }
            ]
          },
          { 
            id: "staff-2026-3", 
            label: "3-папка Тарификациялық мәліметтер",
            subfolders: [
              { 
                id: "staff-2026-3-1", 
                label: "Бірінші жартыжылдық",
                subfolders: [
                  { id: "staff-2026-3-1-1", label: "Тарифициялық тізім" },
                  { id: "staff-2026-3-1-2", label: "Штаттық бірліктер саны туралы ақпарат" },
                  { id: "staff-2026-3-1-3", label: "Бірінші жартыжылдықтағы жүктеме саны" }
                ]
              },
              { 
                id: "staff-2026-3-2", 
                label: "Екінші жартыжылдық",
                subfolders: [
                  { id: "staff-2026-3-2-1", label: "Тарифициялық тізім" },
                  { id: "staff-2026-3-2-2", label: "Штаттық бірліктер саны туралы ақпарат" },
                  { id: "staff-2026-3-2-3", label: "Екінші жартыжылдықтағы жүктеме саны" }
                ]
              }
            ]
          }
        ]
      },
    ],
  },
  {
    id: "contingent",
    label: "Білім алушылардың контингенті",
    type: "grouped",
    subfolders: [
      { 
        id: "contingent-2024", 
        label: "2024-2025",
        subfolders: [
          {
            id: "contingent-2024-main",
            label: "Контингент",
            subfolders: [
              {
                id: "contingent-2024-1",
                label: "Бірінші жартыжылдық",
                subfolders: [
                  { id: "contingent-2024-1-list", label: "Білім алушылар тізімі" },
                  { id: "contingent-2024-1-gender", label: "Сыныптар бойынша қыздармен ұлдарға бөлініу туралы мәлімет" },
                  { id: "contingent-2024-1-struct", label: "Білім алушылар контингентінің құрылымы" }
                ]
              },
              {
                id: "contingent-2024-2",
                label: "Екінші жартыжылдық",
                subfolders: [
                  { id: "contingent-2024-2-list", label: "Білім алушылар тізімі" },
                  { id: "contingent-2024-2-gender", label: "Сыныптар бойынша қыздармен ұлдарға бөлініу туралы мәлімет" },
                  { id: "contingent-2024-2-struct", label: "Білім алушылар контингентінің құрылымы" }
                ]
              }
            ]
          }
        ]
      },
      { 
        id: "contingent-2025", 
        label: "2025-2026",
        subfolders: [
          {
            id: "contingent-2025-main",
            label: "Контингент",
            subfolders: [
              {
                id: "contingent-2025-1",
                label: "Бірінші жартыжылдық",
                subfolders: [
                  { id: "contingent-2025-1-list", label: "Білім алушылар тізімі" },
                  { id: "contingent-2025-1-gender", label: "Сыныптар бойынша қыздармен ұлдарға бөлініу туралы мәлімет" },
                  { id: "contingent-2025-1-struct", label: "Білім алушылар контингентінің құрылымы" }
                ]
              },
              {
                id: "contingent-2025-2",
                label: "Екінші жартыжылдық",
                subfolders: [
                  { id: "contingent-2025-2-list", label: "Білім алушылар тізімі" },
                  { id: "contingent-2025-2-gender", label: "Сыныптар бойынша қыздармен ұлдарға бөлініу туралы мәлімет" },
                  { id: "contingent-2025-2-struct", label: "Білім алушылар контингентінің құрылымы" }
                ]
              }
            ]
          }
        ]
      },
      { 
        id: "contingent-2026", 
        label: "2026-2027",
        subfolders: [
          {
            id: "contingent-2026-main",
            label: "Контингент",
            subfolders: [
              {
                id: "contingent-2026-1",
                label: "Бірінші жартыжылдық",
                subfolders: [
                  { id: "contingent-2026-1-list", label: "Білім алушылар тізімі" },
                  { id: "contingent-2026-1-gender", label: "Сыныптар бойынша қыздармен ұлдарға бөлініу туралы мәлімет" },
                  { id: "contingent-2026-1-struct", label: "Білім алушылар контингентінің құрылымы" }
                ]
              },
              {
                id: "contingent-2026-2",
                label: "Екінші жартыжылдық",
                subfolders: [
                  { id: "contingent-2026-2-list", label: "Білім алушылар тізімі" },
                  { id: "contingent-2026-2-gender", label: "Сыныптар бойынша қыздармен ұлдарға бөлініу туралы мәлімет" },
                  { id: "contingent-2026-2-struct", label: "Білім алушылар контингентінің құрылымы" }
                ]
              }
            ]
          }
        ]
      },
    ],
  },
  {
    id: "curriculum",
    label: "Оқу жоспары",
    type: "grouped",
    subfolders: [
      { 
        id: "curriculum-2024", 
        label: "2024-2025",
        subfolders: [
          { id: "curriculum-2024-work", label: "Жұмыс оқу жоспары" },
          { id: "curriculum-2024-schedule", label: "Сабақ кестесі" },
          { id: "curriculum-2024-var", label: "Вариативтік компонент бойынша сабақ кестесі" },
          { id: "curriculum-2024-max", label: "Білім алушылардың апталық оқу жүктемесінің ең жоғары көлемінің сәйкестігі" }
        ]
      },
      { 
        id: "curriculum-2025", 
        label: "2025-2026",
        subfolders: [
          { id: "curriculum-2025-work", label: "Жұмыс оқу жоспары" },
          { id: "curriculum-2025-schedule", label: "Сабақ кестесі" },
          { id: "curriculum-2025-var", label: "Вариативтік компонент бойынша сабақ кестесі" },
          { id: "curriculum-2025-max", label: "Білім алушылардың апталық оқу жүктемесінің ең жоғары көлемінің сәйкестігі" }
        ]
      },
      { 
        id: "curriculum-2026", 
        label: "2026-2027",
        subfolders: [
          { id: "curriculum-2026-work", label: "Жұмыс оқу жоспары" },
          { id: "curriculum-2026-schedule", label: "Сабақ кестесі" },
          { id: "curriculum-2026-var", label: "Вариативтік компонент бойынша сабақ кестесі" },
          { id: "curriculum-2026-max", label: "Білім алушылардың апталық оқу жүктемесінің ең жоғары көлемінің сәйкестігі" }
        ]
      },
    ],
  },
  {
    id: "upbringing",
    label: "Мектеп тынысы",
    type: "grouped",
    subfolders: [
      { id: "upbringing-2024", label: "2024-2025" },
      { id: "upbringing-2025", label: "2025-2026" },
      { id: "upbringing-2026", label: "2026-2027" },
    ],
  },
  {
    id: "assets",
    label: "Оқу-материалдық активтер",
    type: "grouped",
    subfolders: [
      { id: "assets-2024", label: "2024-2025" },
      { id: "assets-2025", label: "2025-2026" },
      { id: "assets-2026", label: "2026-2027" },
    ],
  },
  {
    id: "safety",
    label: "Білім алушылардың қауіпсіздігі",
    type: "grouped",
    subfolders: [
      { id: "safety-2024", label: "2024-2025" },
      { id: "safety-2025", label: "2025-2026" },
      { id: "safety-2026", label: "2026-2027" },
    ],
  },
  {
    id: "control",
    label: "Мектепшілік бақылау",
    type: "grouped",
    subfolders: [
      { id: "control-2024", label: "2024-2025" },
      { id: "control-2025", label: "2025-2026" },
      { id: "control-2026", label: "2026-2027" },
    ],
  },
];

async function insertFolder(folder: SubFolder, parentId: string | null = null, order: number, isCategory: boolean = false) {
  // Check if exists
  const [existing] = await db.select().from(documentFolders).where(eq(documentFolders.id, folder.id));
  if (!existing) {
    await db.insert(documentFolders).values({
      id: folder.id,
      name: folder.label,
      parentId,
      isCategory,
      order: order.toString(),
      createdAt: new Date(),
    });
    console.log(`✓ Inserted folder: ${folder.label} (${folder.id})`);
  }

  if (folder.subfolders && folder.subfolders.length > 0) {
    for (let i = 0; i < folder.subfolders.length; i++) {
        await insertFolder(folder.subfolders[i], folder.id, i);
    }
  }
}

async function seedFolders() {
  console.log("Seeding folders...");
  
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    
    const [existingCat] = await db.select().from(documentFolders).where(eq(documentFolders.id, cat.id));
    if (!existingCat) {
      await db.insert(documentFolders).values({
        id: cat.id,
        name: cat.label,
        parentId: null,
        isCategory: true,
        order: i.toString(),
        createdAt: new Date(),
      });
      console.log(`✓ Inserted category: ${cat.label} (${cat.id})`);
    }

    if (cat.type === "grouped" && cat.subfolders) {
      for (let j = 0; j < cat.subfolders.length; j++) {
        await insertFolder(cat.subfolders[j], cat.id, j);
      }
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seedFolders().catch((err) => {
  console.error("Error seeding:", err);
  process.exit(1);
});
