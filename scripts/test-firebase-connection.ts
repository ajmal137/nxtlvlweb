
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { adminDb } from "../src/lib/firebase/admin";

async function main() {
    console.log("🔥 Testing Firebase Connection...");

    try {
        const testCollection = adminDb.collection("test_connection");

        // Write test
        const docRef = await testCollection.add({
            timestamp: new Date().toISOString(),
            message: "Hello Firebase!"
        });
        console.log("✅ Write Successful! Doc ID:", docRef.id);

        // Read test
        const doc = await docRef.get();
        console.log("✅ Read Successful! Data:", doc.data());

        // Cleanup
        await docRef.delete();
        console.log("✅ Delete Successful!");

        console.log("🎉 Firebase Admin SDK is correctly configured!");
    } catch (error) {
        console.error("❌ Firebase Connection Failed:");
        console.error(error);
    }
}

main();
