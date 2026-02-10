import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";


export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session");

    // Check if the user is accessing a protected route
    if (request.nextUrl.pathname.startsWith("/admin")) {
        // Allow access to login page
        if (request.nextUrl.pathname === "/admin/login") {
            // But if already logged in, redirect to dashboard
            if (session) {
                return NextResponse.redirect(new URL("/admin/dashboard", request.url));
            }
            return NextResponse.next();
        }

        // Redirect to login if no session cookie
        if (!session) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
