
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: "The name of the recipe.",
      },
      description: {
        type: Type.STRING,
        description: "A brief, enticing description of the dish.",
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "A list of ingredients required for the recipe.",
      },
      instructions: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "Step-by-step instructions to prepare the dish.",
      },
    },
    required: ["recipeName", "description", "ingredients", "instructions"],
  },
};

export async function generateRecipesFromImage(
  base64Image: string,
  mimeType: string
): Promise<Recipe[]> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const textPart = {
      text: `Identify the food ingredients in this image. Based on the identified ingredients, generate 3 delicious and easy-to-make recipes. Respond with a valid JSON array of objects. Each object must have the following properties: "recipeName", "description", "ingredients", and "instructions". Do not include any text outside of the JSON array.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    const recipes = JSON.parse(jsonText);
    
    return recipes as Recipe[];

  } catch (error) {
    console.error("Error generating recipes:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate recipes from image. Reason: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating recipes.");
  }
}
