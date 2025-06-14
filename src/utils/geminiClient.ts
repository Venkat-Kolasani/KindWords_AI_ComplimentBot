import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI client
const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export { getGeminiClient };