import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Next Level. All rights reserved.
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                        <Link href="/policy#terms" className="hover:text-primary transition-colors">
                            Terms & Conditions
                        </Link>
                        <Link href="/policy#privacy" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/policy#shipping" className="hover:text-primary transition-colors">
                            Shipping Policy
                        </Link>
                        <Link href="/policy#refund" className="hover:text-primary transition-colors">
                            Refund Policy
                        </Link>
                        <Link href="/policy#return" className="hover:text-primary transition-colors">
                            Return Policy
                        </Link>
                    </div>
                </div>
                <div className="mt-8 text-center text-xs text-muted-foreground/50">
                    <p>
                        Registered Office: 8-522-W, POTHUKALLU, Nilambur, Malappuram, Kerala-679334
                    </p>
                </div>
            </div>
        </footer>
    );
}
