import "dotenv/config";
import { db } from "./server/db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seed() {
    const hashedPassword = await bcrypt.hash("FUTURE_GENERATION_SCHOOL_2022", 10);

    // Check if user exists
    const [existingUser] = await db.select().from(users).where(eq(users.username, "admin"));

    if (existingUser) {
        // Update password
        await db.update(users).set({ password: hashedPassword }).where(eq(users.username, "admin"));
        console.log("Admin password updated successfully.");
    } else {
        // Create user
        const id = crypto.randomUUID();
        await db.insert(users).values({
            id,
            username: "admin",
            password: hashedPassword,
            role: "admin"
        });
        console.log("Admin user created successfully.");
    }
}

seed().catch(console.error);
