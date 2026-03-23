import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import {
  CinemaData,
  DayCategoryPools,
  FunFactData,
  HistoryData,
  HolidayData,
  MemeData,
  Person,
  QuoteData,
  ScienceData,
} from '../types/DayData';

interface WikiPage {
  title?: string;
  description?: string;
  extract?: string;
  thumbnail?: {
    source?: string;
  };
  content_urls?: {
    desktop?: {
      page?: string;
    };
  };
  titles?: {
    normalized?: string;
  };
}

interface WikiEntry {
  text?: string;
  year?: number;
  pages?: WikiPage[];
}

interface WikiOnThisDayResponse {
  selected?: WikiEntry[] | WikiEntry | Record<string, never>;
  events?: WikiEntry[];
  births?: WikiEntry[];
  deaths?: WikiEntry[];
  holidays?: WikiEntry[];
}

const API_URL = 'https://ru.wikipedia.org/api/rest_v1/feed/onthisday/all';
const CACHE_PREFIX = 'fun-calendar-on-this-day';
const MAX_POOL_SIZE = 12;

const SCIENCE_KEYWORDS = ['наук', 'физ', 'хим', 'биолог', 'медицин', 'косм', 'спутник', 'телескоп', 'технолог', 'астроном'];
const CINEMA_KEYWORDS = ['фильм', 'кино', 'сериал', 'альбом', 'песня', 'группа', 'актёр', 'актриса', 'режисс', 'премьера', 'музык'];
const MEME_KEYWORDS = ['интернет', 'мем', 'соцсеть', 'видеоигра', 'игра', 'видеоклип', 'телешоу', 'аниме', 'мульт', 'поп-культур', 'сингл'];
const ODD_KEYWORDS = ['впервые', 'самый', 'необыч', 'рекорд', 'авария', 'экспедиция', 'тайн', 'сенсац', 'курьёз', 'массов', 'скандал'];

function getCacheKey(date: Date) {
  return `${CACHE_PREFIX}:${format(date, 'yyyy-MM-dd')}`;
}

function readCache(date: Date): DayCategoryPools | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(getCacheKey(date));
    return raw ? (JSON.parse(raw) as DayCategoryPools) : null;
  } catch {
    return null;
  }
}

function writeCache(date: Date, data: DayCategoryPools) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(getCacheKey(date), JSON.stringify(data));
  } catch {
    // Ignore storage limits.
  }
}

function formatDayMonth(date: Date) {
  return format(date, 'd MMMM', { locale: ru });
}

function formatOccurredOn(date: Date, year?: number | null) {
  return year ? `${formatDayMonth(date)} ${year} года` : formatDayMonth(date);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function compact(text?: string, fallback = '') {
  return (text ?? fallback).replace(/\s+/g, ' ').trim();
}

function titleize(text: string) {
  const value = compact(text);
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}

function firstPage(entry: WikiEntry) {
  return Array.isArray(entry.pages) ? entry.pages[0] : undefined;
}

function pageTitle(page?: WikiPage, fallback = 'Статья дня') {
  return compact(page?.titles?.normalized || page?.title, fallback);
}

function pageDescription(page?: WikiPage, fallback = '') {
  return compact(page?.extract || page?.description, fallback);
}

function pageUrl(page?: WikiPage) {
  return page?.content_urls?.desktop?.page;
}

function pageImage(page?: WikiPage, seed = 'fun-calendar') {
  return page?.thumbnail?.source || `https://picsum.photos/seed/${seed}/640/480`;
}

function textBlob(entry: WikiEntry) {
  const page = firstPage(entry);
  return compact([entry.text, pageTitle(page), pageDescription(page)].filter(Boolean).join(' ')).toLowerCase();
}

function includesKeyword(entry: WikiEntry, keywords: string[]) {
  const blob = textBlob(entry);
  return keywords.some((keyword) => blob.includes(keyword));
}

function normalizeSelected(selected: WikiOnThisDayResponse['selected']) {
  if (Array.isArray(selected)) {
    return selected;
  }

  if (selected && typeof selected === 'object' && Object.keys(selected).length > 0 && 'text' in selected) {
    return [selected as WikiEntry];
  }

  return [];
}

function dedupeEntries(entries: WikiEntry[]) {
  const seen = new Set<string>();
  const result: WikiEntry[] = [];

  for (const entry of entries) {
    const key = `${entry.year ?? 'na'}:${compact(entry.text)}`;
    if (!compact(entry.text) || seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(entry);
  }

  return result;
}

function takePool(primary: WikiEntry[], fallback: WikiEntry[], size = MAX_POOL_SIZE) {
  const merged = dedupeEntries([...primary, ...fallback]);
  return merged.slice(0, size);
}

function inferScienceField(entry: WikiEntry) {
  const blob = textBlob(entry);

  if (blob.includes('косм') || blob.includes('спутник') || blob.includes('телескоп')) return 'Космос';
  if (blob.includes('медицин') || blob.includes('врач')) return 'Медицина';
  if (blob.includes('хим')) return 'Химия';
  if (blob.includes('биолог')) return 'Биология';
  if (blob.includes('технолог') || blob.includes('компьютер')) return 'Технологии';
  if (blob.includes('физ')) return 'Физика';
  return 'Наука';
}

function inferEra(year: number) {
  if (year < 500) return 'Древность';
  if (year < 1500) return 'Средневековье';
  if (year < 1914) return 'Новое время';
  if (year < 2000) return 'XX век';
  return 'XXI век';
}

function inferImportance(entry: WikiEntry) {
  const blob = textBlob(entry);
  if (blob.includes('миров') || blob.includes('международ')) return 'Мировое';
  if (blob.includes('европ') || blob.includes('росси') || blob.includes('совет')) return 'Региональное';
  return 'Значимое';
}

function inferRegion(entry: WikiEntry) {
  const page = firstPage(entry);
  return pageDescription(page, 'Историческая дата');
}

function inferWeirdness(entry: WikiEntry): 1 | 2 | 3 | 4 | 5 {
  const blob = textBlob(entry);
  const score = ODD_KEYWORDS.filter((keyword) => blob.includes(keyword)).length;
  return Math.max(1, Math.min(5, score + 2)) as 1 | 2 | 3 | 4 | 5;
}

function extractTags(entry: WikiEntry, defaults: string[]) {
  const blob = textBlob(entry);
  const tags = new Set(defaults);

  if (blob.includes('косм')) tags.add('космос');
  if (blob.includes('войн')) tags.add('история');
  if (blob.includes('наук')) tags.add('наука');
  if (blob.includes('интернет')) tags.add('интернет');
  if (blob.includes('фильм')) tags.add('кино');
  if (blob.includes('музык')) tags.add('музыка');
  if (blob.includes('спорт')) tags.add('спорт');

  return Array.from(tags).slice(0, 4);
}

function inferMediaType(entry: WikiEntry) {
  const blob = textBlob(entry);

  if (blob.includes('сериал')) return 'Сериал';
  if (blob.includes('альбом')) return 'Альбом';
  if (blob.includes('песня') || blob.includes('сингл')) return 'Сингл';
  return 'Событие культуры';
}

function inferPlatform(entry: WikiEntry) {
  const blob = textBlob(entry);

  if (blob.includes('интернет')) return 'Интернет';
  if (blob.includes('игра')) return 'Видеоигры';
  if (blob.includes('теле')) return 'Телевидение';
  if (blob.includes('музык')) return 'Музыка';
  return 'Поп-культура';
}

function inferHolidayFlags(entry: WikiEntry) {
  const blob = textBlob(entry);
  if (blob.includes('росси')) return ['🇷🇺'];
  if (blob.includes('международ')) return ['🌍'];
  if (blob.includes('православ')) return ['⛪'];
  return ['🎉'];
}

function buildHolidayTips(title: string) {
  return [
    `Отметить ${title.toLowerCase()} маленьким тематическим ритуалом дома.`,
    'Поделиться фактом об этой дате с друзьями или в чате.',
    'Сделать фото или заметку дня, чтобы привязать праздник к памяти.',
  ];
}

function splitBirthText(entry: WikiEntry) {
  const raw = compact(entry.text);
  const [name, ...rest] = raw.split(',');
  return {
    name: compact(name, pageTitle(firstPage(entry), 'Имя дня')),
    detail: compact(rest.join(','), pageDescription(firstPage(entry), 'Родился в эту дату.')),
  };
}

function createSciencePool(date: Date, entries: WikiEntry[]): ScienceData[] {
  return entries.map((entry, index) => {
    const page = firstPage(entry);
    const title = pageTitle(page, `Научное событие ${index + 1}`);
    const year = entry.year ?? new Date().getFullYear();
    const summary = `${formatOccurredOn(date, year)} произошло событие: ${compact(entry.text)}.`;
    const whyItMatters = pageDescription(page, 'Эта дата закрепилась в исторической хронике науки.');

    return {
      id: `science-${year}-${slugify(title)}`,
      title,
      occurredOnLabel: formatOccurredOn(date, year),
      sourceTitle: title,
      sourceUrl: pageUrl(page),
      imageUrl: pageImage(page, `science-${slugify(title)}`),
      fieldLabel: inferScienceField(entry),
      emoji: inferScienceField(entry) === 'Космос' ? '🚀' : '🔬',
      summary,
      whyItMatters,
    };
  });
}

function createFunFactPool(date: Date, entries: WikiEntry[]): FunFactData[] {
  return entries.map((entry, index) => {
    const page = firstPage(entry);
    const title = pageTitle(page, `Факт дня ${index + 1}`);
    const year = entry.year ?? new Date().getFullYear();

    return {
      id: `fun-${year}-${slugify(title)}`,
      title,
      occurredOnLabel: formatOccurredOn(date, year),
      sourceTitle: title,
      sourceUrl: pageUrl(page),
      imageUrl: pageImage(page, `fun-${slugify(title)}`),
      punchline: titleize(compact(entry.text, title)),
      detail: `${formatOccurredOn(date, year)}: ${compact(entry.text)} ${pageDescription(page)}`.trim(),
      source: title,
      absurdityLevel: inferWeirdness(entry),
      tags: extractTags(entry, ['дата']),
    };
  });
}

function createHistoryPool(date: Date, entries: WikiEntry[]): HistoryData[] {
  return entries.map((entry, index) => {
    const page = firstPage(entry);
    const title = pageTitle(page, `Историческое событие ${index + 1}`);
    const year = entry.year ?? new Date().getFullYear();

    return {
      id: `history-${year}-${slugify(title)}`,
      title,
      year,
      occurredOnLabel: formatOccurredOn(date, year),
      sourceTitle: title,
      sourceUrl: pageUrl(page),
      imageUrl: pageImage(page, `history-${slugify(title)}`),
      era: inferEra(year),
      narrative: `${formatOccurredOn(date, year)} — ${compact(entry.text)}.`,
      consequence: pageDescription(page, 'Эта дата закрепилась в исторических хрониках.'),
      region: inferRegion(entry),
      importance: inferImportance(entry),
    };
  });
}

function createMemePool(date: Date, entries: WikiEntry[]): MemeData[] {
  return entries.map((entry, index) => {
    const page = firstPage(entry);
    const title = pageTitle(page, `Поп-культурный момент ${index + 1}`);
    const year = entry.year ?? new Date().getFullYear();
    const related = Array.isArray(entry.pages)
      ? entry.pages.slice(1, 4).map((item) => pageTitle(item)).filter(Boolean)
      : [];

    return {
      id: `meme-${year}-${slugify(title)}`,
      title,
      memeName: title,
      year,
      occurredOnLabel: formatOccurredOn(date, year),
      sourceTitle: title,
      sourceUrl: pageUrl(page),
      imageUrl: pageImage(page, `meme-${slugify(title)}`),
      originStory: `${formatOccurredOn(date, year)} произошло культурное событие: ${compact(entry.text)} ${pageDescription(page)}`.trim(),
      platform: inferPlatform(entry),
      stillUsed: year >= 1995,
      relatedMemes: related,
    };
  });
}

function createCinemaPool(date: Date, entries: WikiEntry[]): CinemaData[] {
  return entries.map((entry, index) => {
    const page = firstPage(entry);
    const title = pageTitle(page, `Кино и музыка ${index + 1}`);
    const year = entry.year ?? new Date().getFullYear();

    return {
      id: `cinema-${year}-${slugify(title)}`,
      title,
      year,
      occurredOnLabel: formatOccurredOn(date, year),
      sourceTitle: title,
      sourceUrl: pageUrl(page),
      imageUrl: pageImage(page, `cinema-${slugify(title)}`),
      mediaType: inferMediaType(entry),
      people: pageDescription(page, 'Культурное событие этой даты'),
      funFact: `${formatOccurredOn(date, year)}: ${compact(entry.text)} ${pageDescription(page)}`.trim(),
      posterUrl: pageImage(page, `cinema-poster-${slugify(title)}`),
      tags: extractTags(entry, ['культура']),
    };
  });
}

function createBirthdays(date: Date, entries: WikiEntry[]): Person[] {
  return entries.map((entry, index) => {
    const page = firstPage(entry);
    const year = entry.year ?? new Date().getFullYear();
    const birth = splitBirthText(entry);

    return {
      id: `birth-${year}-${slugify(birth.name)}`,
      name: birth.name,
      occurredOnLabel: formatOccurredOn(date, year),
      birthYear: year,
      deathYear: null,
      field: pageDescription(page, birth.detail),
      nationality: birth.detail || 'Персона дня',
      summary: `${formatOccurredOn(date, year)} родился ${birth.name}. ${birth.detail}`.trim(),
      avatarUrl: pageImage(page, `birth-${slugify(birth.name)}`),
      sourceUrl: pageUrl(page),
      isAlive: year >= new Date().getFullYear() - 85,
    };
  });
}

function chunkBirthdays(items: Person[], date: Date) {
  if (items.length === 0) {
    return [[{
      id: 'birth-empty',
      name: 'Нет точной подборки',
      occurredOnLabel: formatDayMonth(date),
      birthYear: date.getFullYear(),
      deathYear: null,
      field: 'Рождения не найдены',
      nationality: 'Источник не вернул список рождений',
      summary: 'Для этой даты не удалось получить подборку рождений.',
      avatarUrl: 'https://picsum.photos/seed/birth-empty/300/300',
      isAlive: false,
    }]];
  }

  const groups: Person[][] = [];
  for (let index = 0; index < items.length; index += 5) {
    groups.push(items.slice(index, index + 5));
  }

  return groups;
}

function createHolidayPool(date: Date, entries: WikiEntry[]): HolidayData[] {
  if (entries.length === 0) {
    const dateLabel = formatDayMonth(date);
    return [{
      id: `holiday-empty-${format(date, 'MMdd')}`,
      title: `На ${dateLabel} отдельный праздник не найден`,
      holidayName: `На ${dateLabel} отдельный праздник не найден`,
      occurredOnLabel: dateLabel,
      sourceTitle: 'Русская Википедия',
      purpose: `В источнике не нашлось отдельного праздника на ${dateLabel}, поэтому сегодня можно сосредоточиться на событиях и людях этой даты.`,
      origin: 'Календарная справка',
      howToCelebrate: [
        'Выбрать историческое событие этого дня и обсудить его.',
        'Открыть рандомайзер и найти самую неожиданную историю даты.',
        'Сохранить понравившуюся карточку в избранное.',
      ],
      isOfficial: false,
      relatedCountries: ['🗓️'],
    }];
  }

  return entries.map((entry, index) => {
    const page = firstPage(entry);
    const holidayName = titleize(compact(entry.text, pageTitle(page, `Праздник ${index + 1}`)));

    return {
      id: `holiday-${slugify(holidayName)}`,
      title: holidayName,
      holidayName,
      occurredOnLabel: formatDayMonth(date),
      sourceTitle: pageTitle(page, holidayName),
      sourceUrl: pageUrl(page),
      imageUrl: pageImage(page, `holiday-${slugify(holidayName)}`),
      origin: pageDescription(page, 'Памятная дата'),
      purpose: `${formatDayMonth(date)} отмечают ${holidayName.toLowerCase()}. ${pageDescription(page)}`.trim(),
      howToCelebrate: buildHolidayTips(holidayName),
      isOfficial: textBlob(entry).includes('официаль') || textBlob(entry).includes('международ'),
      relatedCountries: inferHolidayFlags(entry),
    };
  });
}

function createMemoryPool(date: Date, entries: WikiEntry[]): QuoteData[] {
  if (entries.length === 0) {
    const dateLabel = formatDayMonth(date);
    return [{
      id: `memory-empty-${format(date, 'MMdd')}`,
      title: `Память ${dateLabel}`,
      occurredOnLabel: dateLabel,
      sourceTitle: 'Русская Википедия',
      quoteText: `Для ${dateLabel} в подборке не нашлось отдельной памятной записи.`,
      author: 'Память дня',
      authorYears: dateLabel,
      context: 'Попробуй открыть другую карточку даты через рандомайзер.',
      portraitUrl: 'https://picsum.photos/seed/memory-empty/300/300',
      mood: 'спокойная',
    }];
  }

  return entries.map((entry, index) => {
    const page = firstPage(entry);
    const title = pageTitle(page, `Память дня ${index + 1}`);
    const deathYear = entry.year ?? new Date().getFullYear();
    const summary = pageDescription(page, compact(entry.text));

    return {
      id: `memory-${deathYear}-${slugify(title)}`,
      title,
      occurredOnLabel: formatOccurredOn(date, deathYear),
      sourceTitle: title,
      sourceUrl: pageUrl(page),
      imageUrl: pageImage(page, `memory-${slugify(title)}`),
      quoteText: `${formatOccurredOn(date, deathYear)} умер ${title}.`,
      author: title,
      authorYears: `ум. ${deathYear}`,
      context: summary || compact(entry.text, 'Эта дата отмечена как памятная.'),
      portraitUrl: pageImage(page, `memory-portrait-${slugify(title)}`),
      mood: 'памятная',
    };
  });
}

async function fetchRawForDate(date: Date) {
  const month = format(date, 'MM');
  const day = format(date, 'dd');
  const response = await fetch(`${API_URL}/${month}/${day}`);

  if (!response.ok) {
    throw new Error(`Wikipedia API returned ${response.status}`);
  }

  return response.json() as Promise<WikiOnThisDayResponse>;
}

export async function fetchOnThisDayPools(date: Date): Promise<DayCategoryPools> {
  try {
    const raw = await fetchRawForDate(date);
    const selected = normalizeSelected(raw.selected);
    const events = dedupeEntries([...selected, ...(raw.events ?? [])]);
    const births = dedupeEntries(raw.births ?? []);
    const deaths = dedupeEntries(raw.deaths ?? []);
    const holidays = dedupeEntries(raw.holidays ?? []);

    const scienceEntries = takePool(events.filter((entry) => includesKeyword(entry, SCIENCE_KEYWORDS)), events);
    const cinemaEntries = takePool(events.filter((entry) => includesKeyword(entry, CINEMA_KEYWORDS)), events.filter((entry) => (entry.year ?? 0) >= 1900));
    const memeEntries = takePool(events.filter((entry) => includesKeyword(entry, MEME_KEYWORDS)), events.filter((entry) => (entry.year ?? 0) >= 1950));
    const funEntries = takePool(events.filter((entry) => includesKeyword(entry, ODD_KEYWORDS)), events);
    const historyEntries = takePool(events, selected.length ? selected : events);

    const pools: DayCategoryPools = {
      science: createSciencePool(date, scienceEntries),
      funFact: createFunFactPool(date, funEntries),
      history: createHistoryPool(date, historyEntries),
      meme: createMemePool(date, memeEntries),
      cinema: createCinemaPool(date, cinemaEntries),
      birthday: chunkBirthdays(createBirthdays(date, births), date),
      holiday: createHolidayPool(date, holidays),
      quote: createMemoryPool(date, deaths),
    };

    writeCache(date, pools);
    return pools;
  } catch (error) {
    const cached = readCache(date);
    if (cached) {
      return cached;
    }

    throw error;
  }
}
