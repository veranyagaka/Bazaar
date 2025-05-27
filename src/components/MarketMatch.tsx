import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Truck, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import MatchResults from './MatchResults';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
      const response = await fetch("/market-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Market match request failed");
      }
      const { matches } = await response.json();
      setMatches(matches);
      setShowResults(true);
      toast({
        title: "Market Matches Found",
        description: `Found ${matches.length} potential buyers for your ${matchData.cropType}.`
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
      <div className="mb-6 flex items-center">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-white border-gray-600 bg-bazaar-bg hover:bg-primary hover:text-white"
          onClick={() => navigate('/farmer')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Smart Market Matching
        </h1>
        <p className="text-xl text-gray-400">
          Find the best buyers for your crops across Kenya
        </p>
      </div>

      <Card className="p-6 mb-6 bg-bazaar-bg">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="cropType" className="text-white">Crop Type *</Label>
              <Select value={matchData.cropType} onValueChange={(value) => handleInputChange('cropType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map(crop => (
                    <SelectItem key={crop} value={crop} className="text-black">
                      {crop.charAt(0).toUpperCase() + crop.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity" className="text-white">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={matchData.quantity || ''}
                  onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                  placeholder="Enter quantity"
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="unit" className="text-white">Unit</Label>
                <Select value={matchData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg" className="text-black">Kilograms</SelectItem>
                    <SelectItem value="bags" className="text-black">Bags (90kg)</SelectItem>
                    <SelectItem value="tonnes" className="text-black">Tonnes</SelectItem>
                    <SelectItem value="bunches" className="text-black">Bunches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="county" className="text-white">County *</Label>
              <Select value={matchData.county} onValueChange={(value) => handleInputChange('county', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {counties.map(county => (
                    <SelectItem key={county} value={county} className="text-black">
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="location" className="text-white">Specific Location</Label>
              <Input
                id="location"
                value={matchData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Nakuru Town, Kiambu Road"
                className="text-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPrice" className="text-white">Min Price (KES/kg)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  min="0"
                  value={matchData.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', parseFloat(e.target.value) || 0)}
                  placeholder="Minimum price"
                  className="text-black"
                />
              </div>
              <div>
                <Label htmlFor="maxPrice" className="text-white">Max Price (KES/kg)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  value={matchData.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', parseFloat(e.target.value) || 0)}
                  placeholder="Maximum price"
                  className="text-black"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deliveryDate" className="text-white">Preferred Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={matchData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                className="text-black"
              />
            </div>

            <div>
              <Label htmlFor="qualityGrade" className="text-white">Quality Grade</Label>
              <Select value={matchData.qualityGrade} onValueChange={(value) => handleInputChange('qualityGrade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium" className="text-black">Premium</SelectItem>
                  <SelectItem value="grade-a" className="text-black">Grade A</SelectItem>
                  <SelectItem value="grade-b" className="text-black">Grade B</SelectItem>
                  <SelectItem value="standard" className="text-black">Standard</SelectItem>
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

          {/* Showcase Match Button */}
          <Button
            variant="outline"
            className="w-full mt-2 text-black"
            onClick={() => {
              setMatches([
                {
                  cropType: 'maize',
                  quantity: 1000,
                  unit: 'kg',
                  location: 'Nakuru Town',
                  county: 'Nakuru',
                  maxPrice: 60,
                  minPrice: 50,
                  deliveryDate: '2024-07-01',
                  qualityGrade: 'premium',
                  matchScore: 95,
                  avgMarketPrice: 55,
                  profiles: {
                    full_name: 'Sample Buyer',
                    phone_number: '+254700000000',
                    location: 'Nakuru Town'
                  }
                }
              ]);
              setShowResults(true);
              toast({
                title: "Showcase Match Complete",
                description: "This is a sample match to demonstrate the system."
              });
            }}
          >
            Run Showcase Match
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
