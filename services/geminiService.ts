
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Category, Budget } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (
  transactions: Transaction[],
  categories: Category[],
  budgets: Budget[]
): Promise<string> => {
  try {
    const dataSummary = transactions.map(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      return `${t.date}: ${t.type} of $${t.amount} for ${cat?.name || 'Unknown'} (${t.description})`;
    }).join('\n');

    const budgetSummary = budgets.map(b => {
      const cat = categories.find(c => c.id === b.categoryId);
      return `${cat?.name}: Limit $${b.limit}`;
    }).join('\n');

    const prompt = `
      As a personal financial advisor, analyze the following recent transactions and budgets:
      
      TRANSACTIONS:
      ${dataSummary}
      
      BUDGETS:
      ${budgetSummary}
      
      Please provide 3 concise, actionable financial insights or tips based on this data. 
      Format them as short bullet points. Be specific about spending categories and budget adherence.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate insights. Please check your internet connection.";
  }
};
