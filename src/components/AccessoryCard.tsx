"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface AccessoryProps {
    accessory: {
        id: number;
        name: string;
        price: number;
        image: string;
    };
}

export default function AccessoryCard({ accessory }: AccessoryProps) {
    return (
        <Card className="group overflow-hidden border-white/10 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
            <div className="relative aspect-square overflow-hidden bg-background">
                <Image
                    src={accessory.image}
                    alt={accessory.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={accessory.image.includes('supabase.co')}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-primary text-white rounded-full">
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <CardHeader className="p-4 space-y-1">
                <div className="flex justify-between items-start flex-col gap-2">
                    <div className="w-full">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Accessory</h3>
                        <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">{accessory.name}</h2>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <p className="text-lg font-bold text-primary">${accessory.price.toFixed(2)}</p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white cursor-pointer transition-colors">
                                Quick View
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardFooter className="p-4 border-t border-white/10">
                <Button className="w-full bg-white/5 hover:bg-primary text-white border-0 transition-colors">
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
