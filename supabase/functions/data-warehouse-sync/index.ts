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
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables: SUPABASE_URL and/or SUPABASE_ANON_KEY");
    }


    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

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

    if (error) {
      throw error;
    }

    // Get market prices for correlation
    const { data: marketPrices } = await supabaseClient
      .from('market_prices')
      .select('*')
      .gte('date_recorded', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Transform data for warehouse
    const warehouseData = detections?.map(detection => {
      const crop = Array.isArray(detection.crops) ? detection.crops[0] : detection.crops;
      const farm = crop && Array.isArray(crop.farms) ? crop.farms[0] : crop?.farms;
      const farmCounty = farm && Array.isArray(farm) ? farm[0]?.county : farm?.county;
      return {
        detection_id: detection.id,
        farmer_id: detection.farmer_id,
        crop_type: crop?.crop_type,
        disease_name: detection.disease_name,
        confidence_score: detection.confidence_score,
        severity: detection.severity,
        location: detection.location,
        county: farmCounty,
        detected_at: detection.detected_at,
        weather_data: detection.weather_conditions,
        market_price: marketPrices?.find(price => 
          price.crop_type === crop?.crop_type &&
          price.county === farmCounty
        )?.price_per_kg
      };
    });

    // In a real implementation, you would send this to your data warehouse
    // For example, to Azure Synapse, AWS Redshift, or Google BigQuery
    console.log('Syncing to data warehouse:', warehouseData);

    // Create aggregated analytics
    const analytics = {
      total_detections: detections?.length || 0,
      diseases_by_severity: detections?.reduce((acc, det) => {
        acc[det.severity] = (acc[det.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      crops_affected: [
        ...new Set(
          detections?.map(d => {
            const crop = Array.isArray(d.crops) ? d.crops[0] : d.crops;
            return crop?.crop_type;
          })
        )
      ],
      counties_affected: [
        ...new Set(
          detections?.map(d => {
            const crop = Array.isArray(d.crops) ? d.crops[0] : d.crops;
            const farm = crop && Array.isArray(crop.farms) ? crop.farms[0] : crop?.farms;
            const farmCounty = farm && Array.isArray(farm) ? farm[0]?.county : farm?.county;
            return farmCounty;
          })
        )
      ],
      average_confidence: detections?.reduce((sum, det) => sum + (det.confidence_score || 0), 0) / (detections?.length || 1),
      timestamp: new Date().toISOString()
    };

    res.set({ ...corsHeaders, 'Content-Type': 'application/json' });
    res.json({
      success: true,
      synced_records: warehouseData?.length || 0,
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
