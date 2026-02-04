import { GoogleGenAI } from "@google/genai";
import { SearchResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchExecutives = async (query: string, searchType: 'LOCATION' | 'COMPANY'): Promise<SearchResult> => {
  try {
    // Construct a prompt that guides the model to use the search tool effectively
    // and format the output in a readable way, specifically targeting the user's needs.
    const promptContext = searchType === 'LOCATION' 
      ? `Find major Tour Operators and Motorcoach companies in ${query}.` 
      : `Find details for the tour operator or motorcoach company named "${query}".`;

    const prompt = `
      ${promptContext}
      
      I need to locate key executives for these companies. Specifically look for:
      1. Company Name
      2. President / CEO
      3. VP of Marketing / Marketing Director
      4. VP of Sales / Sales Director
      5. Any publicly listed email addresses for these individuals or general press/sales contacts.
      
      If specific emails are not found, provide the link to their "Contact Us" or "About Team" page.
      
      Format the response clearly using Markdown. Use bold headings for Company Names.
      List the executives with their titles.
      Do not invent information. If a specific name or email isn't found, state "Not publicly listed".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract text
    const text = response.text || "No results found.";

    // Extract grounding chunks for citations
    // The structure can be complex, we safely navigate it
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to fetch results.");
  }
};