"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Percent, Calendar } from "lucide-react";

export default function FinanceCalculator({ initialPrice = 50000 }: { initialPrice?: number }) {
    const [price, setPrice] = useState(initialPrice);
    const [downPayment, setDownPayment] = useState(initialPrice * 0.2);
    const [term, setTerm] = useState(60);
    const [interestRate, setInterestRate] = useState(5.9);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        const principal = price - downPayment;
        const monthlyRate = interestRate / 100 / 12;

        if (monthlyRate === 0) {
            setMonthlyPayment(principal / term);
        } else {
            const payment =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
                (Math.pow(1 + monthlyRate, term) - 1);
            setMonthlyPayment(payment);
        }
    }, [price, downPayment, term, interestRate]);

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-white/10 text-white">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <IndianRupee className="text-primary h-5 w-5" />
                    Finance Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Vehicle Price</Label>
                        <span className="font-mono text-primary">₹{price.toLocaleString('en-IN')}</span>
                    </div>
                    <Slider
                        value={[price]}
                        min={10000}
                        max={500000}
                        step={1000}
                        onValueChange={(val) => setPrice(val[0])}
                        className="[&>.relative>.absolute]:bg-primary"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Down Payment ({Math.round((downPayment / price) * 100)}%)</Label>
                        <span className="font-mono text-primary">₹{downPayment.toLocaleString('en-IN')}</span>
                    </div>
                    <Slider
                        value={[downPayment]}
                        min={0}
                        max={price}
                        step={500}
                        onValueChange={(val) => setDownPayment(val[0])}
                        className="[&>.relative>.absolute]:bg-primary"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" /> Term (Months)
                        </Label>
                        <select
                            value={term}
                            onChange={(e) => setTerm(Number(e.target.value))}
                            className="w-full bg-background/50 border border-white/10 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            {[12, 24, 36, 48, 60, 72, 84].map((t) => (
                                <option key={t} value={t}>{t} Months</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                            <Percent className="h-4 w-4 text-muted-foreground" /> Interest Rate
                        </Label>
                        <Input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            step={0.1}
                            className="bg-background/50 border-white/10 focus-visible:ring-primary"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-end">
                        <span className="text-muted-foreground">Estimated Monthly Payment</span>
                        <span className="text-3xl font-bold text-primary">
                            ₹{monthlyPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
