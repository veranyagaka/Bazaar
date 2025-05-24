import React, { useEffect, useState } from 'react';
import { MapPin, Phone, MessagesSquare, ExternalLink, Filter, Search } from 'lucide-react';

interface BuyerMatch {
  id: string;
  name: string;
  distance: number;
  location: string;
  cropInterests: string[];
  priceOffered: number;
  contactPhone: string;
  matchScore: number;
}

const BuyerMatches: React.FC = () => {
  const [matches, setMatches] = useState<BuyerMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<BuyerMatch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [distanceFilter, setDistanceFilter] = useState<number>(50);

  // Set page title
  useEffect(() => {
    document.title = 'Buyer Matches - Bazaar';
  }, []);

  // Fetch buyer matches (mock data for now)
  useEffect(() => {
    // This would be a Supabase query in production
    const mockBuyers: BuyerMatch[] = [
      { 
        id: '1', 
        name: 'Metro Market', 
        distance: 3.2, 
        location: 'Central District, Market St.',
        cropInterests: ['Tomatoes', 'Potatoes', 'Onions'],
        priceOffered: 38,
        contactPhone: '+254 712 345 678',
        matchScore: 92
      },
      { 
        id: '2', 
        name: 'Fresh Foods Ltd', 
        distance: 5.7, 
        location: 'Industrial Area, Processing Zone',
        cropInterests: ['Potatoes', 'Carrots', 'Cabbage'],
        priceOffered: 30,
        contactPhone: '+254 723 456 789',
        matchScore: 87
      },
      { 
        id: '3', 
        name: 'Green Grocer', 
        distance: 7.1, 
        location: 'South District, Corner Ave',
        cropInterests: ['Tomatoes', 'Cabbage', 'Peppers'],
        priceOffered: 35,
        contactPhone: '+254 734 567 890',
        matchScore: 84
      },
      { 
        id: '4', 
        name: 'Farm to Table Co', 
        distance: 12.5, 
        location: 'East End, Rural Highway',
        cropInterests: ['Tomatoes', 'Corn', 'Peppers'],
        priceOffered: 40,
        contactPhone: '+254 745 678 901',
        matchScore: 78
      },
      { 
        id: '5', 
        name: 'Big Basket', 
        distance: 18.3, 
        location: 'North District, Commerce Plaza',
        cropInterests: ['Potatoes', 'Onions', 'Carrots'],
        priceOffered: 32,
        contactPhone: '+254 756 789 012',
        matchScore: 75
      },
      { 
        id: '6', 
        name: 'Farmers Market Ltd', 
        distance: 22.7, 
        location: 'West District, Harvest Road',
        cropInterests: ['Cabbage', 'Carrots', 'Cucumbers'],
        priceOffered: 28,
        contactPhone: '+254 767 890 123',
        matchScore: 70
      },
    ];
    
    setMatches(mockBuyers);
    setFilteredMatches(mockBuyers);
  }, []);

  // Apply filters
  useEffect(() => {
    let results = matches;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(buyer => 
        buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.cropInterests.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by crop
    if (selectedCrop !== 'all') {
      results = results.filter(buyer => 
        buyer.cropInterests.includes(selectedCrop)
      );
    }
    
    // Filter by distance
    results = results.filter(buyer => buyer.distance <= distanceFilter);
    
    // Sort by match score (highest first)
    results.sort((a, b) => b.matchScore - a.matchScore);
    
    setFilteredMatches(results);
  }, [searchTerm, selectedCrop, distanceFilter, matches]);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-success-500/20 text-success-500';
    if (score >= 80) return 'bg-primary-500/20 text-primary-500';
    if (score >= 70) return 'bg-warning-500/20 text-warning-500';
    return 'bg-gray-500/20 text-gray-500';
  };

  // Get unique crop types for filter
  const cropTypes = ['all', ...new Set(matches.flatMap(buyer => buyer.cropInterests))];

  return (
    <div className="pb-16 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Buyer Matches
        </h1>
        <p className="text-gray-400">
          Find buyers interested in your crops based on location, price, and compatibility
        </p>
      </div>
      
      {/* Filters and search */}
      <div className="bg-background-light border border-gray-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search buyers or locations..."
              className="w-full pl-10 pr-4 py-2 bg-background text-white rounded-md border border-gray-700 focus:outline-none focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Crop filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <select
              className="w-full pl-10 pr-4 py-2 bg-background text-white rounded-md border border-gray-700 focus:outline-none focus:border-primary-500 appearance-none"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="all">All Crops</option>
              {cropTypes.filter(crop => crop !== 'all').map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          
          {/* Distance filter */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-300">Max Distance: {distanceFilter} km</label>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
              className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
        </div>
      </div>
      
      {/* Matches display */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((buyer) => (
            <div key={buyer.id} className="bg-background-light border border-gray-800 rounded-lg p-4 hover:border-primary-500 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-semibold">{buyer.name}</h3>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{buyer.distance} km away</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(buyer.matchScore)}`}>
                  {buyer.matchScore}% Match
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-300 mb-2">Interested in:</p>
                <div className="flex flex-wrap gap-2">
                  {buyer.cropInterests.map((crop, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-300">Location:</p>
                <p className="text-sm text-white">{buyer.location}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-300">Price offered:</p>
                <p className="text-lg font-semibold text-primary-500">${buyer.priceOffered}/kg</p>
              </div>
              
              <div className="flex space-x-2 border-t border-gray-800 pt-3">
                <button className="flex items-center justify-center flex-1 py-1.5 bg-primary-500 text-white text-sm rounded-md hover:bg-primary-600 transition-colors">
                  <Phone className="h-4 w-4 mr-1.5" />
                  Call
                </button>
                <button className="flex items-center justify-center flex-1 py-1.5 bg-background text-white text-sm rounded-md border border-gray-700 hover:bg-background-light transition-colors">
                  <MessagesSquare className="h-4 w-4 mr-1.5" />
                  Message
                </button>
                <button className="flex items-center justify-center flex-1 py-1.5 bg-background text-white text-sm rounded-md border border-gray-700 hover:bg-background-light transition-colors">
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  WhatsApp
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-background-light border border-gray-800 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-background mb-4">
                <Search className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No buyers found</h3>
              <p className="text-gray-400">
                Try adjusting your filters or expanding your search area
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerMatches;