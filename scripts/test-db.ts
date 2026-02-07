
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

async function main() {
    console.log("Testing DB connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "Undefined");

    try {
        const cars = await prisma.car.findMany();
        console.log(`Successfully connected! Car count: ${cars.length}`);
        cars.forEach(car => {
            console.log(`- ${car.brand} ${car.model}: ${car.image}`);
        });

        const accessories = await prisma.accessory.findMany();
        console.log(`Accessory count: ${accessories.length}`);
        accessories.forEach(acc => {
            console.log(`- ${acc.name}: ${acc.image}`);
        });
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
