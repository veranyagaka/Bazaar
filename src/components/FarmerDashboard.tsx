import { useState } from 'react';
import { TrendingUp, Users, Bell, Plus, Stethoscope, Shuffle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [activeCrops] = useState([
    { name: 'Tomatoes', quantity: '500 kg', status: 'Ready to sell', price: 'KES 45/kg' },
    { name: 'Rice', quantity: '2 tons', status: 'Harvesting', price: 'KES 35/kg' },
    { name: 'Onions', quantity: '300 kg', status: 'Growing', price: 'KES 30/kg' }
  ]);

  const [recommendations] = useState([
    { buyer: 'Fresh Mart', distance: '2.5 km', price: 'KES 47/kg', rating: 4.8 },
    { buyer: 'Green Valley Foods', distance: '5.1 km', price: 'KES 46/kg', rating: 4.6 },
    { buyer: 'Local Wholesale', distance: '1.2 km', price: 'KES 44/kg', rating: 4.2 }
  ]);

  const stats = [
    { title: 'Total Revenue', value: 'KES 45,230', change: '+12%', icon: TrendingUp },
    { title: 'Active Crops', value: '3', change: '+1', icon: Plus },
    { title: 'Pending Orders', value: '2', change: '0', icon: Bell },
    { title: 'Buyers Connected', value: '8', change: '+3', icon: Users }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 bg-bazaar-bg min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow">Farmer Dashboard</h1>
          <p className="text-gray-300">Welcome back! Here's what's happening with your crops.</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            className="bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition flex items-center gap-2"
            onClick={() => navigate('/disease-detection')}
          >
            <Stethoscope className="w-5 h-5" />
            Disease Detection
          </Button>
          <Button
            className="bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition flex items-center gap-2"
            onClick={() => navigate('/market-match')}
          >
            <Shuffle className="w-5 h-5" />
            Market Matching
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-[#23272f] shadow-lg border border-[#2d323c] rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                  {stat.change !== '0' && (
                    <p className="text-green-400 text-sm font-semibold">{stat.change} this month</p>
                  )}
                </div>
                <stat.icon className="w-9 h-9 text-primary bg-[#1a1d23] rounded-full p-2 shadow" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Active Crops */}
        <Card className="bg-[#23272f] shadow-lg border border-[#2d323c] rounded-xl">
          <CardHeader>
            <CardTitle className="text-white font-bold text-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              Your Crops
              <Button className="bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition text-sm px-4 py-2 mt-2 sm:mt-0">
                Add Crop
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCrops.map((crop, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-2 sm:gap-0 bg-[#1a1d23] rounded-lg shadow border border-[#23272f]">
                  <div>
                    <h4 className="text-white font-semibold">{crop.name}</h4>
                    <p className="text-gray-400 text-sm">{crop.quantity} • {crop.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">{crop.price}</p>
                    <button className="text-gray-300 hover:text-white text-sm font-medium">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buyer Recommendations */}
        <Card className="bg-[#23272f] shadow-lg border border-[#2d323c] rounded-xl mt-6 lg:mt-0">
          <CardHeader>
            <CardTitle className="text-white font-bold text-lg">Recommended Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-2 sm:gap-0 bg-[#1a1d23] rounded-lg shadow border border-[#23272f]">
                  <div>
                    <h4 className="text-white font-semibold">{rec.buyer}</h4>
                    <p className="text-gray-400 text-sm">{rec.distance} • ★ {rec.rating}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">{rec.price}</p>
                    <button className="text-gray-300 hover:text-primary text-sm font-medium">
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
      <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <button className="bg-[#23272f] border border-[#2d323c] rounded-xl shadow text-center p-6 hover:scale-105 transition-transform">
          <Bell className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-semibold">Set Price Alert</h3>
          <p className="text-gray-400 text-sm">Get notified when prices rise</p>
        </button>
        
        <button className="bg-[#23272f] border border-[#2d323c] rounded-xl shadow text-center p-6 hover:scale-105 transition-transform">
          <Users className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-semibold">Find Buyers</h3>
          <p className="text-gray-400 text-sm">Connect with nearby buyers</p>
        </button>
        
        <button className="bg-[#23272f] border border-[#2d323c] rounded-xl shadow text-center p-6 hover:scale-105 transition-transform">
          <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-semibold">Market Trends</h3>
          <p className="text-gray-400 text-sm">View price predictions</p>
        </button>
      </div>
    </div>
  );
};

export default FarmerDashboard;
