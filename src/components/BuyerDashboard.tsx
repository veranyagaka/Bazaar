import { useState } from 'react';
import { TrendingUp, Search, Bell, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BuyerDashboard = () => {
  const [activeRequests] = useState([
    { crop: 'Tomatoes', quantity: '1000 kg', maxPrice: 'KES 45/kg', deadline: '3 days', status: 'Active' },
    { crop: 'Rice', quantity: '5 tons', maxPrice: 'KES 35/kg', deadline: '1 week', status: 'Matched' },
    { crop: 'Onions', quantity: '500 kg', maxPrice: 'KES 30/kg', deadline: '2 days', status: 'Active' }
  ]);

  const [availableSupplies] = useState([
    { farmer: 'Rajesh Kumar', crop: 'Tomatoes', quantity: '800 kg', price: 'KES 43/kg', distance: '2.1 km', quality: 'A' },
    { farmer: 'Priya Sharma', crop: 'Rice', quantity: '3 tons', price: 'KES 34/kg', distance: '5.5 km', quality: 'A' },
    { farmer: 'Amit Singh', crop: 'Onions', quantity: '600 kg', price: 'KES 28/kg', distance: '1.8 km', quality: 'B' }
  ]);

  const stats = [
    { title: 'Total Purchases', value: 'KES 2,45,000', change: '+18%', icon: TrendingUp },
    { title: 'Active Requests', value: '3', change: '+1', icon: Plus },
    { title: 'Pending Matches', value: '5', change: '+2', icon: Bell },
    { title: 'Farmers Connected', value: '12', change: '+4', icon: Search }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400';
      case 'Matched': return 'text-primary';
      case 'Completed': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 bg-bazaar-bg min-h-screen">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2 drop-shadow">Buyer Dashboard</h1>
        <p className="text-gray-300">Find quality produce from local farmers at competitive prices.</p>
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
        {/* Active Buy Requests */}
        <Card className="bg-[#23272f] shadow-lg border border-[#2d323c] rounded-xl">
          <CardHeader>
            <CardTitle className="text-white font-bold text-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              Your Buy Requests
              <Button className="bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition text-sm px-4 py-2 mt-2 sm:mt-0">
                New Request
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRequests.map((request, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-2 sm:gap-0 bg-[#1a1d23] rounded-lg shadow border border-[#23272f]">
                  <div>
                    <h4 className="text-white font-semibold">{request.crop}</h4>
                    <p className="text-gray-400 text-sm">{request.quantity} • Max {request.maxPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getStatusColor(request.status)}`}>{request.status}</p>
                    <p className="text-gray-400 text-sm">{request.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Supplies */}
        <Card className="bg-[#23272f] shadow-lg border border-[#2d323c] rounded-xl mt-6 lg:mt-0">
          <CardHeader>
            <CardTitle className="text-white font-bold text-lg">Available Supplies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableSupplies.map((supply, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-2 sm:gap-0 bg-[#1a1d23] rounded-lg shadow border border-[#23272f]">
                  <div>
                    <h4 className="text-white font-semibold">{supply.farmer}</h4>
                    <p className="text-gray-400 text-sm">{supply.crop} • {supply.quantity} • Grade {supply.quality}</p>
                    <p className="text-gray-400 text-sm">{supply.distance} away</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold">{supply.price}</p>
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
          <Search className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-semibold">Search Produce</h3>
          <p className="text-gray-400 text-sm">Find specific crops and farmers</p>
        </button>
        
        <button className="bg-[#23272f] border border-[#2d323c] rounded-xl shadow text-center p-6 hover:scale-105 transition-transform">
          <Bell className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-semibold">Price Alerts</h3>
          <p className="text-gray-400 text-sm">Get notified of good deals</p>
        </button>
        
        <button className="bg-[#23272f] border border-[#2d323c] rounded-xl shadow text-center p-6 hover:scale-105 transition-transform">
          <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-semibold">Market Analysis</h3>
          <p className="text-gray-400 text-sm">View supply and demand trends</p>
        </button>
      </div>
    </div>
  );
};

export default BuyerDashboard;
