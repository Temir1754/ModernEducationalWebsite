
import mysql from "mysql2/promise";

async function createDb() {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "", // XAMPP default
        });

        await connection.query("CREATE DATABASE IF NOT EXISTS school_db");
        console.log("Database 'school_db' created successfully (or already exists).");
        await connection.end();
    } catch (error) {
        console.error("Error creating database:", error);
        process.exit(1);
    }
}

createDb();
