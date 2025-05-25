
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import { TrendingUp, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Live Market Prices",
      description: "Get real-time pricing for your crops across different markets"
    },
    {
      icon: Users,
      title: "Find Buyers",
      description: "Connect with nearby buyers and negotiate better prices"
    },
    {
      icon: Bell,
      title: "Price Alerts",
      description: "Set alerts for optimal selling opportunities"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bazaar-bg via-bazaar-card to-bazaar-bg"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Connect Farmers to
            <span className="block bazaar-gradient bg-clip-text text-transparent">
              Better Markets
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-slide-up">
            Bazaar helps small-scale farmers get fair prices by providing real-time market data, 
            connecting them with buyers, and optimizing their selling decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <SignedOut>
              <SignUpButton 
                mode="modal"
                afterSignUpUrl="/onboarding"
                fallbackRedirectUrl="/onboarding"
              >
                <Button className="bazaar-button text-lg px-8 py-4">
                  Get Started as Farmer
                </Button>
              </SignUpButton>
              <SignUpButton 
                mode="modal"
                afterSignUpUrl="/onboarding"
                fallbackRedirectUrl="/onboarding"
              >
                <Button variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-4">
                  Join as Buyer
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button className="bazaar-button text-lg px-8 py-4">
                Go to Dashboard
              </Button>
            </SignedIn>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bazaar-card text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bazaar-gradient w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;