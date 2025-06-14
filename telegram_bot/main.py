#!/usr/bin/env python3
"""
KindWords Telegram Bot
A bot that generates AI-powered kind messages and compliments
"""
from keep_alive import keep_alive
keep_alive()

import os
import logging
import asyncio
import sqlite3
import csv
import json
from datetime import datetime
from typing import Optional, Dict, Any
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, 
    CommandHandler, 
    MessageHandler, 
    CallbackQueryHandler,
    ContextTypes,
    filters
)
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
    handlers=[
        logging.FileHandler('telegram_bot/logs/bot.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Bot configuration
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Mood themes available for message generation
MOOD_THEMES = {
    'uplift': {'emoji': '🌸', 'name': 'Uplift'},
    'congrats': {'emoji': '🎉', 'name': 'Congratulations'},
    'thanks': {'emoji': '🙏', 'name': 'Thank You'},
    'motivation': {'emoji': '💪', 'name': 'Motivation'},
    'support': {'emoji': '🤗', 'name': 'Support'},
    'celebration': {'emoji': '🎊', 'name': 'Celebration'}
}

class AnalyticsLogger:
    """Handles logging user interactions to CSV and SQLite database"""
    
    def __init__(self, db_path: str = "telegram_bot/data/analytics.db", 
                 csv_path: str = "telegram_bot/data/user_interactions.csv"):
        self.db_path = db_path
        self.csv_path = csv_path
        
        # Ensure data directory exists
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        os.makedirs(os.path.dirname(csv_path), exist_ok=True)
        
        # Initialize database
        self._init_database()
        
        # Initialize CSV if it doesn't exist
        self._init_csv()
    
    def _init_database(self):
        """Initialize SQLite database with required tables"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # User interactions table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS user_interactions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        username TEXT,
                        first_name TEXT,
                        last_name TEXT,
                        timestamp DATETIME NOT NULL,
                        action TEXT NOT NULL,
                        recipient_name TEXT,
                        mood_choice TEXT,
                        message_generated BOOLEAN DEFAULT FALSE,
                        session_data TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                # Daily stats table for quick analytics
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS daily_stats (
                        date DATE PRIMARY KEY,
                        total_users INTEGER DEFAULT 0,
                        total_messages INTEGER DEFAULT 0,
                        unique_users INTEGER DEFAULT 0,
                        most_popular_mood TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                # Mood popularity table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS mood_stats (
                        mood TEXT PRIMARY KEY,
                        count INTEGER DEFAULT 0,
                        last_used DATETIME,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                conn.commit()
                logger.info("Database initialized successfully")
                
        except Exception as e:
            logger.error(f"Error initializing database: {e}")
    
    def _init_csv(self):
        """Initialize CSV file with headers if it doesn't exist"""
        try:
            if not os.path.exists(self.csv_path):
                with open(self.csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                    writer = csv.writer(csvfile)
                    writer.writerow([
                        'timestamp', 'user_id', 'username', 'first_name', 'last_name',
                        'action', 'recipient_name', 'mood_choice', 'message_generated'
                    ])
                logger.info("CSV file initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing CSV: {e}")
    
    def log_interaction(self, user_data: Dict[str, Any], action: str, 
                       recipient_name: str = None, mood_choice: str = None, 
                       message_generated: bool = False, session_data: Dict = None):
        """Log user interaction to both CSV and SQLite database"""
        timestamp = datetime.now()
        
        try:
            # Log to CSV
            self._log_to_csv(user_data, action, timestamp, recipient_name, 
                           mood_choice, message_generated)
            
            # Log to SQLite
            self._log_to_sqlite(user_data, action, timestamp, recipient_name, 
                              mood_choice, message_generated, session_data)
            
            # Update mood statistics if mood was chosen
            if mood_choice:
                self._update_mood_stats(mood_choice)
            
            logger.info(f"Logged interaction: user_id={user_data.get('id')}, action={action}")
            
        except Exception as e:
            logger.error(f"Error logging interaction: {e}")
    
    def _log_to_csv(self, user_data: Dict[str, Any], action: str, timestamp: datetime,
                    recipient_name: str, mood_choice: str, message_generated: bool):
        """Log interaction to CSV file"""
        try:
            with open(self.csv_path, 'a', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow([
                    timestamp.isoformat(),
                    user_data.get('id'),
                    user_data.get('username', ''),
                    user_data.get('first_name', ''),
                    user_data.get('last_name', ''),
                    action,
                    recipient_name or '',
                    mood_choice or '',
                    message_generated
                ])
        except Exception as e:
            logger.error(f"Error writing to CSV: {e}")
    
    def _log_to_sqlite(self, user_data: Dict[str, Any], action: str, timestamp: datetime,
                       recipient_name: str, mood_choice: str, message_generated: bool,
                       session_data: Dict):
        """Log interaction to SQLite database"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO user_interactions 
                    (user_id, username, first_name, last_name, timestamp, action, 
                     recipient_name, mood_choice, message_generated, session_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    user_data.get('id'),
                    user_data.get('username'),
                    user_data.get('first_name'),
                    user_data.get('last_name'),
                    timestamp,
                    action,
                    recipient_name,
                    mood_choice,
                    message_generated,
                    json.dumps(session_data) if session_data else None
                ))
                conn.commit()
        except Exception as e:
            logger.error(f"Error writing to SQLite: {e}")
    
    def _update_mood_stats(self, mood_choice: str):
        """Update mood popularity statistics"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT OR REPLACE INTO mood_stats (mood, count, last_used, updated_at)
                    VALUES (?, 
                            COALESCE((SELECT count FROM mood_stats WHERE mood = ?), 0) + 1,
                            ?, 
                            ?)
                ''', (mood_choice, mood_choice, datetime.now(), datetime.now()))
                conn.commit()
        except Exception as e:
            logger.error(f"Error updating mood stats: {e}")
    
    def get_daily_stats(self, date: str = None) -> Dict[str, Any]:
        """Get daily statistics for analytics"""
        if not date:
            date = datetime.now().strftime('%Y-%m-%d')
        
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Get daily stats
                cursor.execute('''
                    SELECT 
                        COUNT(*) as total_interactions,
                        COUNT(DISTINCT user_id) as unique_users,
                        COUNT(CASE WHEN message_generated = 1 THEN 1 END) as messages_generated
                    FROM user_interactions 
                    WHERE DATE(timestamp) = ?
                ''', (date,))
                
                stats = cursor.fetchone()
                
                # Get most popular mood for the day
                cursor.execute('''
                    SELECT mood_choice, COUNT(*) as count
                    FROM user_interactions 
                    WHERE DATE(timestamp) = ? AND mood_choice IS NOT NULL
                    GROUP BY mood_choice
                    ORDER BY count DESC
                    LIMIT 1
                ''', (date,))
                
                popular_mood = cursor.fetchone()
                
                return {
                    'date': date,
                    'total_interactions': stats[0] if stats else 0,
                    'unique_users': stats[1] if stats else 0,
                    'messages_generated': stats[2] if stats else 0,
                    'most_popular_mood': popular_mood[0] if popular_mood else None
                }
                
        except Exception as e:
            logger.error(f"Error getting daily stats: {e}")
            return {}

class ComplimentLoader:
    """Handles loading and managing compliments from JSON file"""
    
    def __init__(self, compliments_file: str = "telegram_bot/compliments.json"):
        self.compliments_file = compliments_file
        self.compliments = []
        self.load_compliments()
    
    def load_compliments(self):
        """Load compliments from JSON file"""
        try:
            if os.path.exists(self.compliments_file):
                with open(self.compliments_file, 'r', encoding='utf-8') as f:
                    self.compliments = json.load(f)
                logger.info(f"Loaded {len(self.compliments)} compliments from {self.compliments_file}")
            else:
                logger.warning(f"Compliments file not found: {self.compliments_file}")
                # Fallback to a few basic compliments
                self.compliments = [
                    "You have an incredible ability to make others feel valued and appreciated.",
                    "Your kindness radiates warmth that brightens everyone's day.",
                    "The way you listen with such genuine care is truly a gift."
                ]
        except Exception as e:
            logger.error(f"Error loading compliments: {e}")
            self.compliments = ["You are amazing and worthy of love and kindness! 💖"]
    
    def get_random_compliment(self) -> str:
        """Get a random compliment"""
        import random
        if self.compliments:
            return random.choice(self.compliments)
        return "You are wonderful just as you are! 🌟"

class KindWordsBot:
    def __init__(self):
        self.user_sessions = {}  # Store user session data
        self.analytics = AnalyticsLogger()  # Initialize analytics logger
        self.compliments = ComplimentLoader()  # Initialize compliment loader
    
    def _get_user_data(self, user) -> Dict[str, Any]:
        """Extract user data for logging"""
        return {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle the /start command"""
        user = update.effective_user
        user_data = self._get_user_data(user)
        
        # Log the start command
        self.analytics.log_interaction(user_data, 'start_command')
        
        welcome_message = (
            f"🌸 Welcome to KindWords, {user.first_name}! 🌸\n\n"
            "I'm here to help you create beautiful, AI-generated messages "
            "that spread kindness and joy. ✨\n\n"
            "Use /create to start crafting a personalized message for someone special!\n"
            "Use /compliment to receive a gentle compliment for yourself!\n"
            "Use /help to see all available commands."
        )
        
        keyboard = [
            [InlineKeyboardButton("✨ Create Message", callback_data='create_message')],
            [InlineKeyboardButton("💝 Get Compliment", callback_data='get_compliment')],
            [InlineKeyboardButton("❓ Help", callback_data='help')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(welcome_message, reply_markup=reply_markup)
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle the /help command"""
        user_data = self._get_user_data(update.effective_user)
        self.analytics.log_interaction(user_data, 'help_command')
        
        help_text = (
            "🌟 *KindWords Bot Commands* 🌟\n\n"
            "/start - Welcome message and get started\n"
            "/create - Create a new kind message\n"
            "/compliment - Receive a gentle compliment\n"
            "/help - Show this help message\n"
            "/about - Learn more about KindWords\n"
            "/stats - View your usage statistics\n\n"
            "*How to use:*\n"
            "1. Use /create to start\n"
            "2. Enter the recipient's name\n"
            "3. Choose a mood theme\n"
            "4. Get your AI-generated message!\n\n"
            "Spread kindness, one message at a time! 💖"
        )
        await update.message.reply_text(help_text, parse_mode='Markdown')
    
    async def about_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle the /about command"""
        user_data = self._get_user_data(update.effective_user)
        self.analytics.log_interaction(user_data, 'about_command')
        
        about_text = (
            "💝 *About KindWords* 💝\n\n"
            "KindWords is an AI-powered platform that helps you create "
            "personalized, heartfelt messages to brighten someone's day.\n\n"
            "🤖 *Powered by AI* - Advanced language models craft unique messages\n"
            "🎨 *Personalized* - Every message is tailored to your recipient\n"
            "💌 *Multiple Themes* - Choose from various mood themes\n"
            "🌍 *Spread Joy* - Help make the world a kinder place\n\n"
            "Visit our website: kindwords.app\n"
            "Made with ❤️ for spreading kindness"
        )
        await update.message.reply_text(about_text, parse_mode='Markdown')
    
    async def compliment_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle the /compliment command - send a random compliment"""
        user = update.effective_user
        user_data = self._get_user_data(user)
        self.analytics.log_interaction(user_data, 'compliment_command')
        
        compliment = self.compliments.get_random_compliment()
        
        compliment_message = (
            f"💝 *A gentle compliment for you, {user.first_name}:*\n\n"
            f"_{compliment}_\n\n"
            "🌸 Remember: You are worthy of love and kindness! 🌸"
        )
        
        keyboard = [
            [InlineKeyboardButton("🔄 Another Compliment", callback_data='get_compliment')],
            [InlineKeyboardButton("✨ Create Message for Someone", callback_data='create_message')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(compliment_message, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def stats_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle the /stats command - show user their usage statistics"""
        user = update.effective_user
        user_data = self._get_user_data(user)
        self.analytics.log_interaction(user_data, 'stats_command')
        
        try:
            # Get user's personal stats
            with sqlite3.connect(self.analytics.db_path) as conn:
                cursor = conn.cursor()
                
                # Get user's total interactions
                cursor.execute('''
                    SELECT 
                        COUNT(*) as total_interactions,
                        COUNT(CASE WHEN message_generated = 1 THEN 1 END) as messages_created,
                        MIN(timestamp) as first_interaction
                    FROM user_interactions 
                    WHERE user_id = ?
                ''', (user.id,))
                
                user_stats = cursor.fetchone()
                
                # Get user's favorite mood
                cursor.execute('''
                    SELECT mood_choice, COUNT(*) as count
                    FROM user_interactions 
                    WHERE user_id = ? AND mood_choice IS NOT NULL
                    GROUP BY mood_choice
                    ORDER BY count DESC
                    LIMIT 1
                ''', (user.id,))
                
                favorite_mood = cursor.fetchone()
                
                # Get today's stats
                today = datetime.now().strftime('%Y-%m-%d')
                daily_stats = self.analytics.get_daily_stats(today)
                
                stats_text = (
                    f"📊 *Your KindWords Statistics* 📊\n\n"
                    f"👤 *Personal Stats:*\n"
                    f"• Total interactions: {user_stats[0] if user_stats else 0}\n"
                    f"• Messages created: {user_stats[1] if user_stats else 0}\n"
                    f"• Member since: {user_stats[2][:10] if user_stats and user_stats[2] else 'Today'}\n"
                    f"• Favorite mood: {MOOD_THEMES.get(favorite_mood[0], {}).get('emoji', '')} {MOOD_THEMES.get(favorite_mood[0], {}).get('name', 'None yet')} ({favorite_mood[1]} times)" if favorite_mood else "• Favorite mood: None yet\n"
                    f"\n🌍 *Today's Community:*\n"
                    f"• Active users: {daily_stats.get('unique_users', 0)}\n"
                    f"• Messages created: {daily_stats.get('messages_generated', 0)}\n"
                    f"• Popular mood: {MOOD_THEMES.get(daily_stats.get('most_popular_mood'), {}).get('emoji', '')} {MOOD_THEMES.get(daily_stats.get('most_popular_mood'), {}).get('name', 'None')}" if daily_stats.get('most_popular_mood') else "• Popular mood: None yet\n"
                    f"\n💖 Keep spreading kindness!"
                )
                
                await update.message.reply_text(stats_text, parse_mode='Markdown')
                
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            await update.message.reply_text("Sorry, I couldn't retrieve your statistics right now. Please try again later!")
    
    async def create_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle the /create command"""
        user = update.effective_user
        user_id = user.id
        user_data = self._get_user_data(user)
        
        # Initialize user session
        self.user_sessions[user_id] = {
            'step': 'waiting_for_name',
            'friend_name': None,
            'mood_theme': None,
            'start_time': datetime.now()
        }
        
        # Log the create command
        self.analytics.log_interaction(user_data, 'create_command', 
                                     session_data=self.user_sessions[user_id])
        
        message = (
            "🌸 Let's create a beautiful message! 🌸\n\n"
            "First, please tell me the name of the person you'd like to send "
            "a kind message to:"
        )
        await update.message.reply_text(message)
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle text messages based on user session state"""
        user = update.effective_user
        user_id = user.id
        user_data = self._get_user_data(user)
        text = update.message.text
        
        if user_id not in self.user_sessions:
            self.analytics.log_interaction(user_data, 'message_without_session')
            await update.message.reply_text(
                "Please use /create to start creating a message! 😊"
            )
            return
        
        session = self.user_sessions[user_id]
        
        if session['step'] == 'waiting_for_name':
            # Store the friend's name and ask for mood theme
            session['friend_name'] = text.strip()
            session['step'] = 'waiting_for_mood'
            
            # Log recipient name entry
            self.analytics.log_interaction(user_data, 'recipient_name_entered', 
                                         recipient_name=session['friend_name'],
                                         session_data=session)
            
            await self.show_mood_selection(update, context)
        
        else:
            self.analytics.log_interaction(user_data, 'unexpected_message')
            await update.message.reply_text(
                "Please use the buttons to select options, or use /create to start over! 😊"
            )
    
    async def show_mood_selection(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Show mood theme selection buttons"""
        user_id = update.effective_user.id
        friend_name = self.user_sessions[user_id]['friend_name']
        
        message = (
            f"Perfect! I'll create a message for *{friend_name}* 💖\n\n"
            "Now, please choose the mood theme for your message:"
        )
        
        # Create keyboard with mood options
        keyboard = []
        for theme_key, theme_data in MOOD_THEMES.items():
            button_text = f"{theme_data['emoji']} {theme_data['name']}"
            keyboard.append([InlineKeyboardButton(button_text, callback_data=f'mood_{theme_key}')])
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.message.reply_text(message, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def handle_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle callback queries from inline keyboards"""
        query = update.callback_query
        await query.answer()
        
        user_id = query.from_user.id
        user_data = self._get_user_data(query.from_user)
        data = query.data
        
        if data == 'create_message':
            await self.create_command(update, context)
        
        elif data == 'get_compliment':
            await self.send_compliment_callback(update, context)
        
        elif data == 'help':
            await self.help_command(update, context)
        
        elif data.startswith('mood_'):
            await self.handle_mood_selection(update, context, data)
        
        elif data == 'regenerate':
            await self.regenerate_message(update, context)
    
    async def send_compliment_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Send a compliment via callback query"""
        query = update.callback_query
        user = query.from_user
        user_data = self._get_user_data(user)
        
        self.analytics.log_interaction(user_data, 'compliment_callback')
        
        compliment = self.compliments.get_random_compliment()
        
        compliment_message = (
            f"💝 *A gentle compliment for you, {user.first_name}:*\n\n"
            f"_{compliment}_\n\n"
            "🌸 Remember: You are worthy of love and kindness! 🌸"
        )
        
        keyboard = [
            [InlineKeyboardButton("🔄 Another Compliment", callback_data='get_compliment')],
            [InlineKeyboardButton("✨ Create Message for Someone", callback_data='create_message')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(compliment_message, reply_markup=reply_markup, parse_mode='Markdown')
    
    async def handle_mood_selection(self, update: Update, context: ContextTypes.DEFAULT_TYPE, data: str) -> None:
        """Handle mood theme selection"""
        query = update.callback_query
        user_id = query.from_user.id
        user_data = self._get_user_data(query.from_user)
        
        if user_id not in self.user_sessions:
            await query.edit_message_text("Session expired. Please use /create to start over!")
            return
        
        mood_theme = data.replace('mood_', '')
        session = self.user_sessions[user_id]
        session['mood_theme'] = mood_theme
        
        # Log mood selection
        self.analytics.log_interaction(user_data, 'mood_selected', 
                                     recipient_name=session['friend_name'],
                                     mood_choice=mood_theme,
                                     session_data=session)
        
        # Generate the message
        await self.generate_and_send_message(update, context)
    
    async def generate_and_send_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Generate and send the AI message"""
        query = update.callback_query
        user_id = query.from_user.id
        user_data = self._get_user_data(query.from_user)
        session = self.user_sessions[user_id]
        
        friend_name = session['friend_name']
        mood_theme = session['mood_theme']
        theme_data = MOOD_THEMES[mood_theme]
        
        # Show generating message
        generating_text = (
            f"✨ Generating a beautiful {theme_data['name'].lower()} message for {friend_name}...\n\n"
            "Please wait a moment while AI crafts something special! 🤖💖"
        )
        await query.edit_message_text(generating_text)
        
        try:
            # Generate message
            message = await self.generate_message_with_ai(friend_name, mood_theme)
            
            # Log successful message generation
            self.analytics.log_interaction(user_data, 'message_generated', 
                                         recipient_name=friend_name,
                                         mood_choice=mood_theme,
                                         message_generated=True,
                                         session_data=session)
            
            # Format the final message
            final_text = (
                f"🌸 *Your AI-Generated Message* 🌸\n\n"
                f"*For:* {friend_name}\n"
                f"*Theme:* {theme_data['emoji']} {theme_data['name']}\n\n"
                f"_{message}_\n\n"
                "💝 *Ready to spread some kindness!*"
            )
            
            # Add regenerate button
            keyboard = [
                [InlineKeyboardButton("🔄 Generate Another", callback_data='regenerate')],
                [InlineKeyboardButton("✨ Create New Message", callback_data='create_message')]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await query.edit_message_text(final_text, reply_markup=reply_markup, parse_mode='Markdown')
            
        except Exception as e:
            logger.error(f"Error generating message: {e}")
            
            # Log generation error
            self.analytics.log_interaction(user_data, 'message_generation_error', 
                                         recipient_name=friend_name,
                                         mood_choice=mood_theme,
                                         session_data=session)
            
            error_text = (
                "😔 Sorry, I encountered an error while generating your message.\n\n"
                "Please try again with /create"
            )
            await query.edit_message_text(error_text)
    
    async def regenerate_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Regenerate message with same parameters"""
        query = update.callback_query
        user_id = query.from_user.id
        user_data = self._get_user_data(query.from_user)
        
        if user_id not in self.user_sessions:
            await query.edit_message_text("Session expired. Please use /create to start over!")
            return
        
        # Log regeneration request
        session = self.user_sessions[user_id]
        self.analytics.log_interaction(user_data, 'message_regenerated', 
                                     recipient_name=session['friend_name'],
                                     mood_choice=session['mood_theme'],
                                     session_data=session)
        
        await self.generate_and_send_message(update, context)
    
    async def generate_message_with_ai(self, friend_name: str, mood_theme: str) -> str:
        """Generate message using AI or fallback templates"""
        # TODO: Implement Gemini API integration
        # For now, using fallback templates
        
        templates = {
            'uplift': [
                f"Hey {friend_name}! Just wanted to remind you that your positive energy lights up every room you enter. Your resilience and strength inspire everyone around you. Keep being amazing! 🌟",
                f"{friend_name}, you have this incredible ability to find silver linings in any situation. Your optimism is contagious and makes the world a brighter place. Thank you for being you! ✨"
            ],
            'congrats': [
                f"Congratulations, {friend_name}! Your hard work and dedication have truly paid off. You've achieved something amazing and you should be incredibly proud! 🎉",
                f"{friend_name}, what an incredible achievement! Your perseverance and talent have led you to this moment. You've inspired so many people with your journey! 🏆"
            ],
            'thanks': [
                f"Thank you, {friend_name}, for being such an incredible friend. Your support, kindness, and genuine care mean the world to me. I'm so grateful to have you in my life! 🙏",
                f"{friend_name}, I can't thank you enough for everything you do. Your thoughtfulness and generosity never cease to amaze me. You make life so much better! 💕"
            ],
            'motivation': [
                f"{friend_name}, you have incredible strength within you that can overcome any challenge. Your potential is limitless, and I believe in you completely. You've got this! 💪",
                f"Hey {friend_name}! Remember that every expert was once a beginner, and every champion was once a contender. Your journey is just beginning, and greatness awaits! 🚀"
            ],
            'support': [
                f"{friend_name}, I want you to know that you're not alone in this journey. You're stronger than you realize, and you have people who care about you deeply. Take it one day at a time. 🤗",
                f"Dear {friend_name}, remember that it's okay not to be okay sometimes. Your feelings are valid, and your courage to keep going is admirable. You're braver than you believe! 💙"
            ],
            'celebration': [
                f"It's party time, {friend_name}! Your joy and enthusiasm are absolutely infectious. You know how to make every moment special and memorable. Let's celebrate life together! 🎊",
                f"{friend_name}, you bring such vibrant energy to everything you do! Your zest for life and ability to find joy in the little things makes every day an adventure. Keep shining! ✨"
            ]
        }
        
        import random
        theme_templates = templates.get(mood_theme, templates['uplift'])
        return random.choice(theme_templates)

def main() -> None:
    """Start the bot"""
    if not BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN not found in environment variables!")
        return
    
    # Ensure logs directory exists
    os.makedirs('telegram_bot/logs', exist_ok=True)
    
    # Create bot instance
    bot = KindWordsBot()
    
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", bot.start_command))
    application.add_handler(CommandHandler("help", bot.help_command))
    application.add_handler(CommandHandler("about", bot.about_command))
    application.add_handler(CommandHandler("stats", bot.stats_command))
    application.add_handler(CommandHandler("create", bot.create_command))
    application.add_handler(CommandHandler("compliment", bot.compliment_command))
    application.add_handler(CallbackQueryHandler(bot.handle_callback))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))
    
    # Start the bot
    logger.info("Starting KindWords Telegram Bot with analytics...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()