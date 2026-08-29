# ZERO

ZERO transforms one simple idea into a structured project analysis. The user only needs to describe the idea; Groq generates the project concept, audience, solution, MVP features, market assessment, competitor landscape, FOFA/SWOT, business model, risks and roadmap.

## Run locally
1. Install Node.js 18+ (20+ recommended).
2. Open this folder in a terminal.
3. Run `npm install`.
4. Put your Groq API key in `.env`:
   `GROQ_API_KEY=your_key_here`
5. Run `npm start`.
6. Open `http://localhost:3000`.

To verify the server/API is alive, open `http://localhost:3000/api/health`. It should return JSON and `groqConfigured: true` when the key is configured.

The API key is read server-side and is not placed in the browser code. Do not commit `.env`.

## Important
Competitor and market sections are AI knowledge estimates in this version; the app does not claim to perform live web research. Validate important market facts before making financial or business decisions.
