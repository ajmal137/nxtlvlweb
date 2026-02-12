"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import { Filter, X } from "lucide-react";

interface CarFiltersProps {
    maxPrice: number;
    brands: string[];
}

export default function CarFilters({ maxPrice, brands }: CarFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Current filter values from URL
    const currentMinPrice = Number(searchParams.get("minPrice")) || 0;
    const currentMaxPrice = Number(searchParams.get("maxPrice")) || maxPrice;
    const currentBrand = searchParams.get("brand");

    // Local state for the slider to ensure smooth dragging
    const [localRange, setLocalRange] = useState([currentMinPrice, currentMaxPrice]);

    // Sync local state with URL params (e.g., when Reset is clicked)
    useEffect(() => {
        setLocalRange([currentMinPrice, currentMaxPrice]);
    }, [currentMinPrice, currentMaxPrice]);

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    const handlePriceCommit = (values: number[]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", values[0].toString());
        params.set("maxPrice", values[1].toString());

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    const handleReset = () => {
        startTransition(() => {
            router.push(pathname, { scroll: false });
        });
    };

    const filterContent = (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider font-orbitron">Filters</h3>
                {(currentBrand || currentMinPrice > 0 || currentMaxPrice < maxPrice) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-primary hover:text-primary/80 h-auto p-0 flex items-center gap-1"
                    >
                        <X className="h-3 w-3" /> Reset
                    </Button>
                )}
            </div>

            {/* Price Range */}
            <div className="space-y-5">
                <div className="flex justify-between items-center">
                    <Label className="text-white text-sm font-medium uppercase tracking-widest opacity-70">Price Range</Label>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded">₹{localRange[0].toLocaleString('en-IN')}</span>
                    <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded">₹{localRange[1].toLocaleString('en-IN')}</span>
                </div>
                <Slider
                    defaultValue={[currentMinPrice, currentMaxPrice]}
                    value={localRange}
                    max={maxPrice}
                    min={0}
                    step={1000}
                    onValueChange={setLocalRange}
                    onValueCommit={handlePriceCommit}
                    className="[&>.relative>.absolute]:bg-primary"
                />
            </div>

            {/* Brands */}
            <div className="space-y-4 flex-grow">
                <Label className="text-white text-sm font-medium uppercase tracking-widest opacity-70">Brands</Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-3 group">
                            <Checkbox
                                id={`brand-${brand}`}
                                checked={currentBrand === brand}
                                onCheckedChange={(checked) => {
                                    updateFilter("brand", checked ? brand : null);
                                }}
                                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label
                                htmlFor={`brand-${brand}`}
                                className={`text-sm font-medium cursor-pointer transition-colors ${currentBrand === brand ? "text-primary" : "text-muted-foreground group-hover:text-white"
                                    }`}
                            >
                                {brand}
                            </label>
                        </div>
                    ))}
                    {brands.length === 0 && (
                        <p className="text-xs text-muted-foreground italic">No brands available</p>
                    )}
                </div>
            </div>

            {isPending && (
                <div className="text-[10px] text-primary animate-pulse uppercase tracking-widest font-bold text-center">
                    Updating results...
                </div>
            )}
        </div>
    );

    return (
        <div className="h-fit sticky top-24">
            {/* Desktop View */}
            <div className="hidden md:block bg-card/30 p-6 rounded-xl border border-white/5 backdrop-blur-sm shadow-xl">
                {filterContent}
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full border-primary/50 text-white hover:bg-primary/10 h-12 rounded-xl backdrop-blur-sm">
                            <Filter className="mr-2 h-4 w-4 text-primary" />
                            {currentBrand ? `Filter: ${currentBrand}` : "Filter Vehicles"}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full sm:w-[350px] bg-card border-r-white/10 p-6 pt-10">
                        <SheetHeader className="hidden">
                            <SheetTitle>Filters</SheetTitle>
                            <SheetDescription>Refine car search</SheetDescription>
                        </SheetHeader>
                        {filterContent}
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
