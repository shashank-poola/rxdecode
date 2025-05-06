import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_KEY);

export const searchMedicineWithAI = async (query: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `As a medical information assistant, provide accurate information about the medicine: ${query}. 
                   Include:
                   1. Common uses and purposes
                   2. Typical dosage guidelines
                   3. Important safety information and precautions
                   4. Common side effects
                   
                   Format the response in clear, simple language that's easy to understand.
                   
                   Important: Always include a medical disclaimer at the end.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI search error:', error);
    throw new Error('Failed to get AI-powered medicine information');
  }
};