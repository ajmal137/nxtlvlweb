import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const cars = [
    {
        brand: "Tesla",
        model: "Model S Plaid",
        year: 2024,
        price: 89990,
        mileage: 1500,
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop",
        specs: {
            acceleration: "1.99s 0-60",
            topSpeed: "200mph",
            power: "1,020 hp",
            range: "396 mi"
        }
    },
    {
        brand: "Porsche",
        model: "911 GT3",
        year: 2023,
        price: 225000,
        mileage: 3200,
        image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop",
        specs: {
            acceleration: "3.2s 0-60",
            topSpeed: "197mph",
            power: "502 hp",
            range: "N/A"
        }
    },
    {
        brand: "Mercedes-AMG",
        model: "GT Black Series",
        year: 2022,
        price: 325000,
        mileage: 950,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop",
        specs: {
            acceleration: "3.1s 0-60",
            topSpeed: "202mph",
            power: "720 hp",
            range: "N/A"
        }
    },
    {
        brand: "Audi",
        model: "RS e-tron GT",
        year: 2024,
        price: 147500,
        mileage: 500,
        image: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81d?q=80&w=2067&auto=format&fit=crop",
        specs: {
            acceleration: "3.1s 0-60",
            topSpeed: "155mph",
            power: "637 hp",
            range: "232 mi"
        }
    },
    {
        brand: "BMW",
        model: "M4 Competition",
        year: 2024,
        price: 88500,
        mileage: 1200,
        image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2065&auto=format&fit=crop",
        specs: {
            acceleration: "3.4s 0-60",
            topSpeed: "180mph",
            power: "503 hp",
            range: "N/A"
        }
    }
];

const accessories = [
    {
        name: "Carbon Fiber Spoiler",
        price: 1250,
        image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Performance Exhaust System",
        price: 3500,
        image: "https://images.unsplash.com/photo-1565590216127-10651752b02d?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Ceramic Coating Kit",
        price: 299,
        image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Forged Racing Wheels (Set)",
        price: 4800,
        image: "https://images.unsplash.com/photo-1548811234-a2a197b0d913?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Dashboard Camera 4K",
        price: 450,
        image: "https://images.unsplash.com/photo-1512403754473-27835f7b9984?q=80&w=2052&auto=format&fit=crop"
    },
    {
        name: "All-Weather Floor Mats",
        price: 180,
        image: "https://images.unsplash.com/photo-1552355554-15f5c868673a?q=80&w=1974&auto=format&fit=crop"
    },
    {
        name: "Car Cover (Outdoor)",
        price: 250,
        image: "https://images.unsplash.com/photo-1605300232490-58c0c9705dc1?q=80&w=1926&auto=format&fit=crop"
    },
    {
        name: "Battery Charger / Maintainer",
        price: 120,
        image: "https://images.unsplash.com/photo-1622667389148-cc124b8a245d?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Roof Rack System",
        price: 650,
        image: "https://images.unsplash.com/photo-1529369986348-73599d0ce473?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "LED Underglow Kit",
        price: 199,
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop"
    }
];

async function main() {
    console.log('Start seeding ...')

    for (const car of cars) {
        const createdCar = await prisma.car.create({
            data: car,
        })
        console.log(`Created car with id: ${createdCar.id}`)
    }

    for (const item of accessories) {
        const createdItem = await prisma.accessory.create({
            data: item,
        })
        console.log(`Created accessory with id: ${createdItem.id}`)
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
