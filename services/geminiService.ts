import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in process.env.API_KEY");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateShoeCareTips = async (): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Error: API Key no configurada.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Eres un zapatero experto con 30 años de experiencia. 
      Acabo de cambiar las tapas de los tacones de un zapato de suela de cuero.
      
      Dame 3 consejos breves, prácticos y profesionales en formato Markdown para:
      1. Cuidar la nueva tapa.
      2. Mantener la suela de cuero hidratada.
      3. Cuándo saber que es hora de volver a cambiarla.
      
      Usa un tono amable pero técnico. Formato lista.`,
    });

    return response.text || "No se pudieron generar consejos en este momento.";
  } catch (error) {
    console.error("Error generating tips:", error);
    return "Hubo un error al consultar al experto zapatero virtual.";
  }
};