import express from 'express';
const app = express();
app.use(express.json());

import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DataWarehousePayload {
  detection_id: string;
  farmer_id: string;
  crop_type: string;
  disease_name: string;
  confidence_score: number;
  severity: string;
  location: string;
  county: string;
  detected_at: string;
  weather_data?: any;
  market_price?: number;
}

app.all('/', async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set(corsHeaders);
    res.status(204).send();
    return;
  }

  try {
    // Mock response for development/testing
    const mockWarehouseData = [
      {
        detection_id: "mock-id-1",
        farmer_id: "mock-farmer-1",
        crop_type: "maize",
        disease_name: "healthy",
        confidence_score: 1.0,
        severity: "none",
        location: "mock-location",
        county: "mock-county",
        detected_at: new Date().toISOString(),
        weather_data: {},
        market_price: 30.0
      }
    ];

    const analytics = {
      total_detections: mockWarehouseData.length,
      diseases_by_severity: { none: 1 },
      crops_affected: ["maize"],
      counties_affected: ["mock-county"],
      average_confidence: 1.0,
      timestamp: new Date().toISOString()
    };

    res.set({ ...corsHeaders, 'Content-Type': 'application/json' });
    res.json({
      success: true,
      synced_records: mockWarehouseData.length,
      analytics
    });
    return;

  } catch (error) {
    console.error('Data warehouse sync error:', error);
    res.set({ ...corsHeaders, 'Content-Type': 'application/json' });
    res.status(500).json({ 
      error: 'Data warehouse sync failed', 
      details: error.message 
    });
    return;
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
