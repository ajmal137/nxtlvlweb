
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Fixing all accessory images...");

    const accessoryImages: Record<string, string> = {
        "LED Underglow Kit": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop",
        "Roof Rack System": "https://images.unsplash.com/photo-1632823471367-938b8c5ccff5?q=80&w=2000&auto=format&fit=crop",
        "Battery Charger / Maintainer": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2000&auto=format&fit=crop",
        "Car Cover (Outdoor)": "https://images.unsplash.com/photo-1507136566006-cfc505b8a4f3?q=80&w=2000&auto=format&fit=crop",
        "All-Weather Floor Mats": "https://images.unsplash.com/photo-1529369986348-73599d0ce473?q=80&w=2000&auto=format&fit=crop",
        "Dashboard Camera 4K": "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?q=80&w=2000&auto=format&fit=crop",
        "Forged Racing Wheels (Set)": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2000&auto=format&fit=crop",
        "Ceramic Coating Kit": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2000&auto=format&fit=crop"
    };

    try {
        const items = await prisma.accessory.findMany();
        for (const item of items) {
            let newUrl = item.image;

            // Map by name
            if (accessoryImages[item.name]) {
                newUrl = accessoryImages[item.name];
            }

            // Fix Drive links if any remain
            if (newUrl.includes('drive.google.com') && newUrl.includes('/view')) {
                newUrl = newUrl.replace('/view?usp=sharing', '').replace('file/d/', 'uc?export=download&id=').replace('/view', '');
            }

            if (newUrl !== item.image) {
                await prisma.accessory.update({
                    where: { id: item.id },
                    data: { image: newUrl }
                });
                console.log(`Updated [${item.id}] ${item.name}: ${newUrl}`);
            }
        }

        console.log("Accessory Fix complete.");
    } catch (error) {
        console.error("Error fixing accessories:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
