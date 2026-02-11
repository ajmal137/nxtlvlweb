"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";


import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-12 w-auto">
                        <Image
                            src="/transparent-logo.png"
                            alt="Next Level Auto Deals & Accessories"
                            width={150}
                            height={60}
                            className="object-contain h-full w-auto"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 font-orbitron tracking-wide">
                    <Link href="#vehicles" className="text-sm font-bold text-white hover:text-primary transition-colors uppercase">
                        Vehicles
                    </Link>
                    <Link href="#accessories" className="text-sm font-bold text-white hover:text-primary transition-colors uppercase">
                        Accessories
                    </Link>
                    <Link href="#financing" className="text-sm font-bold text-white hover:text-primary transition-colors uppercase">
                        Financing
                    </Link>
                    <Link href="#about" className="text-sm font-bold text-white hover:text-primary transition-colors uppercase">
                        About
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10 hidden sm:flex">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10">
                        <ShoppingBag className="h-5 w-5" />
                    </Button>

                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-card/95 border-l-primary/20">
                                <div className="flex flex-col gap-6 mt-10 font-orbitron">
                                    <Link href="#vehicles" className="text-lg font-bold text-white hover:text-primary uppercase">
                                        Vehicles
                                    </Link>
                                    <Link href="#accessories" className="text-lg font-bold text-white hover:text-primary uppercase">
                                        Accessories
                                    </Link>
                                    <Link href="#financing" className="text-lg font-bold text-white hover:text-primary uppercase">
                                        Financing
                                    </Link>
                                    <Link href="#about" className="text-lg font-bold text-white hover:text-primary uppercase">
                                        About
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-white text-sm hidden md:block">
                                Hi, <span className="text-primary font-bold">{user.displayName ? user.displayName.split(' ')[0] : 'User'}</span>
                            </span>
                            <Button
                                onClick={() => logout()}
                                className="hidden md:flex bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold font-orbitron tracking-wider border-0 uppercase"
                            >
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-orbitron tracking-wider border-0 uppercase">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
