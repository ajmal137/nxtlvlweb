
import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        // Verify the ID token first
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        // Create session cookie (5 days)
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn,
        });

        const cookieStore = await cookies();
        cookieStore.set("session", sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return NextResponse.json({ status: "success" });
    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
