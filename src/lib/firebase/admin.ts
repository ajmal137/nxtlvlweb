
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// You will need to store your Service Account key as an environment variable
// or use Google Application Default Credentials if running in a supported environment.
// For Vercel/Local, environment variables are best.


let serviceAccount: any;


try {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (key) {
        serviceAccount = JSON.parse(key);
        // Fix private_key newlines if they are escaped
        if (serviceAccount && serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
    }
} catch (error) {
    console.error("FAILED TO PARSE FIREBASE_SERVICE_ACCOUNT_KEY", error);
}

// Fallback to file if environment variable failed or was missing
if (!serviceAccount) {
    try {
        // Dynamic require to avoid bundling issues if not needed
        const path = require('path');
        const fs = require('fs');
        const filePath = path.resolve(process.cwd(), 'service-account.json');

        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            serviceAccount = JSON.parse(fileContent);
            console.log("Loaded Firebase Service Account from file: service-account.json");
        }
    } catch (e) {
        console.warn("Failed to load service-account.json fallback", e);
    }
}


if (!getApps().length) {
    if (serviceAccount) {
        initializeApp({
            credential: cert(serviceAccount),
        });
    } else {
        // Prevent build from crashing if we are just linting or typechecking, 
        // but robustly warn. 
        // However, Next.js build tries to render static pages, so we might need to mock or fail.
        if (process.env.NODE_ENV === 'production') {
            console.error("🔥 FIREBASE ADMIN INIT FAILED: No service account found. Check FIREBASE_SERVICE_ACCOUNT_KEY env var.");
            // Throwing here might break build, but that is better than runtime errors later
            throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is missing or invalid.");
        } else {
            console.warn("⚠️ FIREBASE ADMIN INIT SKIPPED: No service account.");
        }
    }
}

const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };
