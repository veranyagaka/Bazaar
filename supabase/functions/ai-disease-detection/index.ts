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
    const { imageUrl, cropType, location } = req.body;

    const openAIApiKey = process.env.OPENAI_API_KEY;
    const isMock = !openAIApiKey;

    if (isMock) {
      // Return a mock response for development/testing
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
    }

    // Analyze image with OpenAI Vision
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert agricultural pathologist specializing in crop diseases in Kenya. Analyze the provided crop image and provide a detailed disease assessment. Return your response as a JSON object with the following structure:
            {\n  "disease_name": "specific disease name",\n  "confidence_score": 0.85,\n  "severity": "mild|moderate|severe|critical",\n  "affected_area_percentage": 25.5,\n  "symptoms": ["list of observed symptoms"],\n  "causes": ["list of potential causes"],\n  "treatment_recommendations": ["specific treatment steps"],\n  "preventive_measures": ["prevention strategies"],\n  "urgency": "low|medium|high|immediate",\n  "estimated_yield_loss": 15.0,\n  "follow_up_required": true,\n  "follow_up_days": 7\n}\n\nFocus on diseases common in Kenya for crops like maize, beans, potatoes, tomatoes, kale, and other local crops. If no disease is detected, set disease_name to "healthy" and adjust other fields accordingly.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please analyze this ${cropType} crop image taken in ${location}, Kenya. Provide a comprehensive disease assessment.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Parse the JSON response from OpenAI
    let detectionResult;
    try {
      detectionResult = JSON.parse(analysis);
    } catch (parseError) {
      // Fallback if OpenAI doesn't return valid JSON
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      detectionResult = {
        disease_name: "Analysis Error",
        confidence_score: 0.5,
        severity: "moderate",
        affected_area_percentage: 0,
        symptoms: ["Unable to analyze image properly"],
        causes: ["Image quality or technical issues"],
        treatment_recommendations: ["Please retake the image with better lighting"],
        preventive_measures: ["Ensure clear, well-lit photos"],
        urgency: "low",
        estimated_yield_loss: 0,
        follow_up_required: true,
        follow_up_days: 1
      };
    }

    res.set({ ...corsHeaders, 'Content-Type': 'application/json' });
    res.json(detectionResult);
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
