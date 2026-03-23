export type CategoryId =
  | 'science'
  | 'funFact'
  | 'history'
  | 'meme'
  | 'cinema'
  | 'birthday'
  | 'holiday'
  | 'quote';

export interface TimelineMeta {
  id: string;
  title: string;
  occurredOnLabel: string;
  sourceTitle: string;
  sourceUrl?: string;
  imageUrl?: string;
}

export interface ScienceData extends TimelineMeta {
  fieldLabel: string;
  emoji: string;
  summary: string;
  whyItMatters: string;
}

export interface FunFactData extends TimelineMeta {
  punchline: string;
  detail: string;
  source: string;
  absurdityLevel: 1 | 2 | 3 | 4 | 5;
  tags: string[];
}

export interface HistoryData extends TimelineMeta {
  year: number;
  era: string;
  narrative: string;
  consequence: string;
  region: string;
  importance: string;
}

export interface MemeData extends TimelineMeta {
  memeName: string;
  year: number;
  imageUrl: string;
  originStory: string;
  platform: string;
  stillUsed: boolean;
  relatedMemes: string[];
}

export interface CinemaData extends TimelineMeta {
  year: number;
  mediaType: string;
  people: string;
  funFact: string;
  posterUrl: string;
  tags: string[];
}

export interface Person {
  id: string;
  name: string;
  occurredOnLabel: string;
  birthYear: number;
  deathYear: number | null;
  field: string;
  nationality: string;
  summary: string;
  avatarUrl: string;
  sourceUrl?: string;
  isAlive: boolean;
}

export interface HolidayData extends TimelineMeta {
  holidayName: string;
  origin: string;
  purpose: string;
  howToCelebrate: string[];
  isOfficial: boolean;
  relatedCountries: string[];
}

export interface QuoteData extends TimelineMeta {
  quoteText: string;
  author: string;
  authorYears: string;
  context: string;
  portraitUrl: string;
  mood: string;
}

export interface DayData {
  date: string;
  science: ScienceData;
  funFact: FunFactData;
  history: HistoryData;
  meme: MemeData;
  cinema: CinemaData;
  birthdays: Person[];
  holiday: HolidayData;
  quote: QuoteData;
}

export interface DayCategoryPools {
  science: ScienceData[];
  funFact: FunFactData[];
  history: HistoryData[];
  meme: MemeData[];
  cinema: CinemaData[];
  birthday: Person[][];
  holiday: HolidayData[];
  quote: QuoteData[];
}
