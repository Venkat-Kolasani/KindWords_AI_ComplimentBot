#!/usr/bin/env python3
"""
Analytics Viewer for KindWords Telegram Bot
View and analyze user interaction data
"""

import sqlite3
import csv
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import argparse
import os

class AnalyticsViewer:
    """View and analyze bot usage analytics"""
    
    def __init__(self, db_path: str = "telegram_bot/data/analytics.db"):
        self.db_path = db_path
        
        if not os.path.exists(db_path):
            print(f"❌ Database not found at {db_path}")
            print("Make sure the bot has been running and logging data.")
            exit(1)
    
    def get_overview_stats(self):
        """Get overview statistics"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Total users
                cursor.execute("SELECT COUNT(DISTINCT user_id) FROM user_interactions")
                total_users = cursor.fetchone()[0]
                
                # Total interactions
                cursor.execute("SELECT COUNT(*) FROM user_interactions")
                total_interactions = cursor.fetchone()[0]
                
                # Total messages generated
                cursor.execute("SELECT COUNT(*) FROM user_interactions WHERE message_generated = 1")
                total_messages = cursor.fetchone()[0]
                
                # Most active day
                cursor.execute("""
                    SELECT DATE(timestamp) as date, COUNT(*) as count
                    FROM user_interactions 
                    GROUP BY DATE(timestamp) 
                    ORDER BY count DESC 
                    LIMIT 1
                """)
                most_active_day = cursor.fetchone()
                
                # Most popular mood
                cursor.execute("""
                    SELECT mood_choice, COUNT(*) as count
                    FROM user_interactions 
                    WHERE mood_choice IS NOT NULL
                    GROUP BY mood_choice 
                    ORDER BY count DESC 
                    LIMIT 1
                """)
                popular_mood = cursor.fetchone()
                
                print("📊 KindWords Bot Analytics Overview")
                print("=" * 40)
                print(f"👥 Total Users: {total_users}")
                print(f"💬 Total Interactions: {total_interactions}")
                print(f"💌 Messages Generated: {total_messages}")
                print(f"📈 Most Active Day: {most_active_day[0]} ({most_active_day[1]} interactions)" if most_active_day else "📈 Most Active Day: None yet")
                print(f"🎭 Most Popular Mood: {popular_mood[0]} ({popular_mood[1]} times)" if popular_mood else "🎭 Most Popular Mood: None yet")
                
                if total_interactions > 0:
                    conversion_rate = (total_messages / total_interactions) * 100
                    print(f"📊 Message Conversion Rate: {conversion_rate:.1f}%")
                
        except Exception as e:
            print(f"❌ Error getting overview stats: {e}")
    
    def get_daily_activity(self, days: int = 7):
        """Get daily activity for the last N days"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                df = pd.read_sql_query("""
                    SELECT 
                        DATE(timestamp) as date,
                        COUNT(*) as total_interactions,
                        COUNT(DISTINCT user_id) as unique_users,
                        COUNT(CASE WHEN message_generated = 1 THEN 1 END) as messages_generated
                    FROM user_interactions 
                    WHERE timestamp >= datetime('now', '-{} days')
                    GROUP BY DATE(timestamp)
                    ORDER BY date
                """.format(days), conn)
                
                if df.empty:
                    print(f"📅 No activity data for the last {days} days")
                    return
                
                print(f"\n📅 Daily Activity (Last {days} days)")
                print("=" * 60)
                print(f"{'Date':<12} {'Users':<8} {'Interactions':<12} {'Messages':<10}")
                print("-" * 60)
                
                for _, row in df.iterrows():
                    print(f"{row['date']:<12} {row['unique_users']:<8} {row['total_interactions']:<12} {row['messages_generated']:<10}")
                
        except Exception as e:
            print(f"❌ Error getting daily activity: {e}")
    
    def get_mood_popularity(self):
        """Get mood theme popularity"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT mood_choice, COUNT(*) as count
                    FROM user_interactions 
                    WHERE mood_choice IS NOT NULL
                    GROUP BY mood_choice 
                    ORDER BY count DESC
                """)
                
                moods = cursor.fetchall()
                
                if not moods:
                    print("\n🎭 No mood data available yet")
                    return
                
                print("\n🎭 Mood Theme Popularity")
                print("=" * 30)
                
                total_mood_selections = sum(mood[1] for mood in moods)
                
                for mood, count in moods:
                    percentage = (count / total_mood_selections) * 100
                    print(f"{mood:<15} {count:<5} ({percentage:.1f}%)")
                
        except Exception as e:
            print(f"❌ Error getting mood popularity: {e}")
    
    def get_user_activity(self, limit: int = 10):
        """Get most active users"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT 
                        user_id,
                        first_name,
                        COUNT(*) as total_interactions,
                        COUNT(CASE WHEN message_generated = 1 THEN 1 END) as messages_created,
                        MIN(timestamp) as first_seen,
                        MAX(timestamp) as last_seen
                    FROM user_interactions 
                    GROUP BY user_id 
                    ORDER BY total_interactions DESC 
                    LIMIT ?
                """, (limit,))
                
                users = cursor.fetchall()
                
                if not users:
                    print(f"\n👥 No user data available yet")
                    return
                
                print(f"\n👥 Most Active Users (Top {limit})")
                print("=" * 80)
                print(f"{'User ID':<12} {'Name':<15} {'Interactions':<12} {'Messages':<10} {'First Seen':<12}")
                print("-" * 80)
                
                for user in users:
                    user_id, name, interactions, messages, first_seen, last_seen = user
                    first_date = first_seen[:10] if first_seen else "Unknown"
                    display_name = name[:14] if name else f"User{user_id}"
                    print(f"{user_id:<12} {display_name:<15} {interactions:<12} {messages:<10} {first_date:<12}")
                
        except Exception as e:
            print(f"❌ Error getting user activity: {e}")
    
    def export_to_csv(self, output_file: str = None):
        """Export all data to CSV"""
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"telegram_bot/exports/analytics_export_{timestamp}.csv"
        
        # Ensure export directory exists
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        try:
            with sqlite3.connect(self.db_path) as conn:
                df = pd.read_sql_query("""
                    SELECT 
                        user_id,
                        username,
                        first_name,
                        last_name,
                        timestamp,
                        action,
                        recipient_name,
                        mood_choice,
                        message_generated
                    FROM user_interactions 
                    ORDER BY timestamp
                """, conn)
                
                df.to_csv(output_file, index=False)
                print(f"✅ Data exported to {output_file}")
                print(f"📊 Exported {len(df)} records")
                
        except Exception as e:
            print(f"❌ Error exporting data: {e}")
    
    def generate_report(self):
        """Generate a comprehensive analytics report"""
        print("🤖 KindWords Telegram Bot Analytics Report")
        print("=" * 50)
        print(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        # Overview stats
        self.get_overview_stats()
        
        # Daily activity
        self.get_daily_activity(7)
        
        # Mood popularity
        self.get_mood_popularity()
        
        # User activity
        self.get_user_activity(5)
        
        print("\n" + "=" * 50)
        print("💝 Thank you for spreading kindness with KindWords!")

def main():
    parser = argparse.ArgumentParser(description="KindWords Bot Analytics Viewer")
    parser.add_argument("--overview", action="store_true", help="Show overview statistics")
    parser.add_argument("--daily", type=int, default=7, help="Show daily activity for N days")
    parser.add_argument("--moods", action="store_true", help="Show mood popularity")
    parser.add_argument("--users", type=int, default=10, help="Show top N active users")
    parser.add_argument("--export", type=str, help="Export data to CSV file")
    parser.add_argument("--report", action="store_true", help="Generate full report")
    parser.add_argument("--db", type=str, default="telegram_bot/data/analytics.db", help="Database path")
    
    args = parser.parse_args()
    
    viewer = AnalyticsViewer(args.db)
    
    if args.report:
        viewer.generate_report()
    elif args.overview:
        viewer.get_overview_stats()
    elif args.moods:
        viewer.get_mood_popularity()
    elif args.export:
        viewer.export_to_csv(args.export)
    else:
        # Default: show overview and recent activity
        viewer.get_overview_stats()
        viewer.get_daily_activity(args.daily)
        viewer.get_user_activity(args.users)

if __name__ == "__main__":
    main()