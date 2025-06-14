# KindWords Telegram Bot

A Telegram bot that generates AI-powered kind messages and compliments to spread positivity and joy.

## Features

- 🤖 AI-powered message generation using Gemini API
- 🎨 Multiple mood themes (Uplift, Congratulations, Thanks, Motivation, Support, Celebration)
- 💬 Interactive conversation flow
- 🌟 Personalized messages for any recipient
- 📱 Easy-to-use Telegram interface
- 📊 **Comprehensive Analytics & Logging**

## Analytics Features

### 📊 Data Collection
- **User Interactions**: Every command, button click, and message
- **Session Tracking**: Complete user journey from start to message generation
- **Mood Analytics**: Popular themes and user preferences
- **Performance Metrics**: Conversion rates and usage patterns

### 📈 Data Storage
- **SQLite Database**: Structured data with relationships and indexes
- **CSV Export**: Easy data analysis and reporting
- **Real-time Logging**: Immediate data capture for all interactions

### 🔍 Analytics Dashboard
- **Overview Statistics**: Total users, messages, conversion rates
- **Daily Activity**: User engagement and message generation trends
- **Mood Popularity**: Most requested message themes
- **User Statistics**: Individual usage patterns and preferences

## Setup

### Prerequisites

- Python 3.8 or higher
- A Telegram Bot Token (get from [@BotFather](https://t.me/BotFather))
- (Optional) Gemini API key for AI generation

### Installation

1. **Clone the repository and navigate to the bot directory:**
   ```bash
   cd telegram_bot
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your tokens:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   GEMINI_API_KEY=your_gemini_api_key_here  # Optional
   ```

4. **Run the bot:**
   ```bash
   python main.py
   ```

## Analytics Usage

### View Analytics
```bash
# Generate full analytics report
python analytics_viewer.py --report

# View overview statistics
python analytics_viewer.py --overview

# View daily activity for last 14 days
python analytics_viewer.py --daily 14

# View mood popularity
python analytics_viewer.py --moods

# View top 20 active users
python analytics_viewer.py --users 20

# Export all data to CSV
python analytics_viewer.py --export analytics_export.csv
```

### Data Structure

#### User Interactions Table
- `user_id`: Telegram user ID
- `username`: Telegram username
- `first_name`: User's first name
- `timestamp`: When the interaction occurred
- `action`: Type of action (start_command, mood_selected, etc.)
- `recipient_name`: Name of message recipient
- `mood_choice`: Selected mood theme
- `message_generated`: Whether a message was successfully created
- `session_data`: JSON data about the user's session

#### Analytics Insights
- **Conversion Rate**: Percentage of users who complete message generation
- **Popular Moods**: Most requested message themes
- **Usage Patterns**: Peak usage times and user retention
- **User Journey**: Complete flow from start to message creation

## Getting Your Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token and add it to your `.env` file

## Usage

### Bot Commands

- `/start` - Welcome message and get started
- `/create` - Create a new kind message
- `/help` - Show help information
- `/about` - Learn more about KindWords
- `/stats` - View personal usage statistics

### How to Use

1. Start a conversation with your bot
2. Use `/create` to begin creating a message
3. Enter the recipient's name when prompted
4. Choose a mood theme from the options
5. Receive your AI-generated kind message!
6. Use the "Generate Another" button to create variations

## Mood Themes

- 🌸 **Uplift** - Encouraging and motivational messages
- 🎉 **Congratulations** - Celebrate achievements and milestones
- 🙏 **Thank You** - Express gratitude and appreciation
- 💪 **Motivation** - Inspire and energize
- 🤗 **Support** - Comfort and encouragement during tough times
- 🎊 **Celebration** - Joyful and festive messages

## Architecture

The bot is built using:
- `python-telegram-bot` library for Telegram integration
- Gemini AI API for message generation (with fallback templates)
- SQLite for analytics data storage
- Pandas for data analysis
- Async/await pattern for efficient handling
- Session management for conversation flow

## File Structure

```
telegram_bot/
├── main.py                 # Main bot application with analytics
├── analytics_viewer.py     # Analytics dashboard and reporting
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── README.md              # This file
├── data/                  # Analytics database and CSV files
│   ├── analytics.db       # SQLite database
│   └── user_interactions.csv  # CSV export
├── logs/                  # Bot operation logs
│   └── bot.log           # Application logs
└── exports/               # Analytics exports
    └── analytics_export_*.csv  # Timestamped exports
```

## Development

### Adding New Analytics

1. **New Metrics**: Add to the `AnalyticsLogger` class
2. **New Reports**: Extend the `AnalyticsViewer` class
3. **New Tracking**: Add `log_interaction()` calls in bot handlers

### Database Schema

The analytics system uses three main tables:
- `user_interactions`: All user actions and interactions
- `daily_stats`: Aggregated daily statistics
- `mood_stats`: Mood theme popularity tracking

### Error Handling

The bot includes comprehensive error handling:
- Graceful fallback to templates if AI API fails
- Session validation and cleanup
- User-friendly error messages
- Analytics logging for all error conditions

## Privacy & Data

- User data is stored locally in SQLite database
- No personal messages are logged, only metadata
- Users can view their own statistics with `/stats`
- Data is used only for improving bot performance

## Deployment

### Local Development
```bash
python main.py
```

### Production Deployment
Consider using:
- **Heroku**: Easy deployment with git integration
- **Docker**: Containerized deployment
- **VPS**: Direct deployment on virtual private server

### Environment Variables for Production
```bash
TELEGRAM_BOT_TOKEN=your_production_bot_token
GEMINI_API_KEY=your_gemini_api_key
```

## Analytics Examples

### Daily Report Output
```
📊 KindWords Bot Analytics Overview
========================================
👥 Total Users: 156
💬 Total Interactions: 1,247
💌 Messages Generated: 892
📈 Most Active Day: 2024-01-15 (89 interactions)
🎭 Most Popular Mood: uplift (234 times)
📊 Message Conversion Rate: 71.5%
```

### Mood Popularity
```
🎭 Mood Theme Popularity
==============================
uplift          234   (31.2%)
thanks          187   (24.9%)
motivation      156   (20.8%)
congrats        98    (13.1%)
support         45    (6.0%)
celebration     30    (4.0%)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with analytics
5. Submit a pull request

## License

This project is part of the KindWords platform - spreading kindness one message at a time! 💖

## Support

For issues or questions:
- Check the logs in `telegram_bot/logs/bot.log`
- Review analytics for usage patterns
- Ensure your bot token is valid
- Verify environment variables are set correctly
- Test with a simple `/start` command first

---

Made with ❤️ for spreading kindness through technology

**Analytics powered by data-driven insights to make kindness more effective! 📊💝**