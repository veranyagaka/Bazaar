// Install dependencies: npm install express cors dotenv @supabase/supabase-js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseClient = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

app.options('*', (req, res) => {
  res.set(corsHeaders).send();
});

app.get('/', async (req, res) => {
  try {
    // Get recent disease detections for warehouse sync
    const { data: detections, error } = await supabaseClient
      .from('disease_detections')
      .select(`
        id,
        farmer_id,
        crop_id,
        disease_name,
        confidence_score,
        severity,
        location,
        detected_at,
        weather_conditions,
        crops (crop_type, farms (county))
      `)
      .gte('detected_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('detected_at', { ascending: false });

    if (error) throw error;

    // Get market prices for correlation
    const { data: marketPrices } = await supabaseClient
      .from('market_prices')
      .select('*')
      .gte('date_recorded', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Transform data for warehouse
    const warehouseData = detections?.map((detection: any) => ({
      detection_id: detection.id,
      farmer_id: detection.farmer_id,
      crop_type: detection.crops?.crop_type,
      disease_name: detection.disease_name,
      confidence_score: detection.confidence_score,
      severity: detection.severity,
      location: detection.location,
      county: detection.crops?.farms?.county,
      detected_at: detection.detected_at,
      weather_data: detection.weather_conditions,
      market_price: marketPrices?.find((price: any) =>
        price.crop_type === detection.crops?.crop_type &&
        price.county === detection.crops?.farms?.county
      )?.price_per_kg
    }));

    // Analytics
    const analytics = {
      total_detections: detections?.length || 0,
      diseases_by_severity: detections?.reduce((acc: Record<string, number>, det: any) => {
        acc[det.severity] = (acc[det.severity] || 0) + 1;
        return acc;
      }, {}),
      crops_affected: [...new Set(detections?.map((d: any) => d.crops?.crop_type))],
      counties_affected: [...new Set(detections?.map((d: any) => d.crops?.farms?.county))],
      average_confidence: detections?.reduce((sum: number, det: any) => sum + (det.confidence_score || 0), 0) / (detections?.length || 1),
      timestamp: new Date().toISOString()
    };

    res.set(corsHeaders).json({
      success: true,
      synced_records: warehouseData?.length || 0,
      analytics
    });
  } catch (error: any) {
    console.error('Data warehouse sync error:', error);
    res.status(500).set(corsHeaders).json({
      error: 'Data warehouse sync failed',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Data warehouse sync server running on port ${PORT}`);
});
