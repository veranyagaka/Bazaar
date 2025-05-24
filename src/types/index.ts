
export interface User {
  id: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin';
  firstName: string;
  lastName: string;
  phone?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
}

export interface Farmer extends User {
  role: 'farmer';
  crops: string[];
  farmSize?: number;
  experienceYears?: number;
}

export interface Buyer extends User {
  role: 'buyer';
  businessName: string;
  businessType: 'retailer' | 'wholesaler' | 'processor' | 'restaurant';
  buyingCapacity: number;
}

export interface Produce {
  id: string;
  name: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'meat' | 'other';
  currentPrice: number;
  unit: 'kg' | 'ton' | 'piece' | 'liter';
  trend: 'up' | 'down' | 'stable';
  change: number; // percentage change
  lastUpdated: Date;
}

export interface MarketPrice {
  id: string;
  produceId: string;
  price: number;
  market: string;
  location: string;
  date: Date;
  quality: 'A' | 'B' | 'C';
  quantity: number;
}

export interface BuyRequest {
  id: string;
  buyerId: string;
  produceId: string;
  quantity: number;
  maxPrice: number;
  location: string;
  deadline: Date;
  status: 'active' | 'matched' | 'completed' | 'expired';
  createdAt: Date;
}

export interface Match {
  id: string;
  farmerId: string;
  buyerId: string;
  produceId: string;
  quantity: number;
  agreedPrice: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  distance: number; // in km
  createdAt: Date;
}
