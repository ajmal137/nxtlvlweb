
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Searching for ANY Drive links...");
    try {
        const allCars = await prisma.car.findMany();
        console.log(`Checking ${allCars.length} cars...`);
        allCars.forEach(car => {
            if (car.image.includes('drive.google')) {
                console.log(`MATCH FOUND: ID=${car.id}, Brand=${car.brand}, Model=${car.model}`);
                console.log(`URL: "${car.image}"`);
            }
        });

    } catch (error) {
        console.error("Error searching:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
