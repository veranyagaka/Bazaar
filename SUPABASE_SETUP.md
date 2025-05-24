
# Supabase Database Schema for Bazaar

## Overview
This document outlines the complete database schema and setup instructions for the Bazaar market match platform.

## Tables

### 1. profiles
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  location_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 2. farmer_profiles
```sql
CREATE TABLE farmer_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  crops TEXT[] NOT NULL DEFAULT '{}',
  farm_size_acres DECIMAL(10,2),
  experience_years INTEGER,
  preferred_selling_radius_km INTEGER DEFAULT 50,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 3. buyer_profiles
```sql
CREATE TABLE buyer_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_type business_type NOT NULL CHECK (business_type IN ('retailer', 'wholesaler', 'processor', 'restaurant', 'exporter')),
  buying_capacity_kg INTEGER,
  preferred_quality_grades TEXT[] DEFAULT '{"A","B","C"}',
  payment_terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 4. produces
```sql
CREATE TABLE produces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category produce_category NOT NULL CHECK (category IN ('vegetables', 'fruits', 'grains', 'dairy', 'meat', 'spices', 'other')),
  unit measurement_unit NOT NULL CHECK (unit IN ('kg', 'ton', 'piece', 'liter', 'dozen')),
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 5. market_prices
```sql
CREATE TABLE market_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produce_id UUID REFERENCES produces(id) ON DELETE CASCADE NOT NULL,
  market_name TEXT NOT NULL,
  location_lat DECIMAL(10,8) NOT NULL,
  location_lng DECIMAL(11,8) NOT NULL,
  location_address TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quality_grade quality_grade CHECK (quality_grade IN ('A', 'B', 'C')),
  quantity_available_kg INTEGER,
  reported_by UUID REFERENCES profiles(id),
  verified BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 6. buy_requests
```sql
CREATE TABLE buy_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES buyer_profiles(id) ON DELETE CASCADE NOT NULL,
  produce_id UUID REFERENCES produces(id) ON DELETE CASCADE NOT NULL,
  quantity_kg INTEGER NOT NULL,
  max_price_per_kg DECIMAL(10,2) NOT NULL,
  preferred_quality_grades TEXT[] DEFAULT '{"A","B","C"}',
  pickup_location_lat DECIMAL(10,8),
  pickup_location_lng DECIMAL(11,8),
  pickup_location_address TEXT,
  delivery_required BOOLEAN DEFAULT FALSE,
  max_delivery_distance_km INTEGER,
  deadline DATE NOT NULL,
  status request_status DEFAULT 'active' CHECK (status IN ('active', 'matched', 'completed', 'cancelled', 'expired')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 7. farmer_produce
```sql
CREATE TABLE farmer_produce (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE NOT NULL,
  produce_id UUID REFERENCES produces(id) ON DELETE CASCADE NOT NULL,
  quantity_available_kg INTEGER NOT NULL,
  price_per_kg DECIMAL(10,2) NOT NULL,
  quality_grade quality_grade CHECK (quality_grade IN ('A', 'B', 'C')),
  harvest_date DATE,
  available_from DATE NOT NULL,
  available_until DATE,
  organic_certified BOOLEAN DEFAULT FALSE,
  description TEXT,
  images TEXT[],
  status produce_status DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 8. matches
```sql
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES buyer_profiles(id) ON DELETE CASCADE NOT NULL,
  produce_id UUID REFERENCES produces(id) ON DELETE CASCADE NOT NULL,
  farmer_produce_id UUID REFERENCES farmer_produce(id) ON DELETE CASCADE,
  buy_request_id UUID REFERENCES buy_requests(id) ON DELETE CASCADE,
  quantity_kg INTEGER NOT NULL,
  agreed_price_per_kg DECIMAL(10,2),
  total_amount DECIMAL(12,2),
  distance_km DECIMAL(8,2),
  status match_status DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  farmer_accepted_at TIMESTAMP WITH TIME ZONE,
  buyer_accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 9. price_alerts
```sql
CREATE TABLE price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  produce_id UUID REFERENCES produces(id) ON DELETE CASCADE NOT NULL,
  alert_type alert_type CHECK (alert_type IN ('price_above', 'price_below', 'price_change')),
  target_price DECIMAL(10,2),
  percentage_change DECIMAL(5,2),
  location_radius_km INTEGER DEFAULT 50,
  active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 10. messages
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'voice', 'location')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## Custom Types

```sql
-- Create custom enum types
CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'admin');
CREATE TYPE business_type AS ENUM ('retailer', 'wholesaler', 'processor', 'restaurant', 'exporter');
CREATE TYPE produce_category AS ENUM ('vegetables', 'fruits', 'grains', 'dairy', 'meat', 'spices', 'other');
CREATE TYPE measurement_unit AS ENUM ('kg', 'ton', 'piece', 'liter', 'dozen');
CREATE TYPE quality_grade AS ENUM ('A', 'B', 'C');
CREATE TYPE request_status AS ENUM ('active', 'matched', 'completed', 'cancelled', 'expired');
CREATE TYPE produce_status AS ENUM ('available', 'reserved', 'sold', 'expired');
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');
CREATE TYPE alert_type AS ENUM ('price_above', 'price_below', 'price_change');
CREATE TYPE message_type AS ENUM ('text', 'image', 'voice', 'location');
```

## Row Level Security (RLS) Policies

### profiles table
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### farmer_profiles table
```sql
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;

-- Farmers can manage their own profile
CREATE POLICY "Farmers can view own profile" ON farmer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Farmers can update own profile" ON farmer_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Farmers can insert own profile" ON farmer_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Buyers can view farmer profiles for matching
CREATE POLICY "Buyers can view farmer profiles" ON farmer_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'buyer'
    )
  );
```

### buyer_profiles table
```sql
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;

-- Similar policies for buyer_profiles
CREATE POLICY "Buyers can view own profile" ON buyer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Buyers can update own profile" ON buyer_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Buyers can insert own profile" ON buyer_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Farmers can view buyer profiles
CREATE POLICY "Farmers can view buyer profiles" ON buyer_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'farmer'
    )
  );
```

### Additional RLS policies
```sql
-- Market prices - public read, authenticated write
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view market prices" ON market_prices FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert market prices" ON market_prices FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Farmer produce - farmers can manage their own, buyers can view
ALTER TABLE farmer_produce ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers can manage own produce" ON farmer_produce 
  FOR ALL USING (
    farmer_id IN (
      SELECT id FROM farmer_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Buyers can view available produce" ON farmer_produce
  FOR SELECT USING (
    status = 'available' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('buyer', 'admin')
    )
  );
```

## Functions and Triggers

### Update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buy_requests_updated_at BEFORE UPDATE ON buy_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farmer_produce_updated_at BEFORE UPDATE ON farmer_produce
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Distance calculation function
```sql
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DECIMAL, lng1 DECIMAL, 
  lat2 DECIMAL, lng2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * 
      cos(radians(lat2)) * 
      cos(radians(lng2) - radians(lng1)) + 
      sin(radians(lat1)) * 
      sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

## Sample Data

```sql
-- Insert sample produces
INSERT INTO produces (name, category, unit) VALUES 
('Tomatoes', 'vegetables', 'kg'),
('Rice', 'grains', 'kg'),
('Bananas', 'fruits', 'kg'),
('Onions', 'vegetables', 'kg'),
('Wheat', 'grains', 'kg'),
('Potatoes', 'vegetables', 'kg'),
('Mangoes', 'fruits', 'kg'),
('Carrots', 'vegetables', 'kg'),
('Milk', 'dairy', 'liter'),
('Eggs', 'other', 'dozen');

-- Insert sample market prices
INSERT INTO market_prices (produce_id, market_name, location_lat, location_lng, location_address, price, quality_grade, quantity_available_kg, date) 
SELECT 
  p.id,
  'Main Market',
  28.6139 + (RANDOM() - 0.5) * 0.1,
  77.2090 + (RANDOM() - 0.5) * 0.1,
  'Delhi, India',
  (RANDOM() * 50 + 20)::DECIMAL(10,2),
  (ARRAY['A', 'B', 'C'])[FLOOR(RANDOM() * 3 + 1)],
  (RANDOM() * 1000 + 100)::INTEGER,
  CURRENT_DATE
FROM produces p;
```

## API Endpoints Structure

### REST API Endpoints (to be implemented)
- GET /api/produces - List all produce types
- GET /api/market-prices - Get current market prices with filters
- GET /api/farmer-produce - List available produce from farmers
- POST /api/buy-requests - Create new buy request
- GET /api/matches - Get matches for user
- POST /api/matches/:id/accept - Accept a match
- GET /api/price-alerts - Get user's price alerts
- POST /api/price-alerts - Create new price alert

## Storage Buckets

### farmer-produce-images
```sql
-- Create storage bucket for farmer produce images
INSERT INTO storage.buckets (id, name, public) VALUES ('farmer-produce-images', 'farmer-produce-images', true);

-- RLS policy for storage
CREATE POLICY "Farmers can upload produce images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'farmer-produce-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view produce images" ON storage.objects
  FOR SELECT USING (bucket_id = 'farmer-produce-images');
```

## Environment Variables for Edge Functions

```
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
WHATSAPP_API_KEY=your_whatsapp_api_key
WEATHER_API_KEY=your_weather_api_key
MAPS_API_KEY=your_maps_api_key
```

This schema supports all the core features of the Bazaar platform including user management, produce listings, market pricing, buyer-seller matching, and communication.
