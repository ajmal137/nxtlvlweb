"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Package, DollarSign, Users } from "lucide-react";
import { getDashboardStats } from "@/lib/actions";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const { data, error } = await getDashboardStats();
            if (data) {
                setStats(data);
            } else {
                console.error(error);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-white">Loading dashboard stats...</div>;
    }

    if (!stats) {
        return <div className="p-8 text-red-500">Failed to load dashboard stats.</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-wider">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome back, Admin.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Total Vehicles</CardTitle>
                        <Car className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.totalCars}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Total Accessories</CardTitle>
                        <Package className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.totalAccessories}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Inventory Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">₹{stats.inventoryValue.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white">Total Orders</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {stats.activity.length === 0 ? (
                                <p className="text-muted-foreground">No recent activity.</p>
                            ) : (
                                stats.activity.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">
                                                {item.type === 'car' && 'New Vehicle Added'}
                                                {item.type === 'accessory' && 'New Accessory Added'}
                                                {item.type === 'order' && 'New Order Placed'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.type === 'car' && `${item.year} ${item.make} ${item.model}`}
                                                {item.type === 'accessory' && item.name}
                                                {item.type === 'order' && `Order #${item.id.slice(0, 8)} by ${item.customerName}`}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-primary">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
