"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


// --- CARS ---

export async function getCars() {
    try {
        console.log("Fetching cars from database...");
        const cars = await prisma.car.findMany({
            orderBy: { createdAt: "desc" },
        });
        console.log(`Successfully fetched ${cars.length} cars.`);
        return { data: cars, error: null };
    } catch (error) {
        console.error("Error fetching cars:", error);
        // Log environment variable status (without revealing value)
        console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
        return { data: [], error: "Failed to fetch cars" };
    }
}

export async function createCar(data: any) {
    try {
        // Basic validation could happen here
        const car = await prisma.car.create({
            data: {
                ...data,
                year: Number(data.year),
                price: Number(data.price),
                mileage: Number(data.mileage),
                specs: data.specs || {},
            },
        });
        revalidatePath("/admin/cars");
        revalidatePath("/");
        return { data: car, error: null };
    } catch (error) {
        console.error("Error creating car:", error);
        return { data: null, error: "Failed to create car" };
    }
}

export async function updateCar(id: number, data: any) {
    try {
        const car = await prisma.car.update({
            where: { id },
            data: {
                ...data,
                year: data.year ? Number(data.year) : undefined,
                price: data.price ? Number(data.price) : undefined,
                mileage: data.mileage ? Number(data.mileage) : undefined,
            },
        });
        revalidatePath("/admin/cars");
        revalidatePath("/");
        return { data: car, error: null };
    } catch (error) {
        console.error("Error updating car:", error);
        return { data: null, error: "Failed to update car" };
    }
}

export async function deleteCar(id: number) {
    try {
        await prisma.car.delete({
            where: { id },
        });
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
        const items = await prisma.accessory.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { data: items, error: null };
    } catch (error) {
        console.error("Error fetching accessories:", error);
        return { data: [], error: "Failed to fetch accessories" };
    }
}

export async function createAccessory(data: any) {
    try {
        const item = await prisma.accessory.create({
            data: {
                ...data,
                price: Number(data.price),
            },
        });
        revalidatePath("/admin/accessories");
        revalidatePath("/");
        return { data: item, error: null };
    } catch (error) {
        console.error("Error creating accessory:", error);
        return { data: null, error: "Failed to create accessory" };
    }
}

export async function updateAccessory(id: number, data: any) {
    try {
        const item = await prisma.accessory.update({
            where: { id },
            data: {
                ...data,
                price: data.price ? Number(data.price) : undefined,
            },
        });
        revalidatePath("/admin/accessories");
        revalidatePath("/");
        return { data: item, error: null };
    } catch (error) {
        console.error("Error updating accessory:", error);
        return { data: null, error: "Failed to update accessory" };
    }
}

export async function deleteAccessory(id: number) {
    try {
        await prisma.accessory.delete({
            where: { id },
        });
        revalidatePath("/admin/accessories");
        revalidatePath("/");
        return { success: true, error: null };
    } catch (error) {
        console.error("Error deleting accessory:", error);
        return { success: false, error: "Failed to delete accessory" };
    }
}
