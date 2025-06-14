import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send, AlertCircle } from 'lucide-react';
import { generateCompliment } from '../utils/complimentGenerator';
import type { MessageData } from '../App';

interface CreateMessagePageProps {
  onBack: () => void;
}

const moodThemes = [
  { value: 'uplift', label: 'Uplift', emoji: '🌸' },
  { value: 'congrats', label: 'Congratulations', emoji: '🎉' },
  { value: 'thanks', label: 'Thank You', emoji: '🙏' },
  { value: 'motivation', label: 'Motivation', emoji: '💪' },
  { value: 'support', label: 'Support', emoji: '🤗' },
];

export function CreateMessagePage({ onBack }: CreateMessagePageProps) {
  const [messageData, setMessageData] = useState<MessageData>({
    friendName: '',
    moodTheme: 'uplift',
    deliveryMethod: 'email',
    scheduleTime: 'now',
  });
  
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMessage = async () => {
    if (!messageData.friendName) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const message = await generateCompliment(messageData.friendName, messageData.moodTheme);
      setGeneratedMessage(message);
    } catch (err) {
      setError('Unable to generate message. Please check your API key and try again.');
      console.error('Error generating message:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = () => {
    alert(`Message sent to ${messageData.friendName}! 🎉`);
    setShowSchedule(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-purple-100">
      {/* Header */}
      <header className="px-6 py-6 border-b border-amber-200/50 bg-white/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-3 hover:bg-amber-100/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-amber-700" />
          </button>
          <h1 className="text-2xl font-semibold text-amber-900">Create Your Gentle Message</h1>
        </div>
      </header>

      <main className="px-6 py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Friend's Name */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-amber-200/50 shadow-lg">
            <label className="block text-lg font-medium text-amber-900 mb-4">
              Friend's Name
            </label>
            <input
              type="text"
              value={messageData.friendName}
              onChange={(e) => setMessageData(prev => ({ ...prev, friendName: e.target.value }))}
              placeholder="Enter your friend's name"
              className="w-full px-6 py-4 border border-amber-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm text-lg"
            />
          </div>

          {/* Mood Theme */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-amber-200/50 shadow-lg">
            <label className="block text-lg font-medium text-amber-900 mb-6">
              Choose a Gentle Mood
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moodThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setMessageData(prev => ({ ...prev, moodTheme: theme.value }))}
                  className={`p-6 rounded-xl border-2 transition-all text-center hover:scale-105 ${
                    messageData.moodTheme === theme.value
                      ? 'border-purple-400 bg-purple-50/80 shadow-lg'
                      : 'border-amber-200 hover:border-purple-300 bg-white/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{theme.emoji}</div>
                  <div className="text-sm font-medium text-amber-900">{theme.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100/80 backdrop-blur-md rounded-2xl p-6 border border-red-300/50 shadow-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateMessage}
            disabled={!messageData.friendName || isGenerating}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-5 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3 text-lg"
          >
            {isGenerating ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Crafting with AI love...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>Generate AI Message</span>
              </>
            )}
          </button>

          {/* Message Preview */}
          {generatedMessage && (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-amber-200/50 shadow-lg">
              <h3 className="text-xl font-medium text-amber-900 mb-6">Your AI-Crafted Message</h3>
              <div className="bg-gradient-to-r from-amber-50/80 to-purple-50/80 rounded-xl p-6 mb-6">
                <p className="text-amber-800 leading-relaxed text-lg font-light">{generatedMessage}</p>
              </div>
              
              {!showSchedule ? (
                <div className="flex space-x-4">
                  <button
                    onClick={handleGenerateMessage}
                    disabled={isGenerating}
                    className="px-6 py-3 border border-amber-300 rounded-xl hover:bg-amber-50 transition-colors text-amber-700 disabled:opacity-50"
                  >
                    {isGenerating ? 'Regenerating...' : 'Regenerate'}
                  </button>
                  <button
                    onClick={() => setShowSchedule(true)}
                    className="flex-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 rounded-xl hover:from-purple-500 hover:to-pink-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium text-amber-900 mb-4">
                      Delivery Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setMessageData(prev => ({ ...prev, deliveryMethod: 'email' }))}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          messageData.deliveryMethod === 'email'
                            ? 'border-purple-400 bg-purple-50/80'
                            : 'border-amber-200 hover:border-purple-300 bg-white/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">📧</div>
                        <div className="text-sm font-medium text-amber-900">Email</div>
                      </button>
                      <button
                        onClick={() => setMessageData(prev => ({ ...prev, deliveryMethod: 'sms' }))}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          messageData.deliveryMethod === 'sms'
                            ? 'border-purple-400 bg-purple-50/80'
                            : 'border-amber-200 hover:border-purple-300 bg-white/50'
                        }`}
                      >
                        <div className="text-2xl mb-1">📱</div>
                        <div className="text-sm font-medium text-amber-900">SMS</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-amber-900 mb-4">
                      {messageData.deliveryMethod === 'email' ? 'Email Address' : 'Phone Number'}
                    </label>
                    <input
                      type={messageData.deliveryMethod === 'email' ? 'email' : 'tel'}
                      placeholder={
                        messageData.deliveryMethod === 'email' 
                          ? 'friend@example.com' 
                          : '+1 (555) 123-4567'
                      }
                      className="w-full px-6 py-4 border border-amber-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowSchedule(false)}
                      className="px-6 py-3 border border-amber-300 rounded-xl hover:bg-amber-50 transition-colors text-amber-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="flex-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 rounded-xl hover:from-purple-500 hover:to-pink-600 transition-colors"
                    >
                      Send Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}