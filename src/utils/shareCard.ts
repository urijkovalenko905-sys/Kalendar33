import html2canvas from 'html2canvas';
import { CategoryId } from '../types/DayData';
import { formatRussianDate } from './dateHelpers';

export async function generateShareCard(
  cardData: any,
  category: CategoryId,
  date: Date,
): Promise<Blob> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '360px';
  container.style.height = '640px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';
  container.style.padding = '32px 24px';
  container.style.boxSizing = 'border-box';
  container.style.fontFamily = "'Raleway', sans-serif";
  container.style.color = '#fff';
  container.style.overflow = 'hidden';

  const gradients: Record<CategoryId, string> = {
    science: 'linear-gradient(135deg, #0C0C1A 0%, #1A3A3A 100%)',
    funFact: 'linear-gradient(135deg, #0C0C1A 0%, #2A3A1A 100%)',
    history: 'linear-gradient(135deg, #0C0C1A 0%, #3A3A1A 100%)',
    meme: 'linear-gradient(135deg, #0C0C1A 0%, #1A3A2A 100%)',
    cinema: 'linear-gradient(135deg, #0C0C1A 0%, #2A1A3A 100%)',
    birthday: 'linear-gradient(135deg, #0C0C1A 0%, #3A1A1A 100%)',
    holiday: 'linear-gradient(135deg, #0C0C1A 0%, #3A2A1A 100%)',
    quote: 'linear-gradient(135deg, #0C0C1A 0%, #1A1A3A 100%)',
  };
  container.style.background = gradients[category] || '#0C0C1A';

  let headline = '';
  let body = '';
  let emoji = '';
  let label = '';

  switch (category) {
    case 'science':
      headline = cardData.title;
      body = cardData.summary;
      emoji = '🔬';
      label = 'Наука даты';
      break;
    case 'funFact':
      headline = cardData.punchline;
      body = cardData.detail;
      emoji = '🌀';
      label = 'Факт даты';
      break;
    case 'history':
      headline = cardData.title;
      body = cardData.narrative;
      emoji = '📜';
      label = 'История';
      break;
    case 'meme':
      headline = cardData.memeName;
      body = cardData.originStory;
      emoji = '🐣';
      label = 'Поп-культура';
      break;
    case 'cinema':
      headline = cardData.title;
      body = cardData.funFact;
      emoji = '🎬';
      label = 'Кино и музыка';
      break;
    case 'birthday':
      headline = 'Рождения этой даты';
      body = cardData.map((person: any) => `${person.name} (${person.birthYear})`).join(', ');
      emoji = '🎂';
      label = 'Рождения';
      break;
    case 'holiday':
      headline = cardData.holidayName;
      body = cardData.purpose;
      emoji = '🌍';
      label = 'Праздники';
      break;
    case 'quote':
      headline = cardData.author;
      body = `${cardData.quoteText} ${cardData.context}`;
      emoji = '🕯';
      label = 'Память дня';
      break;
  }

  const metaLine = cardData?.occurredOnLabel || formatRussianDate(date);

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div style="display: flex; align-items: center; gap: 8px; opacity: 0.85;">
        <span style="font-size: 20px;">📅</span>
        <span style="font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Весёлый Календарь</span>
      </div>

      <div style="display: inline-block; padding: 6px 12px; background: rgba(255,255,255,0.1); border-radius: 100px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; align-self: flex-start; border: 1px solid rgba(255,255,255,0.2);">
        ${metaLine}
      </div>

      <h1 style="font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 31px; line-height: 1.2; margin: 0; letter-spacing: -1px;">
        ${headline}
      </h1>

      <p style="font-size: 16px; line-height: 1.55; opacity: 0.9; margin: 0;">
        ${String(body).slice(0, 240)}
      </p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 16px; align-items: center; text-align: center; margin-top: auto; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1);">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 24px;">${emoji}</span>
        <span style="font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.8;">${label}</span>
      </div>
      <div style="font-size: 12px; opacity: 0.6; font-weight: 600; letter-spacing: 0.5px;">
        ${formatRussianDate(date)}
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true,
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    });
  } finally {
    document.body.removeChild(container);
  }
}
