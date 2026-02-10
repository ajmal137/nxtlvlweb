import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCars, getAccessories } from "@/lib/actions";
import VehicleCard from "@/components/VehicleCard";
import AccessoryCard from "@/components/AccessoryCard";
import CarFilters from "@/components/CarFilters";
import FinanceCalculator from "@/components/FinanceCalculator";
import { ArrowRight, ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: carsData } = await getCars();
  const { data: accessoriesData } = await getAccessories();

  const cars = carsData || [];
  const accessories = accessoriesData || [];


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-2xl">
            DRIVE THE <span className="text-primary">FUTURE</span>, TODAY.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Experience the pinnacle of automotive engineering. Curated collection of premium vehicles and exclusive accessories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 h-14 rounded-full" asChild>
              <Link href="#vehicles">
                Browse Vehicles <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white text-lg px-8 h-14 rounded-full backdrop-blur-sm" asChild>
              <Link href="#accessories">
                Shop Accessories
              </Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-10 w-10 text-white/50" />
        </div>
      </section>

      {/* Dual Category Entry */}
      <section className="py-20 px-4 container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="#vehicles" className="group relative h-80 rounded-2xl overflow-hidden border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"
              alt="Premium Vehicles"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Premium Vehicles</h3>
              <p className="text-white/70">Explore our curated inventory of high-performance cars.</p>
            </div>
          </Link>
          <Link href="#accessories" className="group relative h-80 rounded-2xl overflow-hidden border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1632823471367-938b8c5ccff5?q=80&w=2070&auto=format&fit=crop"
              alt="Auto Accessories"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Auto Accessories</h3>
              <p className="text-white/70">Upgrade your ride with top-tier parts and gadgets.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Vehicles Section */}
      <section id="vehicles" className="py-20 bg-background/50 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <aside className="w-full md:w-1/4">
              <CarFilters />
            </aside>
            <div className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Latest Arrivals</h2>
                <div className="text-muted-foreground">{cars.length} Vehicles Available</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {cars.map((car: any) => (
                  <VehicleCard key={car.id} vehicle={car} />
                ))}
              </div>
              <div className="mt-12 flex justify-center">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
                  View All Inventory
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Finance Calculator */}
      <section className="py-20 bg-primary/5 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">Smart Financing Options</h2>
              <p className="text-lg text-muted-foreground">
                Calculate your estimated monthly payments with our easy-to-use finance tool. We offer competitive rates and flexible terms to help you drive your dream car.
              </p>
              <ul className="space-y-4 pt-4">
                {["Competitive Interest Rates", "Flexible Loan Terms", "Quick Approval Process", "No Hidden Fees"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 bg-white text-background hover:bg-white/90">
                Apply for Financing
              </Button>
            </div>
            <div className="w-full max-w-md mx-auto">
              <FinanceCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section id="accessories" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Trending Accessories</h2>
            <p className="text-muted-foreground text-center max-w-2xl">
              Discover our most popular upgrades and essentials for your vehicle.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {accessories.slice(0, 8).map((accessory: any) => (
              <AccessoryCard key={accessory.id} accessory={accessory} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5 gap-2">
              Browse All Accessories <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tighter text-white">
                NEXT <span className="text-primary">LEVEL</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                Redefining the automotive retail experience with premium vehicles and exceptional service.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Inventory</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Accessories</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Financing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">FAQs</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact Us</h4>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  1st floor, Bus stand building,<br />
                  Pothukallu, Nilambur,<br />
                  Kerala-679334
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-bold text-white">Mob:</span>
                  <a href="tel:+919061909059" className="hover:text-primary transition-colors">+91 90619 09059</a>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Next Level Automotive. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
