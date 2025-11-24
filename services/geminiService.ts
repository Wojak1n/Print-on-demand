import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMarketingCopy = async (designTitle: string, category: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, catchy, and creative product description (max 2 sentences) for a design titled "${designTitle}" in the "${category}" category. This is for a high-end print-on-demand fashion brand.`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text || "A unique design reflecting modern aesthetics.";
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return "Exclusive design limited edition.";
  }
};

export const generateSVGDesign = async (prompt: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a professional vector graphic designer. 
    Your task is to generate SVG code for a t-shirt design based on the user's prompt.
    
    Rules:
    1. Return ONLY valid SVG code. Do not wrap it in markdown blocks (no \`\`\`xml or \`\`\`svg).
    2. The SVG must have a 'viewBox="0 0 500 500"'.
    3. The SVG must have a transparent background (do not add a background rect).
    4. Use vibrant, high-contrast colors suitable for printing.
    5. Keep the design centered in the viewBox.
    6. Do not include any text explanation, only the raw SVG string.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: `Design concept: ${prompt}`,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    let svg = response.text || "";
    // Cleanup if the model accidentally adds markdown
    svg = svg.replace(/```svg/g, '').replace(/```xml/g, '').replace(/```/g, '').trim();
    return svg;
  } catch (error) {
    console.error("Gemini SVG generation failed:", error);
    // Return a fallback SVG
    return `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <circle cx="250" cy="250" r="200" fill="#FFD700" />
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="50" font-family="sans-serif" fill="#000">Error</text>
    </svg>`;
  }
};