"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Loader2, CreditCard, Banknote } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Simple divs used for selection instead of RadioGroup to be faster and cleaner without installing radix
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        customerName: user?.displayName || "",
        phone: "",
        address: "",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI'>('CASH');

    // Redirect if cart is empty and not just placed an order
    useEffect(() => {
        if (items.length === 0 && !orderSuccess) {
            router.push("/#accessories");
        }
    }, [items, orderSuccess, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createOrder({
                ...formData,
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                totalAmount: total,
                userId: user?.uid || null,
                paymentMethod,
            });

            if (result.success && result.orderId) {
                if (paymentMethod === 'UPI') {
                    router.push(`/checkout/payment/${result.orderId}`);
                    return;
                }
                setOrderId(result.orderId);
                setOrderSuccess(true);
                clearCart();
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6 bg-card/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Order Placed!</h1>
                        <p className="text-muted-foreground">
                            Thank you for your purchase. Your order ID is <span className="text-primary font-mono font-bold">#{orderId?.slice(0, 8)}</span>.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            We will contact you shortly to confirm delivery details.
                        </p>
                    </div>
                    <div className="pt-4">
                        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
                            <Link href="/">
                                Return to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-white mb-8 font-orbitron">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Form Section */}
                <div className="space-y-8">
                    <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            1. Delivery Details
                        </h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName" className="text-white">Full Name</Label>
                                <Input
                                    id="customerName"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="bg-white/5 border-white/10 text-white focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 98765 43210"
                                    className="bg-white/5 border-white/10 text-white focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-white">Shipping Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full address"
                                    className="bg-white/5 border-white/10 text-white focus:border-primary min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pincode" className="text-white">PIN Code</Label>
                                <Input
                                    id="pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                    placeholder="679334"
                                    className="bg-white/5 border-white/10 text-white focus:border-primary"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <Label className="text-white">Payment Method</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPaymentMethod('CASH')}
                                        className={cn(
                                            "cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all",
                                            paymentMethod === 'CASH'
                                                ? "bg-primary/20 border-primary text-primary"
                                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                                        )}
                                    >
                                        <Banknote className="h-6 w-6" />
                                        <span className="font-medium">Cash on Delivery</span>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod('UPI')}
                                        className={cn(
                                            "cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all",
                                            paymentMethod === 'UPI'
                                                ? "bg-primary/20 border-primary text-primary"
                                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                                        )}
                                    >
                                        <CreditCard className="h-6 w-6" />
                                        <span className="font-medium">UPI Payment</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="space-y-8">
                    <div className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-fit sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            2. Order Summary
                        </h2>

                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-background">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            unoptimized={item.image.includes('supabase.co')}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-white line-clamp-1">{item.name}</h4>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-white text-sm">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Shipping</span>
                                <span className="text-green-500">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                                <span>Total</span>
                                <span className="text-primary">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            form="checkout-form"
                            className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Place Order <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div >
        </div >
    );
}
