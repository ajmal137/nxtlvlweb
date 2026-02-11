"use client";

import { useEffect, useState } from "react";
import { getUserOrders } from "@/lib/actions";
import { useAuth } from "@/context/AuthContext";
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";

export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.uid) {
                setLoading(true);
                const { data, error } = await getUserOrders(user.uid);
                if (error) {
                    console.error(error);
                } else {
                    setOrders(data);
                }
                setLoading(false);
            } else if (!authLoading && !user) {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, authLoading]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
            case "processing": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
            case "completed": return "bg-green-500/20 text-green-500 border-green-500/50";
            case "cancelled": return "bg-red-500/20 text-red-500 border-red-500/50";
            default: return "bg-gray-500/20 text-gray-500";
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-20 text-center space-y-4">
                <h1 className="text-3xl font-bold font-orbitron text-white">My Orders</h1>
                <p className="text-muted-foreground">Please sign in to view your orders.</p>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                    <Link href="/login">Sign In</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen">
            <h1 className="text-3xl font-bold font-orbitron text-white mb-8">My Orders</h1>

            <div className="rounded-md border border-white/10 bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-muted-foreground">Order ID</TableHead>
                            <TableHead className="text-muted-foreground">Date</TableHead>
                            <TableHead className="text-muted-foreground">Items</TableHead>
                            <TableHead className="text-muted-foreground">Total</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-muted-foreground">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        #{order.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell className="text-white">
                                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-white">
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </TableCell>
                                    <TableCell className="text-primary font-bold">
                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(order.status)}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-primary">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md bg-card border-white/10 text-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-orbitron">Order Details</DialogTitle>
                                                    <DialogDescription className="text-muted-foreground">
                                                        #{order.id.slice(0, 8)} • {format(new Date(order.createdAt), "PPP")}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="space-y-6 mt-4">
                                                    {/* Items */}
                                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                                        {order.items.map((item: any) => (
                                                            <div key={item.id} className="flex gap-3 items-center bg-white/5 p-2 rounded-md">
                                                                <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0 bg-background">
                                                                    <Image
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        fill
                                                                        className="object-cover"
                                                                        unoptimized={item.image.includes('supabase.co')}
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Qty: {item.quantity}
                                                                    </p>
                                                                </div>
                                                                <p className="text-sm font-bold">
                                                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Address */}
                                                    <div className="space-y-2">
                                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                                            <MapPin className="h-3 w-3" /> Delivery Address
                                                        </h3>
                                                        <p className="text-sm bg-white/5 p-3 rounded-md whitespace-pre-wrap">
                                                            {order.address}
                                                            <br />
                                                            <span className="text-muted-foreground">PIN:</span> {order.pincode}
                                                        </p>
                                                    </div>

                                                    {/* Total */}
                                                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                                        <span className="font-medium">Total Amount</span>
                                                        <span className="text-xl font-bold text-primary">
                                                            ₹{order.totalAmount.toLocaleString('en-IN')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
