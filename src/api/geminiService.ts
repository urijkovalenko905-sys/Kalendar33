import { GoogleGenAI, Type } from '@google/genai';
import { DayData } from '../types/DayData';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function fetchDayDataFromGemini(date: Date): Promise<DayData> {
  const dateStr = format(date, 'd MMMM', { locale: ru });
  const yearStr = format(date, 'yyyy');

  const prompt = `
    Сгенерируй интересный контент для календаря на дату: ${dateStr}.
    Текущий год для контекста: ${yearStr}.
    Используй инструмент googleSearch, чтобы найти актуальную и точную информацию о событиях, произошедших в этот день в истории.
    
    Верни данные строго в формате JSON, соответствующем следующей схеме:
    {
      "date": "YYYY-MM-DD",
      "science": {
        "year": number,
        "headline": string,
        "story": string,
        "scientist": string,
        "category": "физика" | "химия" | "биология" | "космос" | "медицина" | "технологии",
        "mindBlownFact": string,
        "emoji": string
      },
      "funFact": {
        "punchline": string,
        "detail": string,
        "source": string,
        "absurdityLevel": number (1-5),
        "tags": string[]
      },
      "history": {
        "year": number,
        "era": "древность" | "средневековье" | "новое_время" | "XX_век" | "XXI_век",
        "title": string,
        "narrative": string,
        "consequence": string,
        "region": string,
        "importance": "локальное" | "региональное" | "мировое"
      },
      "meme": {
        "memeName": string,
        "year": number,
        "imageUrl": string (URL to a placeholder image, e.g., https://picsum.photos/seed/meme/400/300),
        "originStory": string,
        "platform": string,
        "stillUsed": boolean,
        "relatedMemes": string[]
      },
      "cinema": {
        "title": string,
        "type": "фильм" | "альбом" | "сингл" | "сериал",
        "year": number,
        "creator": string,
        "genre": string[],
        "funFact": string,
        "rating": number (0-10),
        "posterUrl": string (URL to a placeholder image, e.g., https://picsum.photos/seed/cinema/300/450),
        "quote": string
      },
      "birthdays": [
        {
          "name": string,
          "birthYear": number,
          "deathYear": number | null,
          "field": string,
          "nationality": string,
          "quirkyFact": string,
          "avatarUrl": string (URL to a placeholder image, e.g., https://picsum.photos/seed/person1/150/150),
          "isAlive": boolean
        }
      ], // up to 5 people
      "holiday": {
        "holidayName": string,
        "origin": string,
        "purpose": string,
        "howToCelebrate": string[], // exactly 3 items
        "isOfficial": boolean,
        "relatedCountries": string[] // emoji flags
      },
      "quote": {
        "quoteText": string,
        "author": string,
        "authorYears": string,
        "context": string,
        "portraitUrl": string (URL to a placeholder image, e.g., https://picsum.photos/seed/author/150/150),
        "mood": "вдохновляющая" | "саркастическая" | "философская" | "смешная"
      }
    }
    
    Убедись, что все тексты написаны на русском языке, интересно и увлекательно.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  const text = response.text;
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;

  try {
    return JSON.parse(jsonStr) as DayData;
  } catch (e) {
    console.error("Failed to parse JSON from Gemini", text);
    throw e;
  }
}
