import express from 'express';
const app = express();
app.use(express.json());

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

app.options('/', (req, res) => {
  res.set(corsHeaders);
  res.status(204).send();
});

app.post('/', async (req, res) => {
  try {
    // Always return a mock response for development/testing
    const mockResult = {
      disease_name: "healthy",
      confidence_score: 1.0,
      severity: "none",
      affected_area_percentage: 0,
      symptoms: [],
      causes: [],
      treatment_recommendations: ["No action needed"],
      preventive_measures: ["Continue regular monitoring"],
      urgency: "low",
      estimated_yield_loss: 0,
      follow_up_required: false,
      follow_up_days: 0
    };
    res.set({ ...corsHeaders, 'Content-Type': 'application/json' });
    res.json(mockResult);
    return;
  } catch (error) {
    console.error('Error in AI disease detection:', error);
    res.set({ ...corsHeaders, 'Content-Type': 'application/json' });
    res.status(500).json({
      error: 'Disease detection failed',
      details: error.message
    });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
