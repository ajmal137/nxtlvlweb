
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Setting Drive URL to download mode...");

    const innovaDownloadUrl = "https://drive.google.com/uc?export=download&id=1YQwYbyVH3q727xZXaEqsberYKQqnxryd";

    try {
        const update = await prisma.car.update({
            where: { id: 5 },
            data: { image: innovaDownloadUrl }
        });
        console.log(`Updated ID 5 to: ${update.image}`);

    } catch (error) {
        console.error("Error applying fixes:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
