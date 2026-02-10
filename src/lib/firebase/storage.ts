
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./client";

export async function uploadImage(file: File, path?: string): Promise<{ url: string | null; error: string | null }> {
    try {
        const timestamp = Date.now();
        // Create a safe filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const filePath = path ? `${path}/${timestamp}-${safeName}` : `uploads/${timestamp}-${safeName}`;

        const storageRef = ref(storage, filePath);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const url = await getDownloadURL(snapshot.ref);

        return { url, error: null };
    } catch (error: any) {
        console.error("Error uploading image:", error);
        return { url: null, error: error.message || "Failed to upload image" };
    }
}
