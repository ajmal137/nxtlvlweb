import { getCars } from "@/lib/actions";
import CarInventoryClient from "./client";

export const dynamic = "force-dynamic";

export default async function CarInventoryPage() {
    const { data: cars, error } = await getCars();

    if (error) {
        return (
            <div className="p-8 text-red-500">
                Error loading inventory: {error}
            </div>
        );
    }

    // Ensure cars is always an array
    return <CarInventoryClient initialCars={cars || []} />;
}
