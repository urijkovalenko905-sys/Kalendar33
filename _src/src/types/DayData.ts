export type CategoryId = 
  | 'science' | 'funFact' | 'history' | 'meme' 
  | 'cinema' | 'birthday' | 'holiday' | 'quote'

export interface ScienceData {
  year:           number
  headline:       string        // Dramatic headline in Russian
  story:          string        // 3–4 sentences
  scientist:      string
  category:       'физика' | 'химия' | 'биология' | 'космос' | 'медицина' | 'технологии'
  mindBlownFact:  string
  emoji:          string
}

export interface FunFactData {
  punchline:      string
  detail:         string
  source:         string
  absurdityLevel: 1 | 2 | 3 | 4 | 5
  tags:           string[]
}

export interface HistoryData {
  year:         number
  era:          'древность' | 'средневековье' | 'новое_время' | 'XX_век' | 'XXI_век'
  title:        string
  narrative:    string
  consequence:  string
  region:       string
  importance:   'локальное' | 'региональное' | 'мировое'
}

export interface MemeData {
  memeName:      string
  year:          number
  imageUrl:      string
  originStory:   string
  platform:      string
  stillUsed:     boolean
  relatedMemes:  string[]
}

export interface CinemaData {
  title:      string
  type:       'фильм' | 'альбом' | 'сингл' | 'сериал'
  year:       number
  creator:    string
  genre:      string[]
  funFact:    string
  rating:     number   // 0–10
  posterUrl:  string
  quote:      string
}

export interface Person {
  name:        string
  birthYear:   number
  deathYear:   number | null
  field:       string
  nationality: string  // e.g., "🇷🇺 Россия"
  quirkyFact:  string
  avatarUrl:   string
  isAlive:     boolean
}

export interface HolidayData {
  holidayName:      string
  origin:           string
  purpose:          string
  howToCelebrate:   string[]  // 3 items
  isOfficial:       boolean
  relatedCountries: string[]  // emoji flags
}

export interface QuoteData {
  quoteText:    string
  author:       string
  authorYears:  string  // "1828–1910"
  context:      string
  portraitUrl:  string
  mood:         'вдохновляющая' | 'саркастическая' | 'философская' | 'смешная'
}

export interface DayData {
  date:     string          // "2026-03-21"
  science:  ScienceData
  funFact:  FunFactData
  history:  HistoryData
  meme:     MemeData
  cinema:   CinemaData
  birthdays: Person[]
  holiday:  HolidayData
  quote:    QuoteData
}
