
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Fixing broken image URLs...");

    const oldDriveUrl = "https://drive.google.com/file/d/1YQwYbyVH3q727xZXaEqsberYKQqnxryd/view?usp=sharing";
    const innovaDirectUrl = "https://drive.google.com/uc?export=view&id=1YQwYbyVH3q727xZXaEqsberYKQqnxryd";

    // Replacement Unsplash URLs (verified high-quality)
    const porscheUrl = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2070&auto=format&fit=crop";
    const audiUrl = "https://images.unsplash.com/photo-1603577372314-a4b35f2953da?q=80&w=2070&auto=format&fit=crop";

    try {
        const updateDrive = await prisma.car.updateMany({
            where: { image: oldDriveUrl },
            data: { image: innovaDirectUrl }
        });
        console.log(`Updated ${updateDrive.count} cars with Drive link.`);

        const updatePorsche = await prisma.car.updateMany({
            where: { model: "911 GT3" },
            data: { image: porscheUrl }
        });
        console.log(`Updated ${updatePorsche.count} Porsche cars.`);

        const updateAudi = await prisma.car.updateMany({
            where: { model: "RS e-tron GT" },
            data: { image: audiUrl }
        });
        console.log(`Updated ${updateAudi.count} Audi cars.`);

        const allCars = await prisma.car.findMany();
        console.log("Final check of cars in DB:");
        for (const car of allCars) {
            console.log(`- ${car.brand} ${car.model}: ${car.image}`);
        }

    } catch (error) {
        console.error("Error fixing images:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
