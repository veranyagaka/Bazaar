const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Use SUPABASE_URL and SUPABASE_ANON_KEY for backend, not VITE_*
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-tiny", // or other models
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Mistral request failed." });
  }
});

// Simple mock for /disease-detection
app.get("/disease-detection", async (req, res) => {
  res.json({
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
  });
});

// Simple mock for /market-match
app.post("/market-match", async (req, res) => {
  res.json({
    matches: [
      {
        cropType: "maize",
        quantity: 1000,
        unit: "kg",
        location: "Nakuru Town",
        county: "Nakuru",
        maxPrice: 60,
        minPrice: 50,
        deliveryDate: "2024-07-01",
        qualityGrade: "premium",
        matchScore: 95,
        avgMarketPrice: 55,
        profiles: {
          full_name: "Sample Buyer",
          phone_number: "+254700000000",
          location: "Nakuru Town"
        }
      }
    ]
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
