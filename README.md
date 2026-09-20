# Cipher

Cipher is an AI agent that takes a project idea in plain English and returns the recommended programming language(s), why they fit, their trade-offs, a deployment path, and a full scaffolded folder structure. It features a retro terminal aesthetic inspired by eDEX-UI.

## Architecture

- **Frontend:** React (Vite)
- **Backend:** Node.js (Express)
- **AI Provider:** Google Gemini API (with robust model fallback)

## Setup & Local Development

### Prerequisites
- Node.js (v18+)
- A Gemini API Key (get one from Google AI Studio)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file in the `backend` directory and add your API key:
   ```env
   GEMINI_API_KEY_DEFAULT=your_api_key_here
   PORT=3001
   ```
4. Start the server: `npm start`
   - The server will run on `http://localhost:3001`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Start the dev server: `npm run dev`
   - The frontend will be available at `http://localhost:5173` (or similar)

## Deployment

### Backend (Render)
1. Push the repository to GitHub.
2. Create a new "Web Service" on Render.
3. Connect your repository.
4. Set the **Root Directory** to `backend`.
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add the Environment Variable `GEMINI_API_KEY_DEFAULT` with your API key.
8. Deploy.

### Frontend (Vercel)
1. Create a new Project on Vercel.
2. Connect your repository.
3. Set the **Root Directory** to `frontend`.
4. Framework Preset should auto-detect as **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. *Note:* If your backend URL changes from `localhost`, update the fetch URL in `frontend/src/TerminalWindow.jsx` before deploying, or set it via an environment variable `VITE_API_BASE_URL`.

## Features
- **Model Fallback:** The backend automatically tries a prioritized list of Gemini models if one fails due to rate limits or availability.
- **Custom API Keys:** Users can click the gear icon in the terminal window to use their own session-specific Gemini API key.
- **Virtual Keyboard:** Features an interactive virtual keyboard with synthesized mechanical click sounds using the Web Audio API.
