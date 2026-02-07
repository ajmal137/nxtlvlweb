
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Deleting car with ID 5 to test connection...");
    try {
        const deleted = await prisma.car.delete({
            where: { id: 5 }
        });
        console.log(`Deleted car: ${deleted.brand} ${deleted.model}`);
    } catch (error) {
        console.error("Error deleting:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
