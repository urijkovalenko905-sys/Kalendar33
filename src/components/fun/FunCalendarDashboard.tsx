import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Dice5, Sparkles, Target, WandSparkles } from 'lucide-react';
import { DayData, CategoryId } from '../../types/DayData';
import { GlassCard } from '../shared/GlassCard';
import { useTelegram } from '../../telegram/useTelegram';

const CATEGORY_META: { id: CategoryId; label: string; emoji: string; accent: string }[] = [
  { id: 'science', label: 'Наука', emoji: '🔬', accent: 'var(--accent-science)' },
  { id: 'funFact', label: 'Факт', emoji: '😄', accent: 'var(--accent-fun)' },
  { id: 'history', label: 'История', emoji: '📜', accent: 'var(--accent-history)' },
  { id: 'meme', label: 'Мем', emoji: '🐣', accent: 'var(--accent-meme)' },
  { id: 'cinema', label: 'Кино', emoji: '🎬', accent: 'var(--accent-cinema)' },
  { id: 'birthday', label: 'ДР', emoji: '🎂', accent: 'var(--accent-birthday)' },
  { id: 'holiday', label: 'Праздник', emoji: '🌍', accent: 'var(--accent-holiday)' },
  { id: 'quote', label: 'Цитата', emoji: '💡', accent: 'var(--accent-quote)' },
];

const MOOD_THEMES = {
  wow: {
    label: 'Вау-режим',
    emoji: '🤩',
    accent: '#ffd166',
    hint: 'Идеальный день, чтобы удивляться всему подряд.',
  },
  cozy: {
    label: 'Уютный вайб',
    emoji: '☕',
    accent: '#ff9f7f',
    hint: 'Сегодня подойдут мягкие истории и тёплые цитаты.',
  },
  chaos: {
    label: 'Немного хаоса',
    emoji: '🎉',
    accent: '#8aff80',
    hint: 'Нажимай на сюрприз и смотри, куда занесёт.',
  },
  brain: {
    label: 'Мозг сияет',
    emoji: '🧠',
    accent: '#7cc9ff',
    hint: 'День для науки, истории и неожиданных связей.',
  },
} as const;

type MoodId = keyof typeof MOOD_THEMES;

interface FunCalendarDashboardProps {
  data: DayData | null;
  dateKey: string;
  activeCategory: CategoryId;
  onCategorySelect: (id: CategoryId) => void;
}

interface DailyState {
  visited: CategoryId[];
  mood: MoodId | null;
  surpriseCount: number;
  revealedMessage: string | null;
}

const DEFAULT_STATE: DailyState = {
  visited: [],
  mood: null,
  surpriseCount: 0,
  revealedMessage: null,
};

function getStorageKey(dateKey: string) {
  return `fun-calendar-state:${dateKey}`;
}

function loadDailyState(dateKey: string): DailyState {
  try {
    const raw = localStorage.getItem(getStorageKey(dateKey));
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) as DailyState };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveDailyState(dateKey: string, state: DailyState) {
  try {
    localStorage.setItem(getStorageKey(dateKey), JSON.stringify(state));
  } catch {
    // Ignore storage issues in restricted environments.
  }
}

function createSurpriseMessage(data: DayData | null, mood: MoodId | null) {
  const moodText = mood ? MOOD_THEMES[mood].label.toLowerCase() : 'режим любопытства';
  const options = [
    `Сюрприз дня: включён ${moodText}. Переключись на случайную карточку и собери новую эмоцию.`,
    `Мини-миссия: найди факт, которым захочется поделиться в чате уже через 30 секунд.`,
    data?.holiday.holidayName
      ? `Идея дня: отмечай как ${data.holiday.holidayName.toLowerCase()} и придумай своё маленькое правило веселья.`
      : 'Идея дня: выбери любую карточку и представь, что она получила саундтрек.',
    data?.quote.author
      ? `Подсказка вселенной: прочитай карточку с цитатой так, будто ${data.quote.author} написал её именно тебе.`
      : 'Подсказка вселенной: открой карточку, которую обычно пропускаешь первой.',
  ];

  return options[Math.floor(Math.random() * options.length)];
}

export const FunCalendarDashboard: React.FC<FunCalendarDashboardProps> = ({
  data,
  dateKey,
  activeCategory,
  onCategorySelect,
}) => {
  const { haptic } = useTelegram();
  const [dailyState, setDailyState] = useState<DailyState>(() => loadDailyState(dateKey));

  useEffect(() => {
    setDailyState(loadDailyState(dateKey));
  }, [dateKey]);

  useEffect(() => {
    setDailyState((current) => {
      if (current.visited.includes(activeCategory)) {
        return current;
      }

      const nextState = {
        ...current,
        visited: [...current.visited, activeCategory],
      };
      saveDailyState(dateKey, nextState);
      return nextState;
    });
  }, [activeCategory, dateKey]);

  const energyScore = useMemo(() => {
    const base = dailyState.visited.length * 12 + dailyState.surpriseCount * 14 + (dailyState.mood ? 16 : 0);
    return Math.min(100, base + 18);
  }, [dailyState]);

  const quests = [
    {
      label: 'Выбрать настроение дня',
      done: Boolean(dailyState.mood),
    },
    {
      label: 'Открыть 4 карточки',
      done: dailyState.visited.length >= 4,
    },
    {
      label: 'Запустить сюрприз',
      done: dailyState.surpriseCount > 0,
    },
  ];

  const completedQuests = quests.filter((quest) => quest.done).length;

  const handleMoodSelect = (mood: MoodId) => {
    haptic.light();
    const nextState = { ...dailyState, mood };
    setDailyState(nextState);
    saveDailyState(dateKey, nextState);
  };

  const handleRandomCategory = () => {
    const available = CATEGORY_META.filter((item) => item.id !== activeCategory);
    const picked = available[Math.floor(Math.random() * available.length)];
    haptic.medium();
    onCategorySelect(picked.id);
  };

  const handleSurprise = () => {
    const picked = CATEGORY_META[Math.floor(Math.random() * CATEGORY_META.length)];
    const revealedMessage = createSurpriseMessage(data, dailyState.mood);
    const nextState = {
      ...dailyState,
      surpriseCount: dailyState.surpriseCount + 1,
      revealedMessage,
    };

    setDailyState(nextState);
    saveDailyState(dateKey, nextState);
    onCategorySelect(picked.id);
    haptic.success();

    confetti({
      particleCount: 90,
      spread: 95,
      startVelocity: 30,
      scalar: 0.9,
      origin: { y: 0.25 },
      colors: ['#FF6B6B', '#FFD166', '#4ECDC4', '#7CC9FF', '#C471ED'],
      disableForReducedMotion: true,
      zIndex: 100,
    });
  };

  const activeMood = dailyState.mood ? MOOD_THEMES[dailyState.mood] : null;

  return (
    <div className="space-y-4 mb-6">
      <GlassCard
        className="fun-hero-card overflow-hidden"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="fun-hero-orb fun-hero-orb--one" />
        <div className="fun-hero-orb fun-hero-orb--two" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-label text-white/70 mb-2">Весёлый режим дня</div>
              <h2 className="text-h1 text-white mb-2">Календарь, с которым хочется играть</h2>
              <p className="text-body text-white/75 max-w-[28rem]">
                Переключай настроение, запускай сюрприз и собирай энергию дня из карточек.
              </p>
            </div>
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/8 text-3xl"
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.04, 1] }}
              transition={{ duration: 4.8, repeat: Infinity }}
            >
              {activeMood?.emoji ?? '🪩'}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="fun-stat-card">
              <div className="text-label text-white/60 mb-1">Энергия дня</div>
              <div className="text-h1 text-white">{energyScore}%</div>
              <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full fun-progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${energyScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="fun-stat-card">
              <div className="text-label text-white/60 mb-1">Мини-квесты</div>
              <div className="text-h1 text-white">{completedQuests}/3</div>
              <div className="text-caption text-white/65 mt-2">
                {completedQuests === 3 ? 'Ты сегодня главный по хорошему настроению.' : 'Ещё немного и день станет легендарным.'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(MOOD_THEMES) as MoodId[]).map((mood) => {
              const theme = MOOD_THEMES[mood];
              const isActive = dailyState.mood === mood;

              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => handleMoodSelect(mood)}
                  className="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: isActive ? `color-mix(in srgb, ${theme.accent} 26%, rgba(255,255,255,0.08))` : 'rgba(255,255,255,0.05)',
                    borderColor: isActive ? theme.accent : 'rgba(255,255,255,0.10)',
                    color: '#fff',
                  }}
                >
                  <span className="mr-2">{theme.emoji}</span>
                  {theme.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleSurprise} className="fun-action-button fun-action-button--primary">
              <WandSparkles size={18} />
              Открыть сюрприз дня
            </button>
            <button type="button" onClick={handleRandomCategory} className="fun-action-button">
              <Dice5 size={18} />
              Случайная карточка
            </button>
          </div>

          {activeMood && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles size={16} color={activeMood.accent} />
                {activeMood.label}
              </div>
              <div className="text-body text-white/70 mt-1">{activeMood.hint}</div>
            </motion.div>
          )}

          {dailyState.revealedMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-white/85"
            >
              <div className="text-label text-white/60 mb-2">Послание дня</div>
              <p className="text-body">{dailyState.revealedMessage}</p>
            </motion.div>
          )}
        </div>
      </GlassCard>

      <GlassCard
        className="overflow-hidden"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Target size={18} color="#ffd166" />
          <div className="text-h3 text-white">Маршрут веселья</div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORY_META.map((item) => {
            const isVisited = dailyState.visited.includes(item.id);
            const isActive = activeCategory === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onCategorySelect(item.id)}
                className="rounded-2xl border px-3 py-3 text-left transition-all duration-200"
                style={{
                  borderColor: isActive ? item.accent : isVisited ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
                  background: isActive
                    ? `color-mix(in srgb, ${item.accent} 20%, rgba(255,255,255,0.04))`
                    : isVisited
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(255,255,255,0.03)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs text-white/60">{isVisited ? 'Открыто' : '???'}</span>
                </div>
                <div className="text-sm font-semibold text-white">{item.label}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-2">
          {quests.map((quest) => (
            <div key={quest.label} className="flex items-center gap-3 rounded-2xl bg-white/4 px-3 py-2">
              <div className={`h-3 w-3 rounded-full ${quest.done ? 'bg-emerald-400' : 'bg-white/20'}`} />
              <div className="text-sm text-white/80">{quest.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
