
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root@localhost:3306/school_db';

const documents = [
    // Жас сарбаз ұйымы
    {
        title: "Жас ұлан әскери-патриоттық ұйымын құру туралы бұйрық",
        url: "/attached_assets/Казакстан Республикасы_compressed_1764181463189.pdf",
        section: "upbringing-program-жас-сарбаз-ұйымы",
        color: "green"
    },
    {
        title: "2025-2026 оқу жылының Жас ұлан әскери патриоттық ұйымының бағдарламасы",
        url: "/attached_assets/Бекітемін (1)_compressed_1764181524873.pdf",
        section: "upbringing-program-жас-сарбаз-ұйымы",
        color: "blue"
    },
    {
        title: "Жас ұлан ұйымының жұмыс жоспары",
        url: "/attached_assets/Кыркуйек_compressed_1764181588583.pdf",
        section: "upbringing-program-жас-сарбаз-ұйымы",
        color: "purple"
    },
    {
        title: "Жастарды әскери-патриоттық тәрбиелеудің 2030 жылға дейінгі тұжырымдамасы",
        url: "/attached_assets/Казакстан Республикасы (1)_compressed_1764181754602.pdf",
        section: "upbringing-program-жас-сарбаз-ұйымы",
        color: "green"
    },
    {
        title: "Жастарды әскери-патриоттық тәрбиелеудің 2030 жылға дейінгі тұжырымдамасын іске асыру жөніндегі іс-қимыл жоспары",
        url: "/attached_assets/Жастарды эскери-патриоттык_compressed_1764181827862.pdf",
        section: "upbringing-program-жас-сарбаз-ұйымы",
        color: "blue"
    },
    // Мектеп парламенті
    {
        title: "Мектеп парламенті бұйрығы",
        url: "/attached_assets/FGS - БОЛАШАК УРПАК_compressed_1764178913527.pdf",
        section: "upbringing-program-мектеп-парламенті",
        color: "green"
    },
    {
        title: "Мектеп парламенті жылдық жоспары",
        url: "/attached_assets/Бекітемін_compressed_1764179015766.pdf",
        section: "upbringing-program-мектеп-парламенті",
        color: "blue"
    },
    {
        title: "Мектеп парламентінің отырысының протоколдары",
        url: "/attached_assets/ilovepdf_merged_compressed_1764178834739.pdf",
        section: "upbringing-program-мектеп-парламенті",
        color: "purple"
    },
    // Адал азамат
    {
        title: "\"Адал азамат\" бұйрық",
        url: "/attached_assets/png2pdf_1764182563276.pdf",
        section: "upbringing-program-адал-азамат",
        color: "green"
    },
    {
        title: "\"Адал азамат\" жылдық жоспары",
        url: "/attached_assets/Скан_20251022_compressed_1764182451359.pdf",
        section: "upbringing-program-адал-азамат",
        color: "blue"
    },
    {
        title: "\"Адал азамат\" бағдарламасы",
        url: "/attached_assets/Скан_20251021_1764182534580.pdf",
        section: "upbringing-program-адал-азамат",
        color: "purple"
    },
    // ДосболLike
    {
        title: "ДосболLike бүйрығы",
        url: "/attached_assets/Скан_20251023_1764183928728.pdf",
        section: "upbringing-program-dosbollike",
        color: "pink"
    },
    {
        title: "ДосболLike жоспары",
        url: "/attached_assets/Скан_20251023_merged_compressed_1764184225915.pdf",
        section: "upbringing-program-dosbollike",
        color: "purple"
    },
    {
        title: "ДосболLike бағдарламасы",
        url: "/attached_assets/Скан_20251023_merged_1764184249777.pdf",
        section: "upbringing-program-dosbollike",
        color: "blue"
    },
    {
        title: "Буллинг бұйрығы",
        url: "/attached_assets/Скан_20251024_1764183763667.pdf",
        section: "upbringing-program-dosbollike",
        color: "red"
    },
    {
        title: "Буллинг бағдарламасы",
        url: "/attached_assets/Скан_20251024_merged_1764183712519.pdf",
        section: "upbringing-program-dosbollike",
        color: "orange"
    },
    {
        title: "Буллинг жоспары",
        url: "/attached_assets/Скан_20251024_1764183881120.pdf",
        section: "upbringing-program-dosbollike",
        color: "yellow"
    }
];

async function migrate() {
    console.log('Starting migration...');
    const connection = await mysql.createConnection(DATABASE_URL);

    try {
        for (const doc of documents) {
            const id = randomUUID();
            console.log(`Inserting: ${doc.title}`);
            await connection.execute(
                'INSERT INTO documents (id, title, url, section, color, icon) VALUES (?, ?, ?, ?, ?, ?)',
                [id, doc.title, doc.url, doc.section, doc.color, 'file']
            );
        }
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
