import { getAccessories } from "@/lib/actions";
import AccessoryInventoryClient from "./client";

export const dynamic = "force-dynamic";

export default async function AccessoryInventoryPage() {
    const { data: items, error } = await getAccessories();

    if (error) {
        return (
            <div className="p-8 text-red-500">
                Error loading inventory: {error}
            </div>
        );
    }

    return <AccessoryInventoryClient initialAccessories={items || []} />;
}
