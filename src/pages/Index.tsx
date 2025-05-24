
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import MarketFeed from '@/components/MarketFeed';
import FarmerDashboard from '@/components/FarmerDashboard';
import BuyerDashboard from '@/components/BuyerDashboard';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-bazaar-bg">
      <Navigation />
      
      <SignedOut>
        <Hero />
        <MarketFeed />
      </SignedOut>
      
      <SignedIn>
        {/* In a real app, you'd check user role here and show appropriate dashboard */}
        <div className="space-y-8">
          <FarmerDashboard />
          <div className="border-t border-gray-700/30 pt-8">
            <BuyerDashboard />
          </div>
        </div>
      </SignedIn>
      
      <Footer />
    </div>
  );
};

export default Index;
