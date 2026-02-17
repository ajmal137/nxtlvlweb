"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrder, getSettings, updateOrderStatus } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Copy, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PaymentPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [upiId, setUpiId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!orderId) return;

            try {
                const [orderRes, settingsRes] = await Promise.all([
                    getOrder(orderId),
                    getSettings()
                ]);

                if (orderRes.error || !orderRes.data) {
                    setError(orderRes.error || "Order not found");
                } else {
                    setOrder(orderRes.data);
                }

                if (settingsRes.data?.upiId) {
                    setUpiId(settingsRes.data.upiId);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load payment details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container max-w-md mx-auto py-12 px-4">
                <Card className="bg-destructive/10 border-destructive/20">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                        <CardDescription className="text-destructive/80">{error}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">Return Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // QR Code URL Generation
    const upiUrl = `upi://pay?pa=${upiId}&pn=NextLevel&am=${order.totalAmount}&tn=Order-${orderId.slice(0, 8)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

    return (
        <div className="container max-w-xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-white mb-8 text-center font-orbitron">Complete Payment</h1>

            <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white">₹{order.totalAmount.toLocaleString('en-IN')}</CardTitle>
                    <CardDescription>Order #{orderId.slice(0, 8)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {upiId ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="bg-white p-4 rounded-xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={qrCodeUrl}
                                    alt="UPI QR Code"
                                    className="w-64 h-64 object-contain"
                                />
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                <span>UPI ID:</span>
                                <span className="text-white font-mono">{upiId}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 ml-1 hover:text-white"
                                    onClick={() => {
                                        navigator.clipboard.writeText(upiId);
                                        // Optional: toast notification
                                    }}
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>

                            <p className="text-center text-sm text-muted-foreground max-w-xs">
                                Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.) to pay.
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-yellow-500 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <p>UPI details not configured by admin.</p>
                            <p className="text-sm mt-2 opacity-80">Please contact support or pay via cash.</p>
                        </div>
                    )}

                    <div className="border-t border-white/10 pt-4">
                        <h4 className="text-sm font-medium text-white mb-2">Order Summary</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            {order.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                            <div className="flex justify-between pt-2 mt-2 border-t border-white/5 font-medium text-white">
                                <span>Total</span>
                                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                        onClick={async () => {
                            setLoading(true);
                            await updateOrderStatus(orderId, 'payment_pending_confirmation');
                            router.push('/');
                        }}
                    >
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        I have made the payment
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white"
                        onClick={async () => {
                            setLoading(true);
                            await updateOrderStatus(orderId, 'pending_payment');
                            router.push('/');
                        }}
                    >
                        I'll pay later
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
