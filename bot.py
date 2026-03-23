"""
Весёлый календарь — Telegram Mini App бот

Запуск:
    python bot.py

Перед запуском создай .env файл:
    BOT_TOKEN=твой_новый_токен
    MINI_APP_URL=https://urijkovalenko905-sys.github.io/Kalendar33/
"""

import os
import subprocess
import sys


def ensure_package(package_name: str, import_name: str | None = None):
    module_name = import_name or package_name
    try:
        __import__(module_name)
    except ImportError:
        print(f"Устанавливаю {package_name}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])


ensure_package("python-telegram-bot", "telegram")
ensure_package("python-dotenv", "dotenv")

from dotenv import load_dotenv
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, MenuButtonWebApp, Update, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes


DEFAULT_APP_URL = "https://urijkovalenko905-sys.github.io/Kalendar33/"

load_dotenv()

TOKEN = os.getenv("BOT_TOKEN", "").strip()
APP_URL = os.getenv("MINI_APP_URL", DEFAULT_APP_URL).strip() or DEFAULT_APP_URL


def build_open_app_keyboard(button_text: str = "🎉 Открыть календарь") -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        [[InlineKeyboardButton(text=button_text, web_app=WebAppInfo(url=APP_URL))]]
    )


async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    text = (
        "👋 Привет!\n\n"
        "Это бот для Mini App «Весёлый календарь».\n"
        "Нажми кнопку ниже, чтобы открыть приложение прямо в Telegram."
    )
    await update.message.reply_text(text, reply_markup=build_open_app_keyboard())


async def calendar(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📅 Открывай календарь 👇",
        reply_markup=build_open_app_keyboard("📅 Открыть Mini App"),
    )


async def help_command(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    help_text = (
        "Доступные команды:\n"
        "/start - запустить бота\n"
        "/calendar - открыть Mini App\n"
        "/help - показать помощь"
    )
    await update.message.reply_text(help_text, reply_markup=build_open_app_keyboard("🚀 Запустить Mini App"))


async def post_init(application: Application):
    await application.bot.set_chat_menu_button(menu_button=MenuButtonWebApp(text="Открыть календарь", web_app=WebAppInfo(url=APP_URL)))
    me = await application.bot.get_me()
    print(f"Бот @{me.username} готов.")
    print(f"Mini App URL: {APP_URL}")


def main():
    if not TOKEN:
        raise RuntimeError(
            "Не найден BOT_TOKEN. Создай файл .env и добавь:\n"
            "BOT_TOKEN=твой_новый_токен\n"
            f"MINI_APP_URL={DEFAULT_APP_URL}"
        )

    app = Application.builder().token(TOKEN).post_init(post_init).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("calendar", calendar))
    app.add_handler(CommandHandler("help", help_command))

    print("Бот запущен. Нажми Ctrl+C для остановки.")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
