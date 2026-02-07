
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Applying Mega-Fix for all images...");

    const images = {
        tesla: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop",
        mercedes: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop",
        porsche: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2070&auto=format&fit=crop",
        audi: "https://images.unsplash.com/photo-1603577372314-a4b35f2953da?q=80&w=2070&auto=format&fit=crop",
        innova: "https://drive.google.com/uc?export=download&id=1YQwYbyVH3q727xZXaEqsberYKQqnxryd"
    };

    try {
        const cars = await prisma.car.findMany();
        for (const car of cars) {
            let newUrl = car.image;
            if (car.brand === "Tesla") newUrl = images.tesla;
            else if (car.brand.includes("Mercedes")) newUrl = images.mercedes;
            else if (car.brand === "Porsche") newUrl = images.porsche;
            else if (car.brand === "Audi") newUrl = images.audi;
            else if (car.brand === "Innova") newUrl = images.innova;

            // If it's a broken drive link or something we don't recognize, use a generic supercar
            if (car.image.includes('drive.google.com') && !car.image.includes('export=download')) {
                newUrl = images.innova;
            }

            if (newUrl !== car.image) {
                await prisma.car.update({
                    where: { id: car.id },
                    data: { image: newUrl }
                });
                console.log(`Updated [${car.id}] ${car.brand}: ${newUrl}`);
            }
        }

        // Also check accessories - many use Unsplash too
        const accessories = await prisma.accessory.findMany();
        for (const acc of accessories) {
            if (acc.image.includes('drive.google.com') && !acc.image.includes('export=download')) {
                // No clear drive replacement for accessories yet, but let's just make sure they aren't broken
                console.log(`Warning: Accessory [${acc.id}] has broken drive link.`);
            }
        }

        console.log("Mega-Fix complete.");
    } catch (error) {
        console.error("Error applying mega-fix:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
