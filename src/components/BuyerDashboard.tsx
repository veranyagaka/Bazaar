
import { useState } from 'react';
import { TrendingUp, Search, Bell, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BuyerDashboard = () => {
  const [activeRequests] = useState([
    { crop: 'Tomatoes', quantity: '1000 kg', maxPrice: '₹45/kg', deadline: '3 days', status: 'Active' },
    { crop: 'Rice', quantity: '5 tons', maxPrice: '₹35/kg', deadline: '1 week', status: 'Matched' },
    { crop: 'Onions', quantity: '500 kg', maxPrice: '₹30/kg', deadline: '2 days', status: 'Active' }
  ]);

  const [availableSupplies] = useState([
    { farmer: 'Rajesh Kumar', crop: 'Tomatoes', quantity: '800 kg', price: '₹43/kg', distance: '2.1 km', quality: 'A' },
    { farmer: 'Priya Sharma', crop: 'Rice', quantity: '3 tons', price: '₹34/kg', distance: '5.5 km', quality: 'A' },
    { farmer: 'Amit Singh', crop: 'Onions', quantity: '600 kg', price: '₹28/kg', distance: '1.8 km', quality: 'B' }
  ]);

  const stats = [
    { title: 'Total Purchases', value: '₹2,45,000', change: '+18%', icon: TrendingUp },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Buyer Dashboard</h1>
        <p className="text-gray-400">Find quality produce from local farmers at competitive prices.</p>
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
        {/* Active Buy Requests */}
        <Card className="bazaar-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Your Buy Requests
              <Button className="bazaar-button text-sm px-4 py-2">
                New Request
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRequests.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-bazaar-bg rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{request.crop}</h4>
                    <p className="text-gray-400 text-sm">{request.quantity} • Max {request.maxPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getStatusColor(request.status)}`}>{request.status}</p>
                    <p className="text-gray-400 text-sm">{request.deadline}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Supplies */}
        <Card className="bazaar-card">
          <CardHeader>
            <CardTitle className="text-white">Available Supplies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableSupplies.map((supply, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-bazaar-bg rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{supply.farmer}</h4>
                    <p className="text-gray-400 text-sm">{supply.crop} • {supply.quantity} • Grade {supply.quality}</p>
                    <p className="text-gray-400 text-sm">{supply.distance} away</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-medium">{supply.price}</p>
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
          <Search className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-medium">Search Produce</h3>
          <p className="text-gray-400 text-sm">Find specific crops and farmers</p>
        </button>
        
        <button className="bazaar-card text-center p-6 hover:scale-105 transition-transform">
          <Bell className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-medium">Price Alerts</h3>
          <p className="text-gray-400 text-sm">Get notified of good deals</p>
        </button>
        
        <button className="bazaar-card text-center p-6 hover:scale-105 transition-transform">
          <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-white font-medium">Market Analysis</h3>
          <p className="text-gray-400 text-sm">View supply and demand trends</p>
        </button>
      </div>
    </div>
  );
};

export default BuyerDashboard;
