
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function confirmUser() {
    console.log("Attempting to confirm admin user via raw SQL...");
    try {
        const result = await prisma.$executeRawUnsafe(
            `UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'admin@nextlevel.com'`
        );
        console.log(`Success! ${result} user(s) updated.`);
    } catch (error) {
        console.error("Error confirming user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

confirmUser();
