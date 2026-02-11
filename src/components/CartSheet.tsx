"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function CartSheet() {
    const { items, isOpen, closeCart, updateQuantity, removeItem, total } = useCart();

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-card/95 border-l-primary/20">
                <SheetHeader className="space-y-2.5 pr-6">
                    <SheetTitle className="text-2xl font-bold font-orbitron text-white flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                        Your Cart
                    </SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        Review your items before checkout.
                    </SheetDescription>
                </SheetHeader>

                <Separator className="my-4 bg-white/10" />

                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 text-center">
                            <div className="bg-white/5 p-4 rounded-full">
                                <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">Your cart is empty</h3>
                                <p className="text-muted-foreground">Looks like you haven't added any accessories yet.</p>
                            </div>
                            <Button variant="outline" onClick={closeCart} className="mt-4 border-primary/50 text-white hover:bg-primary hover:text-white">
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-white/10 bg-background/50">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            unoptimized={item.image.includes('supabase.co')}
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-medium text-white line-clamp-2">{item.name}</h4>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-red-500 hover:bg-transparent -mr-2"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="font-bold text-primary">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </p>
                                            <div className="flex items-center gap-2 bg-white/5 rounded-full px-2 py-1 border border-white/10">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-full hover:bg-white/10 text-white"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm font-medium w-4 text-center text-white">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 rounded-full hover:bg-white/10 text-white"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="pt-6 mt-auto">
                        <Separator className="mb-4 bg-white/10" />
                        <div className="space-y-4">
                            <div className="flex justify-between text-base font-medium text-white">
                                <span>Total Amount</span>
                                <span className="text-xl font-bold text-primary">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12" asChild onClick={closeCart}>
                                <Link href="/checkout">
                                    Proceed to Checkout
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
