
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Produce } from '@/types';

const MarketFeed = () => {
  const [produces, setProduces] = useState<Produce[]>([]);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockProduces: Produce[] = [
      {
        id: '1',
        name: 'Tomatoes',
        category: 'vegetables',
        currentPrice: 45,
        unit: 'kg',
        trend: 'up',
        change: 12.5,
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'Rice',
        category: 'grains',
        currentPrice: 35,
        unit: 'kg',
        trend: 'down',
        change: -5.2,
        lastUpdated: new Date()
      },
      {
        id: '3',
        name: 'Bananas',
        category: 'fruits',
        currentPrice: 25,
        unit: 'kg',
        trend: 'up',
        change: 8.3,
        lastUpdated: new Date()
      },
      {
        id: '4',
        name: 'Onions',
        category: 'vegetables',
        currentPrice: 30,
        unit: 'kg',
        trend: 'stable',
        change: 0,
        lastUpdated: new Date()
      },
      {
        id: '5',
        name: 'Wheat',
        category: 'grains',
        currentPrice: 28,
        unit: 'kg',
        trend: 'up',
        change: 15.7,
        lastUpdated: new Date()
      },
      {
        id: '6',
        name: 'Potatoes',
        category: 'vegetables',
        currentPrice: 20,
        unit: 'kg',
        trend: 'down',
        change: -3.1,
        lastUpdated: new Date()
      }
    ];
    setProduces(mockProduces);
  }, []);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Live Market Prices</h2>
        <p className="text-gray-400">Real-time pricing data from markets across the region</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produces.map((produce) => (
          <Card key={produce.id} className="bazaar-card hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">{produce.name}</CardTitle>
                  <p className="text-gray-400 text-sm capitalize">{produce.category}</p>
                </div>
                {getTrendIcon(produce.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-white">
                    ₹{produce.currentPrice}
                    <span className="text-sm text-gray-400 ml-1">/{produce.unit}</span>
                  </div>
                  <div className={`text-sm ${getTrendColor(produce.trend)} flex items-center gap-1`}>
                    {produce.change !== 0 && (
                      <>
                        {produce.change > 0 ? '+' : ''}{produce.change}%
                        <span className="text-gray-500">24h</span>
                      </>
                    )}
                    {produce.change === 0 && 'No change'}
                  </div>
                </div>
                <button className="text-primary hover:text-primary-light text-sm font-medium">
                  View Details
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="bazaar-button">
          View All Markets
        </button>
      </div>
    </div>
  );
};

export default MarketFeed;
