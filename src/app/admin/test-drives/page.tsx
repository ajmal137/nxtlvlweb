
"use client";

import { useEffect, useState } from "react";
import { getTestDrives } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Phone, User, Car } from "lucide-react";

export default function TestDrivesPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRequests() {
            const { data } = await getTestDrives();
            setRequests(data);
            setLoading(false);
        }
        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-orbitron text-white tracking-wider">Test Drive Requests</h1>
                    <p className="text-muted-foreground mt-1">Manage incoming test drive appointments.</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-1 border-primary/50 text-primary">
                    {requests.length} Requests
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {requests.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No test drive requests yet.
                    </div>
                ) : (
                    requests.map((req) => (
                        <Card key={req.id} className="bg-card/50 border-white/10 backdrop-blur-sm hover:border-primary/50 transition-colors">
                            <CardHeader className="uppercase tracking-wider">
                                <CardTitle className="flex justify-between items-start gap-2 text-base">
                                    <span className="font-bold text-white truncate">{req.vehicleModel}</span>
                                    <Badge variant={req.status === 'completed' ? 'secondary' : 'default'} className="bg-primary/20 text-primary border-0">
                                        {req.status}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-white/80">
                                    <User className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{req.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/80">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <a href={`tel:${req.phone}`} className="hover:text-primary transition-colors">{req.phone}</a>
                                </div>
                                <div className="flex items-center gap-3 text-white/80">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{new Date(req.date).toLocaleDateString()}</span>
                                </div>
                                <div className="pt-2 text-xs text-muted-foreground">
                                    Requested: {new Date(req.createdAt).toLocaleDateString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
