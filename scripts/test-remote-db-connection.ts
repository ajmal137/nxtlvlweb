
import { PrismaClient } from '@prisma/client';

// Constructing the URL manually to be sure
const dbUrl = "postgresql://postgres:Nxtlvldb%402026@db.zowlqqtsqyobkpjssrzo.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
});

async function main() {
    console.log("Attempting to connect to remote Supabase DB...");
    console.log(`URL: ${dbUrl.replace(/:[^:@]*@/, ":****@")}`); // Log URL masking password

    try {
        await prisma.$connect();
        console.log("✅ Successfully connected to the database!");

        const count = await prisma.car.count();
        console.log(`✅ Database is active. Found ${count} cars.`);

    } catch (e) {
        console.error("❌ Connection failed:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
