require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getRecommendation } = require('./gemini');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Recommendation endpoint
app.post('/api/recommend', async (req, res) => {
    const { idea } = req.body;
    const userApiKey = req.headers['x-user-gemini-key'];

    if (!idea) {
        return res.status(400).json({ error: "Missing 'idea' in request body." });
    }

    try {
        const recommendation = await getRecommendation(idea, userApiKey);
        res.json(recommendation);
    } catch (error) {
        console.error("Error in /api/recommend:", error);
        
        // Return a clean error to the frontend, not a raw stack trace
        let errorMessage = "ERR: An unexpected error occurred while processing your request.";
        if (error.message.startsWith("ERR:")) {
            errorMessage = error.message; // From our fallback logic
        } else if (error.message.includes("API key")) {
             errorMessage = "ERR: Invalid or missing API key. Please check your settings.";
        }

        res.status(503).json({ error: errorMessage });
    }
});

app.listen(port, () => {
    console.log(`Cipher backend listening on port ${port}`);
});
