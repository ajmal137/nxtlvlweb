"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Car, Fuel, Gauge, Calendar, Navigation } from "lucide-react";
import { motion } from "framer-motion";

interface VehicleProps {
    vehicle: {
        id: string;
        brand: string;
        model: string;
        year: number;
        price: number;
        mileage: number;
        image: string;
        specs: {
            acceleration?: string;
            topSpeed?: string;
            range?: string;
            power?: string;
        };
    };
}


import { useState } from "react";
import { createTestDrive } from "@/lib/actions";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function VehicleCard({ vehicle }: VehicleProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            vehicleId: vehicle.id,
            vehicleModel: `${vehicle.brand} ${vehicle.model}`,
            name: formData.get("name"),
            phone: formData.get("phone"),
            date: formData.get("date"),
        };

        const result = await createTestDrive(data);

        setLoading(false);
        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
            }, 3000);
        }
    };

    return (
        <Card className="group overflow-hidden border-white/10 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={vehicle.image}
                    alt={vehicle.model}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={vehicle.image.includes('supabase.co')}
                />
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-white border-white/10">
                        {vehicle.year}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 space-y-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{vehicle.brand}</h3>
                        <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{vehicle.model}</h2>
                    </div>
                    <p className="text-lg font-bold text-primary">₹{vehicle.price.toLocaleString('en-IN')}</p>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-primary" />
                        <span>{vehicle.mileage.toLocaleString('en-IN')} mi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{vehicle.year}</span>
                    </div>
                    {vehicle.specs.acceleration && (
                        <div className="flex items-center gap-2">
                            <Fuel className="w-4 h-4 text-primary" />
                            <span>{vehicle.specs.acceleration}</span>
                        </div>
                    )}
                    {vehicle.specs.topSpeed && (
                        <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-primary" />
                            <span>{vehicle.specs.topSpeed}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 border-t border-white/10 flex gap-2">
                <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 hover:text-white">
                    Details
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex-1 bg-primary hover:bg-primary/90 text-white border-0">
                            Test Drive
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-white/10 text-white sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Request a Test Drive</DialogTitle>
                            <DialogDescription>
                                Experience the {vehicle.brand} {vehicle.model} firsthand. Fill out the form below to schedule your appointment.
                            </DialogDescription>
                        </DialogHeader>

                        {success ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Request Sent!</h3>
                                    <p className="text-muted-foreground">We'll contact you shortly to confirm your appointment.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label htmlFor="name" className="text-right text-sm font-medium">
                                            Name
                                        </label>
                                        <input
                                            name="name"
                                            id="name"
                                            required
                                            className="col-span-3 flex h-9 w-full rounded-md border border-white/10 bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label htmlFor="phone" className="text-right text-sm font-medium">
                                            Phone
                                        </label>
                                        <input
                                            name="phone"
                                            id="phone"
                                            type="tel"
                                            required
                                            className="col-span-3 flex h-9 w-full rounded-md border border-white/10 bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label htmlFor="date" className="text-right text-sm font-medium">
                                            Date
                                        </label>
                                        <input
                                            name="date"
                                            id="date"
                                            type="date"
                                            required
                                            className="col-span-3 flex h-9 w-full rounded-md border border-white/10 bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Schedule Now
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
