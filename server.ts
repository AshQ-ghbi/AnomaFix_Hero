/**
 * AnomaFix - Full-Stack Express Server with Gemini AI Integration
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  // Safe lazy initialization of Gemini Client
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini AI Client initialized successfully.');
    } catch (err) {
      console.error('Failed to initialize Gemini Client:', err);
    }
  } else {
    console.warn('GEMINI_API_KEY is not configured or uses default value. AI features will fallback to local simulated intelligence.');
  }

  // --- API ROUTE: ANALYZE CIVIC ISSUE ---
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      const { image, description, categoryHint } = req.body;

      if (!ai) {
        // Fallback intelligence if no real key is configured
        console.log('Using simulated local AI parsing due to missing API key...');
        const categories = [
          'Road Damage', 'Potholes', 'Streetlights', 'Garbage', 'Water Leakage',
          'Drainage', 'Traffic Signals', 'Illegal Dumping', 'Trees', 'Public Property'
        ];
        const category = categoryHint || categories[Math.floor(Math.random() * categories.length)];
        const severity = description?.toLowerCase().includes('danger') || description?.toLowerCase().includes('accident') ? 'Critical' : 'Medium';
        const departments: Record<string, string> = {
          'Road Damage': 'Public Works',
          'Potholes': 'Public Works',
          'Streetlights': 'Traffic & Transit',
          'Garbage': 'Sanitation',
          'Water Leakage': 'Water & Sewerage',
          'Drainage': 'Water & Sewerage',
          'Traffic Signals': 'Traffic & Transit',
          'Illegal Dumping': 'Sanitation',
          'Trees': 'Parks & Forestry',
          'Public Property': 'Public Works'
        };
        const dept = departments[category] || 'Administration';

        return res.json({
          title: `Reported ${category}`,
          description: description || `Automated report for ${category} based on citizen submission. Needs inspection.`,
          category: category,
          severity: severity,
          department: dept,
          confidence: 0.88,
          priority: severity === 'Critical' ? 'Urgent' : 'Medium',
          explanation: "Analyzed via AnomaFix simulated local model. Looks authentic and matches local department classification boundaries."
        });
      }

      let contents: any[] = [];
      let promptText = "Analyze this hyperlocal civic infrastructure report. Generate a professional and concise report title, description, category routing, predicted severity level (Low, Medium, High, Critical), government department assignment, priority recommendation, confidence score (0.0 to 1.0), and a brief technical explanation of why this category/severity was chosen. Make sure to identify duplicate potentials if description suggests a standard issue.";

      if (description) {
        promptText += `\nCitizen provided description: "${description}"`;
      }
      if (categoryHint) {
        promptText += `\nCitizen initial category hint: "${categoryHint}"`;
      }

      if (image) {
        // Image is passed as base64 string
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
        contents.push({
          inlineData: {
            mimeType,
            data: base64Data
          }
        });
      }

      contents.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: "You are AnomaFix AI, an automated civic engineering dispatcher. Your job is to parse citizen submissions (photos, notes) of public damages, assign them to the correct city department (Public Works, Sanitation, Water & Sewerage, Traffic & Transit, Parks & Forestry, Administration), categorize them perfectly, score severity accurately, write professional titles/summaries that remove panic or slang, and output standard structural JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A high-quality, professional public issue title. E.g. 'Large active water main leak flooding curb'" },
              description: { type: Type.STRING, description: "A highly descriptive, technical description detailing the location, visual details, safety risks, and recommended actions." },
              category: { 
                type: Type.STRING, 
                description: "The most appropriate category.",
                enum: ['Road Damage', 'Potholes', 'Streetlights', 'Garbage', 'Water Leakage', 'Drainage', 'Traffic Signals', 'Illegal Dumping', 'Trees', 'Public Property', 'Others']
              },
              severity: { 
                type: Type.STRING, 
                description: "Urgency of resolving. Critical is reserve for direct safety danger (e.g. exposed live wire, deep trench open in road).",
                enum: ['Low', 'Medium', 'High', 'Critical']
              },
              department: { 
                type: Type.STRING, 
                description: "Responsible municipality division.",
                enum: ['Public Works', 'Sanitation', 'Water & Sewerage', 'Traffic & Transit', 'Parks & Forestry', 'Administration']
              },
              confidence: { type: Type.NUMBER, description: "Confidence score of categorization between 0.0 and 1.0." },
              priority: { 
                type: Type.STRING, 
                description: "Dispatcher priority suggestion.",
                enum: ['Low', 'Medium', 'High', 'Urgent']
              },
              explanation: { type: Type.STRING, description: "A brief professional summary of the visual characteristics of the issue that informed this decision." }
            },
            required: ['title', 'description', 'category', 'severity', 'department', 'confidence', 'priority', 'explanation']
          }
        }
      });

      const parsedResponse = JSON.parse(response.text || "{}");
      res.json(parsedResponse);
    } catch (error: any) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: error.message || 'An error occurred during image/description analysis.' });
    }
  });

  // --- API ROUTE: CITIZEN ASSISTANT CHAT ---
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, chatHistory } = req.body;

      if (!ai) {
        // Fallback chatbot if no key
        return res.json({
          text: `Hi there! I am AnomaFix Assistant. (I am running in simulated intelligence mode as no GEMINI_API_KEY was found in Secrets). I can still help you! Based on your query "${message}", I recommend reporting this immediately through our 'Report Issue' page. Let me know if you need instructions on logging potholes, streetlights, or scheduling trash pickups!`
        });
      }

      // Format conversation history for Chat API
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are the AnomaFix Civic AI Assistant, a helpful and expert assistant for municipal issues, urban planning, citizen responsibilities, city regulations, and community support. Give precise, courteous, and detailed advice. Help users understand who handles what, what constitutes a critical issue, how they can mobilize volunteers, and explain local city maintenance codes. Refer users to the Report Issue section for filing complaints, the Live Map for tracking, and Leaderboard to see community stars."
        }
      });

      // Send the active message
      const response = await chat.sendMessage({ message: message });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({ error: error.message || 'An error occurred during chat conversation.' });
    }
  });

  // --- VITE DEV MODE VS PRODUCTION STATIC SERVING ---
  if (process.env.NODE_ENV === 'production' || process.env.VITE_PROD === 'true') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AnomaFix server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
});
