import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);
const webAppUrl = process.env.WEBAPP_URL;

bot.start(async (ctx) => {
  await ctx.reply(
    'Привет! Открывай веселый календарь:',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть календарь', webAppUrl)
    ])
  );
});

bot.command('app', async (ctx) => {
  await ctx.reply(
    'Нажми кнопку ниже:',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть Mini App', webAppUrl)
    ])
  );
});

bot.launch();
console.log('Bot started');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
