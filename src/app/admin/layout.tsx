"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Package, LogOut, LayoutDashboard, Calendar, ShoppingBag, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const isLoginPage = pathname === "/admin/login";

    // Close mobile menu when pathname changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const navItems = [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { href: "/admin/cars", label: "Car Inventory", icon: Car },
        { href: "/admin/accessories", label: "Accessories", icon: Package },
        { href: "/admin/test-drives", label: "Test Drives", icon: Calendar },
    ];

    if (isLoginPage) {
        return <div className="min-h-screen bg-background">{children}</div>;
    }

    const NavigationContent = ({ onClick }: { onClick?: () => void }) => (
        <>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href} className="block" onClick={onClick}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 text-base h-12 md:h-10",
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
        </>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center h-16 px-4 bg-card border-b border-white/10 sticky top-0 z-40">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white -ml-2">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 bg-card border-r border-white/10">
                        <SheetTitle className="hidden">Admin Navigation</SheetTitle>
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-orbitron font-bold text-white tracking-wider">
                                NEXT <span className="text-primary">LEVEL</span>
                            </h2>
                        </div>
                        <div className="flex flex-col h-[calc(100%-80px)]">
                            <NavigationContent onClick={() => setOpen(false)} />
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="flex-1 text-center font-orbitron text-sm font-bold text-white tracking-widest uppercase ml-[-24px]">
                    Admin Panel
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-card border-r border-white/10 hidden md:flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-orbitron font-bold text-white tracking-wider">
                        NEXT <span className="text-primary">LEVEL</span>
                        <span className="block text-xs font-sans font-normal text-muted-foreground mt-1">Admin Panel</span>
                    </h2>
                </div>
                <NavigationContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto min-h-[calc(100vh-64px)] md:min-h-screen">
                {children}
            </main>
        </div>
    );
}
