import React, { useEffect, useState, useRef } from 'react';
import { Heart, ArrowRight, Sparkles, Volume2, VolumeX, MessageCircle, Zap, Users } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Auto-play background music
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Gentle volume for lofi
      audioRef.current.play().catch(() => {
        // Auto-play might be blocked, that's okay
        console.log('Auto-play blocked by browser');
      });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0.15;
        audioRef.current.play();
      } else {
        audioRef.current.volume = 0;
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const openTelegramBot = () => {
    window.open('https://t.me/AI_KindWords_bot', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-purple-100 relative overflow-hidden">
      {/* Background Music - Lofi Hip Hop */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        crossOrigin="anonymous"
      >
        {/* Primary source - Convert YouTube to direct audio URL */}
        <source src="https://www.youtube.com/watch?v=6H-PLF2CR18" type="audio/mpeg" />
        {/* Fallback lofi tracks */}
        <source src="https://www.chosic.com/wp-content/uploads/2021/05/Lofi-Study.mp3" type="audio/mpeg" />
        <source src="https://pixabay.com/music/beats-lofi-study-112191/" type="audio/mpeg" />
        {/* Final fallback to gentle nature sound */}
        <source src="https://www.soundjay.com/misc/sounds/rain-01.wav" type="audio/wav" />
      </audio>

      {/* Music Control with Enhanced Styling */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-amber-200/50 group hover:scale-110"
        title={isMuted ? "🎵 Play lofi music" : "🔇 Mute lofi music"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-amber-700 group-hover:scale-110 transition-transform" />
        ) : (
          <Volume2 className="w-6 h-6 text-amber-700 group-hover:scale-110 transition-transform animate-pulse" />
        )}
      </button>

      {/* Music Info Badge */}
      {!isMuted && (
        <div className="fixed top-6 right-24 z-40 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-amber-200/50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-amber-700 font-medium">🎵 Lofi vibes</span>
          </div>
        </div>
      )}

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gentle floating orbs */}
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '5%',
            left: '5%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-200/15 to-pink-200/15 rounded-full blur-3xl animate-pulse"
          style={{
            top: '50%',
            right: '5%',
            animationDelay: '3s',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-stone-200/25 to-amber-200/25 rounded-full blur-2xl animate-pulse"
          style={{
            top: '25%',
            right: '25%',
            animationDelay: '6s',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-300/40 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 group">
            <div className="relative">
              <Heart className="w-9 h-9 text-purple-400 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 w-9 h-9 bg-purple-300/30 rounded-full blur-lg group-hover:bg-purple-300/50 transition-all duration-500"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-purple-700 bg-clip-text text-transparent">
              KindWords
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={openTelegramBot}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-full hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm font-medium flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Telegram Bot</span>
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm font-medium"
            >
              Web App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-md rounded-full px-6 py-3 mb-12 border border-amber-200/50 shadow-lg animate-fade-in">
            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-amber-800">Crafted with AI & Compassion</span>
            <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-amber-600">🎵 Lofi vibes included</span>
          </div>
          
          <h1 
            className="text-6xl md:text-8xl font-bold text-amber-900 mb-10 leading-tight animate-fade-in-up"
            style={{
              transform: `translateY(${scrollY * -0.1}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            Whisper
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-600 bg-clip-text text-transparent animate-gradient">
              kindness
            </span>
            <br />
            into hearts
          </h1>
          
          <p className="text-xl md:text-2xl text-amber-700/80 mb-16 max-w-4xl mx-auto leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '0.3s' }}>
            Let gentle words flow like warm honey, carrying comfort and joy to those you cherish. 
            Our AI understands the delicate art of touching souls with tenderness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button 
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-purple-400 to-pink-500 text-white px-10 py-5 rounded-full text-xl font-medium hover:from-purple-500 hover:to-pink-600 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 inline-flex items-center space-x-4"
            >
              <span>Create on Web</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
            </button>

            <button 
              onClick={openTelegramBot}
              className="group bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-10 py-5 rounded-full text-xl font-medium hover:from-blue-500 hover:to-cyan-600 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 inline-flex items-center space-x-4"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Try Telegram Bot</span>
            </button>
            
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-r from-amber-300 to-purple-300 rounded-full border-3 border-white shadow-lg"></div>
                ))}
              </div>
              <span className="text-sm font-medium">12,000+ gentle souls</span>
            </div>
          </div>
        </div>
      </main>

      {/* Platform Options Section */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-r from-white/40 to-amber-50/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
              Choose Your Kindness Journey
            </h2>
            <p className="text-xl text-amber-700/80 max-w-3xl mx-auto font-light">
              Spread warmth through your preferred platform - each designed to nurture connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Web App */}
            <div className="group bg-white/60 backdrop-blur-md rounded-3xl p-12 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:bg-white/80 hover:scale-105">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-300 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-semibold text-amber-900 mb-6 text-center">Web Experience</h3>
              <p className="text-amber-700/80 text-center leading-relaxed font-light mb-8">
                Immerse yourself in our beautiful web interface with soothing lofi music. Create personalized messages with rich customization, 
                schedule delivery, and enjoy the full visual experience of spreading kindness.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-amber-700">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Rich visual interface with lofi ambiance</span>
                </div>
                <div className="flex items-center space-x-3 text-amber-700">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Advanced customization</span>
                </div>
                <div className="flex items-center space-x-3 text-amber-700">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Scheduled delivery</span>
                </div>
              </div>
              <button 
                onClick={onGetStarted}
                className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-4 rounded-xl font-medium hover:from-purple-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Creating
              </button>
            </div>

            {/* Telegram Bot */}
            <div className="group bg-white/60 backdrop-blur-md rounded-3xl p-12 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:bg-white/80 hover:scale-105">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-semibold text-amber-900 mb-6 text-center">Telegram Bot</h3>
              <p className="text-amber-700/80 text-center leading-relaxed font-light mb-8">
                Quick and convenient kindness on-the-go! Chat with our AI bot directly in Telegram. 
                Generate compliments, create messages, and spread joy with simple commands.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-amber-700">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Instant access via Telegram</span>
                </div>
                <div className="flex items-center space-x-3 text-amber-700">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Personal compliments</span>
                </div>
                <div className="flex items-center space-x-3 text-amber-700">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Quick message creation</span>
                </div>
              </div>
              <button 
                onClick={openTelegramBot}
                className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white py-4 rounded-xl font-medium hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Open Bot</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
              Tenderly Crafted Features
            </h2>
            <p className="text-xl text-amber-700/80 max-w-3xl mx-auto font-light">
              Every feature designed to nurture connections and spread warmth with the gentlest touch
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="group bg-white/50 backdrop-blur-md rounded-3xl p-10 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:bg-white/70 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-300 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Gentle Intelligence</h3>
              <p className="text-amber-700/80 text-center leading-relaxed font-light">Messages that bloom with authentic emotion, crafted by AI that understands the language of the heart</p>
            </div>
            
            <div className="group bg-white/50 backdrop-blur-md rounded-3xl p-10 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:bg-white/70 hover:scale-105" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Instant Connection</h3>
              <p className="text-amber-700/80 text-center leading-relaxed font-light">Connect instantly through Telegram or dive deep with our web experience - kindness at your fingertips</p>
            </div>
            
            <div className="group bg-white/50 backdrop-blur-md rounded-3xl p-10 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:bg-white/70 hover:scale-105" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-400 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Growing Community</h3>
              <p className="text-amber-700/80 text-center leading-relaxed font-light">Join thousands spreading kindness daily - together we create ripples of joy that reach far beyond imagination</p>
            </div>
          </div>
        </div>
      </section>

      {/* Telegram Bot Showcase */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-r from-blue-50/60 to-cyan-50/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
              Meet Your Kindness Companion
            </h2>
            <p className="text-xl text-amber-700/80 max-w-3xl mx-auto font-light">
              Our Telegram bot brings AI-powered kindness directly to your chat. Simple, instant, and always ready to help you spread joy.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 border border-blue-200/50 shadow-2xl max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-amber-900 mb-6">
                  🤖 @AI_KindWords_bot
                </h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Personal Compliments</h4>
                      <p className="text-amber-700/80 text-sm">Receive gentle, uplifting compliments whenever you need them</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Message Creation</h4>
                      <p className="text-amber-700/80 text-sm">Create personalized messages for friends with AI assistance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Mood Themes</h4>
                      <p className="text-amber-700/80 text-sm">Choose from 6 gentle moods: Uplift, Thanks, Motivation, and more</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-900">Usage Analytics</h4>
                      <p className="text-amber-700/80 text-sm">Track your kindness journey with personal statistics</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={openTelegramBot}
                  className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Start Chatting</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100/80 to-cyan-100/80 rounded-2xl p-8 border border-blue-200/50">
                <div className="space-y-4">
                  <div className="bg-white/80 rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-blue-600 font-medium mb-1">You</div>
                    <div className="text-gray-800">/compliment</div>
                  </div>
                  <div className="bg-blue-500 text-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-blue-100 font-medium mb-1">KindWords Bot</div>
                    <div className="text-sm leading-relaxed">
                      💝 <strong>A gentle compliment for you:</strong><br/>
                      <em>"Your kindness radiates warmth that brightens everyone's day. The way you care for others shows the depth of your beautiful heart."</em><br/>
                      🌸 Remember: You are worthy of love and kindness! 🌸
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-blue-600 bg-blue-100/50 px-3 py-1 rounded-full">
                      Try it yourself! →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-r from-white/40 to-amber-50/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-16 border border-amber-200/60 shadow-2xl">
            <div className="flex justify-center mb-8">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-8 h-8 text-amber-400 fill-current mx-1">⭐</div>
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl text-amber-800 mb-8 italic leading-relaxed font-light">
              "The Telegram bot is amazing! I get daily compliments that genuinely lift my spirits, 
              and creating messages for friends is so easy. The web experience with lofi music is pure zen. KindWords has become part of my daily routine."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full shadow-lg"></div>
              <div className="text-left">
                <div className="font-semibold text-amber-900 text-lg">Sarah Chen</div>
                <div className="text-amber-600 text-sm">Telegram Bot User since 2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-amber-900 mb-8">
            Ready to touch a soul?
          </h2>
          <p className="text-xl text-amber-700/80 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Begin your journey of spreading gentle kindness today. Choose your path and start creating ripples of joy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <button 
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-purple-400 to-pink-500 text-white px-12 py-6 rounded-full text-2xl font-medium hover:from-purple-500 hover:to-pink-600 transition-all duration-500 shadow-3xl hover:shadow-4xl transform hover:scale-105 inline-flex items-center space-x-4"
            >
              <span>Create on Web</span>
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-500" />
            </button>

            <button 
              onClick={openTelegramBot}
              className="group bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-12 py-6 rounded-full text-2xl font-medium hover:from-blue-500 hover:to-cyan-600 transition-all duration-500 shadow-3xl hover:shadow-4xl transform hover:scale-105 inline-flex items-center space-x-4"
            >
              <MessageCircle className="w-7 h-7" />
              <span>Try Telegram Bot</span>
            </button>
          </div>
          
          <p className="text-amber-600 text-sm font-light">Free to start • No registration required • Pure kindness • 🎵 Lofi vibes included</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-16 border-t border-amber-200/50 bg-gradient-to-r from-white/30 to-amber-50/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <Heart className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-purple-700 bg-clip-text text-transparent">
                KindWords
              </span>
            </div>
            <div className="text-amber-700 text-center md:text-right">
              <p className="text-lg">&copy; 2025 KindWords. Made with 💝 for spreading tenderness.</p>
              <p className="text-sm mt-2 font-light">One gentle whisper at a time • Available on Web & Telegram • 🎵 Powered by lofi vibes</p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(40px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fade-in {
          animation: fade-in 1.5s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1.5s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
}