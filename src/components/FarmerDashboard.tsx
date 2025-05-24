
import { useState } from 'react';
import { TrendingUp, Users, Bell, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FarmerDashboard = () => {
  const [activeCrops] = useState([
    { name: 'Tomatoes', quantity: '500 kg', status: 'Ready to sell', price: '₹45/kg' },
    { name: 'Rice', quantity: '2 tons', status: 'Harvesting', price: '₹35/kg' },
    { name: 'Onions', quantity: '300 kg', status: 'Growing', price: '₹30/kg' }
  ]);

  const [recommendations] = useState([
    { buyer: 'Fresh Mart', distance: '2.5 km', price: '₹47/kg', rating: 4.8 },
    { buyer: 'Green Valley Foods', distance: '5.1 km', price: '₹46/kg', rating: 4.6 },
    { buyer: 'Local Wholesale', distance: '1.2 km', price: '₹44/kg', rating: 4.2 }
  ]);

  const stats = [
    { title: 'Total Revenue', value: '₹45,230', change: '+12%', icon: TrendingUp },
    { title: 'Active Crops', value: '3', change: '+1', icon: Plus },
    { title: 'Pending Orders', value: '2', change: '0', icon: Bell },
    { title: 'Buyers Connected', value: '8', change: '+3', icon: Users }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Farmer Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your crops.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="bazaar-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  {stat.change !== '0' && (
                    <p className="text-green-400 text-sm">{stat.change} this month</p>
                  )}
                </div>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Crops */}
        <Card className="bazaar-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Your Crops
              <Button className="bazaar-button text-sm px-4 py-2">
                Add Crop
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCrops.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-bazaar-bg rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{crop.name}</h4>
                    <p className="text-gray-400 text-sm">{crop.quantity} • {crop.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-medium">{crop.price}</p>
                    <button className="text-gray-400 hover:text-white text-sm">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buyer Recommendations */}
        <Card className="bazaar-card">
          <CardHeader>
            <CardTitle className="text-white">Recommended Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-bazaar-bg rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{rec.buyer}</h4>
                    <p className="text-gray-400 text-sm">{rec.distance} • ★ {rec.rating}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-medium">{rec.price}</p>
                    <button className="text-gray-400 hover:text-primary text-sm">
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <button className="bazaar-card text-center p-6 hover:scale-105 transition-transform">
          <Bell className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-medium">Set Price Alert</h3>
          <p className="text-gray-400 text-sm">Get notified when prices rise</p>
        </button>
        
        <button className="bazaar-card text-center p-6 hover:scale-105 transition-transform">
          <Users className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-medium">Find Buyers</h3>
          <p className="text-gray-400 text-sm">Connect with nearby buyers</p>
        </button>
        
        <button className="bazaar-card text-center p-6 hover:scale-105 transition-transform">
          <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-medium">Market Trends</h3>
          <p className="text-gray-400 text-sm">View price predictions</p>
        </button>
      </div>
    </div>
  );
};

export default FarmerDashboard;
