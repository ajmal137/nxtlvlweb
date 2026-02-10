"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

// --- HELPERS ---

const mapDoc = (doc: any) => ({
    id: doc.id,
    ...doc.data()
});

// --- CARS ---

export async function getCars() {
    try {
        console.log("Fetching cars from Firestore...");
        const snapshot = await adminDb.collection("cars").orderBy("createdAt", "desc").get();
        const cars = snapshot.docs.map(mapDoc);
        console.log(`Successfully fetched ${cars.length} cars.`);
        return { data: cars, error: null };
    } catch (error) {
        console.error("Error fetching cars:", error);
        return { data: [], error: "Failed to fetch cars" };
    }
}

export async function createCar(data: any) {
    try {
        const carData = {
            ...data,
            year: Number(data.year),
            price: Number(data.price),
            mileage: Number(data.mileage),
            specs: data.specs || {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("cars").add(carData);
        const car = { id: docRef.id, ...carData };

        revalidatePath("/admin/cars");
        revalidatePath("/");
        return { data: car, error: null };
    } catch (error) {
        console.error("Error creating car:", error);
        return { data: null, error: "Failed to create car" };
    }
}

export async function updateCar(id: string, data: any) {
    try {
        const updateData = {
            ...data,
            updatedAt: new Date().toISOString(),
        };
        // Clean undefined values
        if (data.year) updateData.year = Number(data.year);
        if (data.price) updateData.price = Number(data.price);
        if (data.mileage) updateData.mileage = Number(data.mileage);

        await adminDb.collection("cars").doc(id).update(updateData);

        // Fetch updated doc to return
        // Optimisation: just return merged data if needed, but fetching ensures accuracy
        const doc = await adminDb.collection("cars").doc(id).get();
        const car = mapDoc(doc);

        revalidatePath("/admin/cars");
        revalidatePath("/");
        return { data: car, error: null };
    } catch (error) {
        console.error("Error updating car:", error);
        return { data: null, error: "Failed to update car" };
    }
}

export async function deleteCar(id: string) {
    try {
        await adminDb.collection("cars").doc(id).delete();
        revalidatePath("/admin/cars");
        revalidatePath("/");
        return { success: true, error: null };
    } catch (error) {
        console.error("Error deleting car:", error);
        return { success: false, error: "Failed to delete car" };
    }
}

// --- ACCESSORIES ---

export async function getAccessories() {
    try {
        const snapshot = await adminDb.collection("accessories").orderBy("createdAt", "desc").get();
        const items = snapshot.docs.map(mapDoc);
        return { data: items, error: null };
    } catch (error) {
        console.error("Error fetching accessories:", error);
        return { data: [], error: "Failed to fetch accessories" };
    }
}

export async function createAccessory(data: any) {
    try {
        const itemData = {
            ...data,
            price: Number(data.price),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await adminDb.collection("accessories").add(itemData);
        const item = { id: docRef.id, ...itemData };

        revalidatePath("/admin/accessories");
        revalidatePath("/");
        return { data: item, error: null };
    } catch (error) {
        console.error("Error creating accessory:", error);
        return { data: null, error: "Failed to create accessory" };
    }
}

export async function updateAccessory(id: string, data: any) {
    try {
        const updateData = {
            ...data,
            updatedAt: new Date().toISOString(),
            price: data.price ? Number(data.price) : undefined,
        };

        await adminDb.collection("accessories").doc(id).update(updateData);
        const doc = await adminDb.collection("accessories").doc(id).get();
        const item = mapDoc(doc);

        revalidatePath("/admin/accessories");
        revalidatePath("/");
        return { data: item, error: null };
    } catch (error) {
        console.error("Error updating accessory:", error);
        return { data: null, error: "Failed to update accessory" };
    }
}

export async function deleteAccessory(id: string) {
    try {
        await adminDb.collection("accessories").doc(id).delete();
        revalidatePath("/admin/accessories");
        revalidatePath("/");
        return { success: true, error: null };
    } catch (error) {
        console.error("Error deleting accessory:", error);
        return { success: false, error: "Failed to delete accessory" };
    }
}

// --- TEST DRIVES ---

export async function createTestDrive(data: any) {
    try {
        const testDriveData = {
            ...data,
            createdAt: new Date().toISOString(),
            status: 'pending', // pending, contacted, completed
        };

        const docRef = await adminDb.collection("test_drives").add(testDriveData);
        // We don't need to revalidate public paths usually, but maybe admin dashboard
        revalidatePath("/admin/test-drives");
        return { success: true, error: null };
    } catch (error) {
        console.error("Error creating test drive request:", error);
        return { success: false, error: "Failed to submit request" };
    }
}

export async function getTestDrives() {
    try {
        const snapshot = await adminDb.collection("test_drives").orderBy("createdAt", "desc").get();
        const items = snapshot.docs.map(mapDoc);
        return { data: items, error: null };
    } catch (error) {
        console.error("Error fetching test drives:", error);
        return { data: [], error: "Failed to fetch test drives" };
    }
}
