"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "@/lib/actions";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Package, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner"; // Assuming sonner or use standard alert for now

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await getOrders();
        if (error) {
            console.error(error);
            // toast.error("Failed to fetch orders");
        } else {
            setOrders(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        const { success, error } = await updateOrderStatus(id, status);
        if (success) {
            fetchOrders();
            // toast.success("Order status updated");
        } else {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this order?")) return;

        const { success, error } = await deleteOrder(id);
        if (success) {
            fetchOrders();
            // toast.success("Order deleted");
        } else {
            console.error(error);
            alert("Failed to delete order");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
            case "processing": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
            case "completed": return "bg-green-500/20 text-green-500 border-green-500/50";
            case "cancelled": return "bg-red-500/20 text-red-500 border-red-500/50";
            default: return "bg-gray-500/20 text-gray-500";
        }
    };

    if (loading) {
        return <div className="p-8 text-white">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-orbitron text-white">Orders</h1>
                <Badge variant="outline" className="text-primary border-primary">
                    {orders.length} Total Orders
                </Badge>
            </div>

            <div className="rounded-md border border-white/10 bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-muted-foreground">Order ID</TableHead>
                            <TableHead className="text-muted-foreground">Date</TableHead>
                            <TableHead className="text-muted-foreground">Customer</TableHead>
                            <TableHead className="text-muted-foreground">Total</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
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
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{order.customerName}</span>
                                            <span className="text-xs text-muted-foreground">{order.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-primary font-bold">
                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                                        >
                                            <SelectTrigger className={`w-[130px] h-8 border-0 ${getStatusColor(order.status)}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-card border-white/10">
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-primary" onClick={() => setSelectedOrder(order)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl bg-card border-white/10 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-orbitron">Order Details</DialogTitle>
                                                        <DialogDescription className="text-muted-foreground">
                                                            Order #{order.id} • Placed on {format(new Date(order.createdAt), "PPP p")}
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="grid md:grid-cols-2 gap-8 mt-4">
                                                        <div className="space-y-4">
                                                            <h3 className="font-bold text-primary flex items-center gap-2">
                                                                <User className="h-4 w-4" /> Customer Info
                                                            </h3>
                                                            <div className="space-y-2 text-sm">
                                                                <p><span className="text-muted-foreground">Name:</span> {order.customerName}</p>
                                                                <p><span className="text-muted-foreground">Phone:</span> {order.phone}</p>
                                                            </div>

                                                            <h3 className="font-bold text-primary flex items-center gap-2 mt-6">
                                                                <MapPin className="h-4 w-4" /> Delivery Address
                                                            </h3>
                                                            <div className="p-3 bg-white/5 rounded-md text-sm whitespace-pre-wrap">
                                                                {order.address}
                                                                <br />
                                                                <span className="text-muted-foreground">PIN:</span> {order.pincode}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <h3 className="font-bold text-primary flex items-center gap-2">
                                                                <Package className="h-4 w-4" /> Order Items
                                                            </h3>
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
                                                                                ₹{item.price.toLocaleString('en-IN')} x {item.quantity}
                                                                            </p>
                                                                        </div>
                                                                        <p className="text-sm font-bold">
                                                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                                                <span className="font-medium">Total Amount</span>
                                                                <span className="text-xl font-bold text-primary">
                                                                    ₹{order.totalAmount.toLocaleString('en-IN')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-red-500/10 hover:text-red-500"
                                                onClick={() => handleDelete(order.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
