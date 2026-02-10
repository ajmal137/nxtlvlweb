"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Package, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/cars", label: "Car Inventory", icon: Car },
        { href: "/admin/accessories", label: "Accessories", icon: Package },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-white/10 hidden md:flex flex-col fixed inset-y-0">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-orbitron font-bold text-white tracking-wider">
                        NEXT <span className="text-primary">LEVEL</span>
                        <span className="block text-xs font-sans font-normal text-muted-foreground mt-1">Admin Panel</span>
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link key={item.href} href={item.href} className="block">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 text-base h-12",
                                        isActive
                                            ? "bg-primary text-primary-foreground font-bold"
                                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={async () => {
                            await fetch("/api/logout", { method: "POST" });
                            window.location.href = "/admin/login";
                        }}
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
