
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const MatchingSection = () => {
  const buyerMatches = [
    {
      location: "8 km away",
      rating: 4.8,
      cropNeeded: "Maize",
      quantity: "200 bags (90kg)",
      priceOffered: 4600,
      timePosted: "2 hours ago"
    },
    {
      name: "Eastleigh Traders Co-op",
      location: "12 km away", 
      rating: 4.6,
      cropNeeded: "Beans",
      quantity: "50 bags (90kg)",
      priceOffered: 8800,
      timePosted: "4 hours ago"
    },
    {
      name: "Wakulima Fresh Markets",
      location: "6 km away",
      rating: 4.9,
      cropNeeded: "Mixed Vegetables",
      quantity: "500 kg",
      priceOffered: 35,
      timePosted: "1 hour ago"
    }
  ];
  const navigate = useNavigate();

  return (
    <section id="connect" className="py-16 bazaar-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12"> 
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-white">
            Smart Buyer Matching
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get connected with the best buyers near you across Kenya
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {buyerMatches.map((buyer, index) => (
            <div key={index} className="gradient-card p-6 rounded-lg bg-bazaar-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1 text-white">
                    {buyer.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{buyer.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{buyer.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{buyer.timePosted}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crop Needed:</span>
                  <span className="text-foreground font-medium text-white">{buyer.cropNeeded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="text-foreground font-medium text-white">{buyer.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Offered:</span>
                  <span className="text-primary font-bold text-white">KES {buyer.priceOffered.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={() => navigate("/onboarding")} className="w-full bg-primary hover:bg-primary/90">
                  Connect Now
                </Button>
                <Button onClick={() => navigate("/onboarding")} variant="outline" className="w-full border-border bg-bazaar-card">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MatchingSection;
