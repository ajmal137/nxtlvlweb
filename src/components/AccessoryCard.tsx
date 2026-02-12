"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, LayoutGrid } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface AccessoryProps {
    accessory: {
        id: string;
        name: string;
        price: number;
        image: string;
    };
}

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function AccessoryCard({ accessory }: AccessoryProps) {
    const { addItem } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const handleAddToCart = () => {
        if (!user) {
            router.push("/login");
        } else {
            addItem({
                id: accessory.id,
                name: accessory.name,
                price: accessory.price,
                image: accessory.image
            });
        }
    };

    return (
        <Card className="group overflow-hidden border-white/10 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden bg-background">
                <Image
                    src={accessory.image}
                    alt={accessory.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={accessory.image.includes('supabase.co')}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="bg-white/10 hover:bg-primary text-white hover:text-primary-foreground rounded-full"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <CardHeader className="p-4 space-y-3 flex-grow">
                <div className="space-y-1">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Accessory</h3>
                    <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight">
                        {accessory.name}
                    </h2>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                    <p className="text-xl font-bold text-primary">
                        ₹{accessory.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Badge
                                variant="outline"
                                className="w-fit border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors py-1.5 px-3 flex items-center gap-1.5"
                            >
                                <LayoutGrid className="h-3 w-3" /> Quick View
                            </Badge>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-white/10 text-white sm:max-w-2xl overflow-hidden">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold font-orbitron">{accessory.name}</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Premium quality accessory for your vehicle.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-background border border-white/5">
                                    <Image
                                        src={accessory.image}
                                        alt={accessory.name}
                                        fill
                                        className="object-cover"
                                        unoptimized={accessory.image.includes('supabase.co')}
                                    />
                                </div>
                                <div className="flex flex-col justify-between py-2">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Price</p>
                                            <p className="text-3xl font-bold text-primary">
                                                ₹{accessory.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Availability</p>
                                            <p className="text-green-500 flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> In Stock
                                            </p>
                                        </div>
                                        <div className="space-y-2 pt-2">
                                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium text-white/50">Details</p>
                                            <p className="text-white/80 leading-relaxed text-sm">
                                                This premium {accessory.name.toLowerCase()} is designed for durability and style. Enhance your driving experience with our curated selection of high-end accessories.
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 uppercase tracking-wide"
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full bg-white/5 hover:bg-primary text-white hover:text-primary-foreground border-0 transition-colors"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
