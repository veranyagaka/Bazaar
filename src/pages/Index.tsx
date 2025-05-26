
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import MarketFeed from '@/components/MarketFeed';
import FarmerDashboard from '@/components/FarmerDashboard';
import BuyerDashboard from '@/components/BuyerDashboard';
import Footer from '@/components/Footer';

const Index = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user has completed onboarding
      const hasRole = user.publicMetadata?.role;
      const onboarded = user.publicMetadata?.onboarded;
      
      if (!hasRole || !onboarded) {
        navigate('/onboarding');
      }
    }
  }, [user, isLoaded, navigate]);

  const userRole = user?.publicMetadata?.role as 'farmer' | 'buyer' | undefined;

  return (
    <div className="min-h-screen bg-bazaar-bg">
      <Navigation />
      
      <SignedOut>
        <Hero />
        <DashboardSection />
        <MatchingSection />
      </SignedOut>
      
      <SignedIn>
        {userRole === 'farmer' && <FarmerDashboard />}
        {userRole === 'buyer' && <BuyerDashboard />}
        {!userRole && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Setting up your profile...</h2>
              <p className="text-gray-400">Please wait while we redirect you to complete your setup.</p>
            </div>
          </div>
        )}
      </SignedIn>
      
      <Footer />
    </div>
  );
};

export default Index;
