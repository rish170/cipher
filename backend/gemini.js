const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const modelsConfigPath = path.join(__dirname, 'models.config.json');
const fallbackModels = JSON.parse(fs.readFileSync(modelsConfigPath, 'utf8'));

const systemInstruction = `
You are a senior software architect and language advisor.
The user will provide a free-text project description.
You must return a structured recommendation in strictly valid JSON format matching this schema:
{
  "languages": ["primary_language", "secondary_language"],
  "why": "Brief explanation of why these languages are a good fit.",
  "advantages": ["Advantage 1", "Advantage 2"],
  "disadvantages": ["Trade-off 1", "Trade-off 2"],
  "deployment": "Realistic deployment option (e.g., Vercel, Docker, App Store).",
  "structure": [
    { "path": "src", "description": "Source code folder" },
    { "path": "src/index.js", "description": "Main entry point" }
  ]
}
For the 'structure' array, paths can include nesting using forward slashes (e.g., 'src/components/App.js'). Do not use ASCII tree characters in the JSON; the frontend will render the tree. Return ONLY valid JSON.
`;

async function getRecommendation(idea, userApiKey) {
    const apiKeyToUse = userApiKey || process.env.GEMINI_API_KEY_DEFAULT;
    
    if (!apiKeyToUse) {
        throw new Error("API key is missing. Please provide one or set GEMINI_API_KEY_DEFAULT.");
    }

    const genAI = new GoogleGenerativeAI(apiKeyToUse);
    let lastError = null;

    for (const modelName of fallbackModels) {
        try {
            console.log(`[Gemini] Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: systemInstruction,
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            const result = await model.generateContent(idea);
            const responseText = result.response.text();
            
            // Validate it's JSON
            const jsonResponse = JSON.parse(responseText);
            jsonResponse._served_by = modelName; // Add this for logging or frontend easter egg
            
            return jsonResponse;

        } catch (error) {
            console.error(`[Gemini] Model ${modelName} failed:`, error.message);
            lastError = error;
            // Continue to the next model in the loop
        }
    }

    // If we exhaust the loop, all models failed
    throw new Error(`ERR: all language models unavailable — try again shortly or add your own API key. (Last Error: ${lastError?.message})`);
}

module.exports = {
    getRecommendation
};
