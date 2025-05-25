import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tractor, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleOnboarding = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmSize: '',
    crops: '',
    businessName: '',
    businessType: 'retailer' as 'retailer' | 'wholesaler' | 'processor' | 'restaurant',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await user?.update({
        publicMetadata: {
          role: role,
          onboarded: true,
          ...(role === 'farmer'
            ? {
                farmSize: formData.farmSize,
                crops: formData.crops.split(',').map((crop) => crop.trim()),
              }
            : {
                businessName: formData.businessName,
                businessType: formData.businessType,
              }),
          location: formData.location,
        },
      });

      navigate('/');
    } catch (error) {
      console.error('Error updating user metadata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bazaar-bg flex items-center justify-center p-4">
      <Card className="bazaar-card max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-gray-900 text-2xl text-center">Complete Your Profile</CardTitle>
          <p className="text-gray-600 text-center">Tell us about yourself to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <Label className="text-gray-800 text-base mb-4 block">I am a:</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as 'farmer' | 'buyer')}>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${role === 'farmer' ? 'border-primary bg-primary/10' : 'border-gray-300'}`}>
                    <Label htmlFor="farmer" className="cursor-pointer flex flex-col items-center space-y-2 text-gray-800">
                      <RadioGroupItem value="farmer" id="farmer" />
                      <Tractor className="w-8 h-8 text-primary" />
                      <span className="font-medium">Farmer</span>
                      <span className="text-sm text-gray-600 text-center">I grow and sell crops</span>
                    </Label>
                  </div>
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${role === 'buyer' ? 'border-primary bg-primary/10' : 'border-gray-300'}`}>
                    <Label htmlFor="buyer" className="cursor-pointer flex flex-col items-center space-y-2 text-gray-800">
                      <RadioGroupItem value="buyer" id="buyer" />
                      <Store className="w-8 h-8 text-primary" />
                      <span className="font-medium">Buyer</span>
                      <span className="text-sm text-gray-600 text-center">I purchase crops for my business</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-gray-800">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Pune, Maharashtra"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Farmer-specific fields */}
            {role === 'farmer' && (
              <>
                <div>
                  <Label htmlFor="farmSize" className="text-gray-800">Farm Size (in acres)</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.farmSize}
                    onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="crops" className="text-gray-800">Main Crops (comma separated)</Label>
                  <Textarea
                    id="crops"
                    placeholder="e.g., Tomatoes, Rice, Onions"
                    value={formData.crops}
                    onChange={(e) => setFormData({ ...formData, crops: e.target.value })}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
              </>
            )}

            {/* Buyer-specific fields */}
            {role === 'buyer' && (
              <>
                <div>
                  <Label htmlFor="businessName" className="text-gray-800">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g., Fresh Mart"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="businessType" className="text-gray-800">Business Type</Label>
                  <RadioGroup
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value as any })}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {['retailer', 'wholesaler', 'processor', 'restaurant'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type} className="text-gray-800 capitalize">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="bazaar-button w-full"
              disabled={loading}
            >
              {loading ? 'Setting up your profile...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleOnboarding;
