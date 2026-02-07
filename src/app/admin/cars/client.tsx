"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, ImageIcon } from "lucide-react";
import { createCar, updateCar, deleteCar } from "@/lib/actions";
import { uploadImage } from "@/lib/supabase/storage";

// Simple type definition based on Prisma model
type Car = {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    image: string;
    specs?: any;
};

export default function CarInventoryClient({ initialCars }: { initialCars: Car[] }) {
    const [cars, setCars] = useState<Car[]>(initialCars);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        image: "",
    });

    const handleOpenDialog = (car?: Car) => {
        setPreviewUrl(null);
        setSelectedFile(null);
        if (car) {
            setEditingCar(car);
            setFormData({
                brand: car.brand,
                model: car.model,
                year: car.year,
                price: car.price,
                mileage: car.mileage,
                image: car.image,
            });
            setPreviewUrl(car.image);
        } else {
            setEditingCar(null);
            setFormData({
                brand: "",
                model: "",
                year: new Date().getFullYear(),
                price: 0,
                mileage: 0,
                image: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let imageUrl = formData.image;

        // Upload image if a new file is selected
        if (selectedFile) {
            setUploading(true);
            const { url, error } = await uploadImage(selectedFile);
            setUploading(false);

            if (error) {
                alert("Failed to upload image: " + error);
                setLoading(false);
                return;
            }
            if (url) {
                imageUrl = url;
            }
        }

        const submitData = { ...formData, image: imageUrl };

        if (editingCar) {
            const { data, error } = await updateCar(editingCar.id, submitData);
            if (error) {
                alert("Failed to update car: " + error);
            } else if (data) {
                setCars(cars.map((c) => (c.id === editingCar.id ? (data as Car) : c)));
                setIsDialogOpen(false);
            }
        } else {
            const { data, error } = await createCar(submitData);
            if (error) {
                alert("Failed to create car: " + error);
            } else if (data) {
                setCars([data as Car, ...cars]);
                setIsDialogOpen(false);
            }
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this vehicle?")) {
            const { success, error } = await deleteCar(id);
            if (success) {
                setCars(cars.filter((c) => c.id !== id));
            } else {
                alert("Failed to delete car: " + error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-wider">
                        Vehicle Inventory
                    </h1>
                    <p className="text-muted-foreground">Manage your car listings.</p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-primary text-primary-foreground font-bold font-orbitron hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
            </div>

            <div className="rounded-md border border-white/10 bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-white w-[100px]">Image</TableHead>
                            <TableHead className="text-white">Brand</TableHead>
                            <TableHead className="text-white">Model</TableHead>
                            <TableHead className="text-white">Year</TableHead>
                            <TableHead className="text-white">Price</TableHead>
                            <TableHead className="text-white text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cars.map((car) => (
                            <TableRow key={car.id} className="border-white/10 hover:bg-white/5">
                                <TableCell>
                                    <div className="relative h-12 w-20 rounded overflow-hidden bg-muted">
                                        {car.image ? (
                                            <Image
                                                src={car.image}
                                                alt={car.model}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-white">{car.brand}</TableCell>
                                <TableCell className="text-muted-foreground">{car.model}</TableCell>
                                <TableCell className="text-muted-foreground">{car.year}</TableCell>
                                <TableCell className="font-mono text-primary">
                                    ₹{car.price.toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleOpenDialog(car)}
                                        className="hover:text-primary hover:bg-primary/10"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(car.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {cars.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No vehicles found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-card border-white/10 sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {editingCar ? "Edit Vehicle" : "Add New Vehicle"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCar
                                ? "Update vehicle details below."
                                : "Enter new vehicle details below."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="brand" className="text-right text-white">
                                Brand
                            </Label>
                            <Input
                                id="brand"
                                value={formData.brand}
                                onChange={(e) =>
                                    setFormData({ ...formData, brand: e.target.value })
                                }
                                className="col-span-3 bg-background/50 border-white/10"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="model" className="text-right text-white">
                                Model
                            </Label>
                            <Input
                                id="model"
                                value={formData.model}
                                onChange={(e) =>
                                    setFormData({ ...formData, model: e.target.value })
                                }
                                className="col-span-3 bg-background/50 border-white/10"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="year" className="text-right text-white">
                                Year
                            </Label>
                            <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({ ...formData, year: Number(e.target.value) })
                                }
                                className="col-span-3 bg-background/50 border-white/10"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right text-white">
                                Price
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({ ...formData, price: Number(e.target.value) })
                                }
                                className="col-span-3 bg-background/50 border-white/10"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mileage" className="text-right text-white">
                                Mileage
                            </Label>
                            <Input
                                id="mileage"
                                type="number"
                                value={formData.mileage}
                                onChange={(e) =>
                                    setFormData({ ...formData, mileage: Number(e.target.value) })
                                }
                                className="col-span-3 bg-background/50 border-white/10"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right text-white pt-2">
                                Image
                            </Label>
                            <div className="col-span-3 space-y-4">
                                <div className="relative aspect-video rounded-lg border-2 border-dashed border-white/10 overflow-hidden bg-background/50 flex flex-col items-center justify-center group hover:border-primary/50 transition-colors">
                                    {previewUrl ? (
                                        <>
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => document.getElementById('image-upload')?.click()}
                                                >
                                                    <Upload className="w-4 h-4 mr-2" /> Change Image
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            className="flex flex-col items-center cursor-pointer"
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                        >
                                            <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground italic">Click to upload from computer</p>
                                        </div>
                                    )}
                                </div>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <div className="flex gap-2 items-center">
                                    <span className="text-xs text-muted-foreground">Or paste URL:</span>
                                    <Input
                                        id="image"
                                        value={formData.image}
                                        onChange={(e) => {
                                            setFormData({ ...formData, image: e.target.value });
                                            setPreviewUrl(e.target.value);
                                        }}
                                        className="h-8 text-xs bg-background/50 border-white/10"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : editingCar ? "Save Changes" : "Add Vehicle"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
