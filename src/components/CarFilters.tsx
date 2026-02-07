"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";

export default function CarFilters() {
    const [priceRange, setPriceRange] = useState([10000, 500000]);
    const [mileageRange, setMileageRange] = useState([0, 100000]);

    const brands = ["Tesla", "Porsche", "Mercedes-AMG", "Audi", "BMW", "Ferrari", "Lamborghini"];

    return (
        <div className="space-y-8 bg-card/30 p-6 rounded-lg border border-white/5 backdrop-blur-sm h-fit sticky top-24">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Filters</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                    Reset
                </Button>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-white">Price Range</Label>
                    <span className="text-xs text-primary font-mono">${priceRange[0].toLocaleString('en-US')} - ${priceRange[1].toLocaleString('en-US')}</span>
                </div>
                <Slider
                    defaultValue={[10000, 500000]}
                    max={500000}
                    step={1000}
                    onValueChange={setPriceRange}
                    className="[&>.relative>.absolute]:bg-primary"
                />
            </div>

            {/* Mileage */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-white">Mileage</Label>
                    <span className="text-xs text-primary font-mono">{mileageRange[0].toLocaleString('en-US')} - {mileageRange[1].toLocaleString('en-US')} mi</span>
                </div>
                <Slider
                    defaultValue={[0, 100000]}
                    max={100000}
                    step={1000}
                    onValueChange={setMileageRange}
                    className="[&>.relative>.absolute]:bg-primary"
                />
            </div>

            {/* Brands */}
            <div className="space-y-3">
                <Label className="text-white">Brands</Label>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                            <Checkbox id={brand} className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                            <label
                                htmlFor={brand}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground hover:text-white cursor-pointer transition-colors"
                            >
                                {brand}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Trigger (Hidden on Desktop) */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                            <Filter className="mr-2 h-4 w-4" /> Filter Vehicles
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-card border-r-white/10">
                        <SheetHeader>
                            <SheetTitle className="text-white">Filter Options</SheetTitle>
                            <SheetDescription>
                                Refine your search to find the perfect vehicle.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="py-4 space-y-8">
                            {/* Duplicate controls for mobile sheet */}
                            <div className="space-y-4">
                                <Label className="text-white">Price Range</Label>
                                <Slider
                                    defaultValue={[10000, 500000]}
                                    max={500000}
                                    step={1000}
                                    className="[&>.relative>.absolute]:bg-primary"
                                />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
