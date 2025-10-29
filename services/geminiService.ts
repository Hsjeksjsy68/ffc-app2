
import { GoogleGenAI, GenerateContentResponse, GroundingChunk as GenAIGroundingChunk } from "@google/genai";
import { NewsResult, MapResult, ImageResult, AnalysisResult, AspectRatio, GroundingChunk } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const getLatestNews = async (prompt: string): Promise<NewsResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Regarding Flameunter FC, ${prompt}`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const sources = (groundingMetadata?.groundingChunks as GroundingChunk[] || []).filter(chunk => chunk.web);

  return { text, sources };
};

export const findPlaces = async (prompt: string, location: GeolocationCoordinates): Promise<MapResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `For Flameunter FC, find places related to: ${prompt}`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        }
      }
    },
  });

  const text = response.text;
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const sources = (groundingMetadata?.groundingChunks as GroundingChunk[] || []).filter(chunk => chunk.maps);

  return { text, sources };
};

export const generateFanArt = async (prompt: string, aspectRatio: AspectRatio): Promise<ImageResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: `Epic fan art for Flameunter FC: ${prompt}`,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: aspectRatio,
    },
  });

  const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
  const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
  
  return { url: imageUrl, prompt };
};


export const analyzeMatchPhoto = async (prompt: string, imageBase64: string, mimeType: string): Promise<AnalysisResult> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const imagePart = {
        inlineData: {
            mimeType,
            data: imageBase64,
        },
    };
    const textPart = {
        text: prompt || "Analyze this Flameunter FC match photo. What is happening? Who has the advantage?"
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return { text: response.text };
};
