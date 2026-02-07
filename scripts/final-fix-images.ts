
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Applying final image fixes...");

    const innovaDirectUrl = "https://drive.google.com/uc?export=view&id=1YQwYbyVH3q727xZXaEqsberYKQqnxryd";
    const porscheUrl = "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2070&auto=format&fit=crop";
    const audiUrl = "https://images.unsplash.com/photo-1603577372314-a4b35f2953da?q=80&w=2070&auto=format&fit=crop";

    try {
        // 1. Re-add Innova G4
        const innova = await prisma.car.upsert({
            where: { id: 5 }, // Re-using ID 5 if possible, or just creating
            update: {
                brand: "Innova",
                model: "G4",
                year: 2014,
                price: 600000,
                mileage: 1200,
                image: innovaDirectUrl,
                specs: { acceleration: "3.4s 0-60", topSpeed: "180mph" }
            },
            create: {
                id: 5,
                brand: "Innova",
                model: "G4",
                year: 2014,
                price: 600000,
                mileage: 1200,
                image: innovaDirectUrl,
                specs: { acceleration: "3.4s 0-60", topSpeed: "180mph" }
            }
        });
        console.log("Re-instated Innova G4.");

        // 2. Fix Porsche and Audi by model name
        await prisma.car.updateMany({
            where: { model: "911 GT3" },
            data: { image: porscheUrl }
        });
        await prisma.car.updateMany({
            where: { model: "RS e-tron GT" },
            data: { image: audiUrl }
        });

        const allCars = await prisma.car.findMany();
        console.log("Current Cars in DB:");
        for (const car of allCars) {
            console.log(`- [${car.id}] ${car.brand} ${car.model}: ${car.image}`);
        }

    } catch (error) {
        console.error("Error applying fixes:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
