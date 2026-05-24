/**
 * Gemini AI Service
 * Wraps Google Generative AI SDK with helper methods
 * Model: gemini-1.5-flash (fast + cheap) or gemini-1.5-pro (smarter)
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use flash for speed/cost, pro for evaluations
const flashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const proModel   = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

/**
 * Chat with history (for interview conversations)
 * @param {string} systemPrompt - Role/instructions for the AI
 * @param {Array}  history      - [{role:'user'|'model', parts:[{text:'...'}]}]
 * @param {string} userMessage  - Latest user message
 */
async function chat(systemPrompt, history, userMessage) {
  const chat = flashModel.startChat({
    history,
    systemInstruction: systemPrompt,
    generationConfig: { maxOutputTokens: 500, temperature: 0.8 },
  });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

/**
 * One-shot generation (for resume analysis, scoring)
 * @param {string} prompt
 * @param {boolean} usePro - use pro model for better JSON accuracy
 */
async function generate(prompt, usePro = false) {
  const model = usePro ? proModel : flashModel;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { chat, generate };
