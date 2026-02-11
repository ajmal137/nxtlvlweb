"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Package } from "lucide-react";


import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { itemCount, openCart } = useCart();
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-white hover:text-primary hover:bg-white/10"
                        onClick={openCart}
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-in zoom-in">
                                {itemCount}
                            </span>
                        )}
                    </Button>

                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-card/95 border-l-primary/20">
                                <SheetTitle className="hidden">Navigation Menu</SheetTitle>
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

                                    <div className="h-px bg-white/10 my-2" />

                                    {user ? (
                                        <>
                                            <Link href="/my-orders" className="text-lg font-bold text-white hover:text-primary uppercase flex items-center gap-2">
                                                <Package className="h-5 w-5" />
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={() => logout()}
                                                className="text-lg font-bold text-red-500 hover:text-red-400 uppercase flex items-center gap-2 text-left"
                                            >
                                                <LogOut className="h-5 w-5" />
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <Link href="/login" className="text-lg font-bold text-primary hover:text-primary/80 uppercase flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Sign In
                                        </Link>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/10">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-primary">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="text-white text-sm hidden md:block font-medium">
                                        {user.displayName ? user.displayName.split(' ')[0] : 'User'}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-card border-white/10 text-white">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                                    <Link href="/my-orders" className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        <span>My Orders</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                    className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer flex items-center gap-2"
                                    onClick={() => logout()}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
