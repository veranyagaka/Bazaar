import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Truck, TrendingUp, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import MatchResults from './MatchResults';

interface MarketMatchData {
  cropType: string;
  quantity: number;
  unit: string;
  location: string;
  county: string;
  maxPrice: number;
  minPrice: number;
  deliveryDate: string;
  qualityGrade: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const MarketMatch = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [matchData, setMatchData] = useState<MarketMatchData>({
    cropType: '',
    quantity: 0,
    unit: 'kg',
    location: '',
    county: '',
    maxPrice: 0,
    minPrice: 0,
    deliveryDate: '',
    qualityGrade: ''
  });
  const [matches, setMatches] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const counties = [
    'Nairobi', 'Mombasa', 'Nakuru', 'Kisumu', 'Eldoret', 'Thika', 'Malindi',
    'Kitale', 'Garissa', 'Kakamega', 'Machakos', 'Meru', 'Nyeri', 'Kericho'
  ];

  const cropTypes = [
    'maize', 'beans', 'potatoes', 'tomatoes', 'onions', 'cabbage', 
    'kale', 'spinach', 'carrots', 'bananas', 'coffee', 'tea'
  ];

  const handleInputChange = (field: keyof MarketMatchData, value: string | number) => {
    setMatchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const findMarketMatches = async () => {
    if (!matchData.cropType || !matchData.quantity || !matchData.county) {
      toast({
        title: "Missing Information",
        description: "Please fill in crop type, quantity, and county to find matches.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get buyer requests that match criteria
      const { data: buyerRequests, error: buyerError } = await supabase
        .from('buyer_requests')
        .select(`
          *,
          profiles!buyer_id (
            full_name,
            phone_number,
            location
          )
        `)
        .eq('crop_type', matchData.cropType)
        .eq('status', 'active')
        .gte('quantity_needed', matchData.quantity * 0.5) // Accept 50% or more of quantity
        .lte('quantity_needed', matchData.quantity * 2) // Don't exceed 2x the quantity
        .order('created_at', { ascending: false });

      if (buyerError) throw buyerError;

      // Get market prices for comparison
      const { data: marketPrices, error: priceError } = await supabase
        .from('market_prices')
        .select('*')
        .eq('crop_type', matchData.cropType)
        .eq('county', matchData.county)
        .order('date_recorded', { ascending: false })
        .limit(5);

      if (priceError) throw priceError;

      // Calculate match scores and filter results
      const scoredMatches = buyerRequests?.map(request => {
        let score = 0;
        
        // Location match (county)
        if (request.county === matchData.county) score += 30;
        else if (request.county) score += 10; // Different county but specified
        
        // Price match
        const avgMarketPrice = marketPrices?.reduce((sum, price) => sum + price.price_per_kg, 0) / (marketPrices?.length || 1);
        const priceRange = matchData.maxPrice - matchData.minPrice;
        if (request.max_price_per_unit >= matchData.minPrice && request.max_price_per_unit <= matchData.maxPrice) {
          score += 25;
        } else if (request.max_price_per_unit >= avgMarketPrice * 0.9) {
          score += 15;
        }
        
        // Quantity match
        const quantityRatio = Math.min(request.quantity_needed, matchData.quantity) / Math.max(request.quantity_needed, matchData.quantity);
        score += quantityRatio * 20;
        
        // Delivery date match
        if (request.delivery_date && matchData.deliveryDate) {
          const requestDate = new Date(request.delivery_date);
          const ourDate = new Date(matchData.deliveryDate);
          const daysDiff = Math.abs((requestDate.getTime() - ourDate.getTime()) / (1000 * 3600 * 24));
          if (daysDiff <= 7) score += 15;
          else if (daysDiff <= 30) score += 8;
        }
        
        // Recent request bonus
        const daysSincePosted = (Date.now() - new Date(request.created_at).getTime()) / (1000 * 3600 * 24);
        if (daysSincePosted <= 3) score += 10;
        else if (daysSincePosted <= 7) score += 5;

        return {
          ...request,
          matchScore: Math.round(score),
          avgMarketPrice,
          profiles: request.profiles
        };
      }).filter(match => match.matchScore >= 30) // Only show matches with score 30+
       .sort((a, b) => b.matchScore - a.matchScore) || [];

      setMatches(scoredMatches);
      setShowResults(true);
      
      toast({
        title: "Market Matches Found",
        description: `Found ${scoredMatches.length} potential buyers for your ${matchData.cropType}.`
      });

    } catch (error) {
      console.error('Market matching error:', error);
      toast({
        title: "Error Finding Matches",
        description: "Unable to find market matches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setShowResults(false);
    setMatches([]);
  };

  if (showResults) {
    return (
      <MatchResults 
        matches={matches}
        searchData={matchData}
        onBackToSearch={resetSearch}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Smart Market Matching
        </h1>
        <p className="text-xl text-muted-foreground">
          Find the best buyers for your crops across Kenya
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="cropType">Crop Type *</Label>
              <Select value={matchData.cropType} onValueChange={(value) => handleInputChange('cropType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map(crop => (
                    <SelectItem key={crop} value={crop}>
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={matchData.quantity || ''}
                  onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={matchData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="bags">Bags (90kg)</SelectItem>
                    <SelectItem value="tonnes">Tonnes</SelectItem>
                    <SelectItem value="bunches">Bunches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="county">County *</Label>
              <Select value={matchData.county} onValueChange={(value) => handleInputChange('county', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {counties.map(county => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Specific Location</Label>
              <Input
                id="location"
                value={matchData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Nakuru Town, Kiambu Road"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPrice">Min Price (KES/kg)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  min="0"
                  value={matchData.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', parseFloat(e.target.value) || 0)}
                  placeholder="Minimum price"
                />
              </div>
              <div>
                <Label htmlFor="maxPrice">Max Price (KES/kg)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  value={matchData.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', parseFloat(e.target.value) || 0)}
                  placeholder="Maximum price"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={matchData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="qualityGrade">Quality Grade</Label>
              <Select value={matchData.qualityGrade} onValueChange={(value) => handleInputChange('qualityGrade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="grade-a">Grade A</SelectItem>
                  <SelectItem value="grade-b">Grade B</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button 
            onClick={findMarketMatches} 
            disabled={isLoading}
            className="w-full md:w-auto px-8"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Finding Matches...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Find Market Matches
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-4 text-center">
          <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold">Smart Matching</h3>
          <p className="text-sm text-muted-foreground">AI-powered algorithm matches you with the best buyers</p>
        </Card>
        <Card className="p-4 text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold">Location-Based</h3>
          <p className="text-sm text-muted-foreground">Find buyers near you to reduce transport costs</p>
        </Card>
        <Card className="p-4 text-center">
          <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold">Real-Time Data</h3>
          <p className="text-sm text-muted-foreground">Live market prices and buyer demands</p>
        </Card>
      </div>
    </div>
  );
};

export default MarketMatch;
