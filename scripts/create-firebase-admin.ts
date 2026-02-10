
import { adminAuth } from "../src/lib/firebase/admin";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function createAdminUser() {
    const email = 'admin@nextlevel.com';
    const password = 'adminpassword123';

    try {
        // Check if user exists
        try {
            const user = await adminAuth.getUserByEmail(email);
            console.log("User already exists:", user.uid);
            return;
        } catch (e) {
            // User doesn't exist, proceed to create
        }

        const userRecord = await adminAuth.createUser({
            email: email,
            emailVerified: true,
            password: password,
            displayName: "Admin User",
            disabled: false,
        });

        console.log('Successfully created new user:', userRecord.uid);
    } catch (error) {
        console.log('Error creating new user:', error);
    }
}

createAdminUser();
