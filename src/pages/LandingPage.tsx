import React, { useEffect, useState, useRef } from 'react';
import { Heart, ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';

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
      audioRef.current.volume = 0.2;
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
        audioRef.current.volume = 0.2;
        audioRef.current.play();
      } else {
        audioRef.current.volume = 0;
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-purple-100 relative overflow-hidden">
      {/* Background Music - Copyright-free lofi track */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        crossOrigin="anonymous"
      >
        <source src="https://www.chosic.com/wp-content/uploads/2021/05/Lofi-Study.mp3" type="audio/mpeg" />
        <source src="https://pixabay.com/music/beats-lofi-study-112191/" type="audio/mpeg" />
        {/* Fallback to a gentle nature sound if music doesn't load */}
        <source src="https://www.soundjay.com/misc/sounds/rain-01.wav" type="audio/wav" />
      </audio>

      {/* Music Control */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200/50 group"
        title={isMuted ? "Unmute background music" : "Mute background music"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
        ) : (
          <Volume2 className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
        )}
      </button>

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
          <button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm font-medium"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-md rounded-full px-6 py-3 mb-12 border border-amber-200/50 shadow-lg animate-fade-in">
            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-amber-800">Crafted with AI & Compassion</span>
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
              <span>Begin Your Journey</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
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

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
              Tenderly Crafted
            </h2>
            <p className="text-xl text-amber-700/80 max-w-3xl mx-auto font-light">
              Every feature designed to nurture connections and spread warmth with the gentlest touch
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="group bg-white/50 backdrop-blur-md rounded-3xl p-10 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:bg-white/70 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-300 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <span className="text-4xl">🌸</span>
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Gentle Intelligence</h3>
              <p className="text-amber-700/80 text-center leading-relaxed font-light">Messages that bloom with authentic emotion, crafted by AI that understands the language of the heart</p>
            </div>
            
            <div className="group bg-white/50 backdrop-blur-md rounded-3xl p-10 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:bg-white/70 hover:scale-105" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-r from-purple-300 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <span className="text-4xl">🕊️</span>
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Peaceful Delivery</h3>
              <p className="text-amber-700/80 text-center leading-relaxed font-light">Send messages like soft whispers, arriving at the perfect moment when hearts are most receptive</p>
            </div>
            
            <div className="group bg-white/50 backdrop-blur-md rounded-3xl p-10 border border-amber-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:bg-white/70 hover:scale-105" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-400 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <span className="text-4xl">💫</span>
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Lasting Warmth</h3>
              <p className="text-amber-700/80 text-center leading-relaxed font-light">Words that nestle in memory like warm embraces, creating ripples of joy that last long after reading</p>
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
              "KindWords helped me reconnect with my grandmother in the most beautiful way. 
              The message felt like a warm hug wrapped in words."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-300 to-purple-300 rounded-full shadow-lg"></div>
              <div className="text-left">
                <div className="font-semibold text-amber-900 text-lg">Emma Rodriguez</div>
                <div className="text-amber-600 text-sm">Spreading warmth since 2024</div>
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
            Begin your journey of spreading gentle kindness today. Your first whisper of love is just moments away.
          </p>
          
          <button 
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-purple-400 to-pink-500 text-white px-12 py-6 rounded-full text-2xl font-medium hover:from-purple-500 hover:to-pink-600 transition-all duration-500 shadow-3xl hover:shadow-4xl transform hover:scale-105 inline-flex items-center space-x-4"
          >
            <span>Create Your First Whisper</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-500" />
          </button>
          
          <p className="text-amber-600 text-sm mt-6 font-light">Free to start • No credit card required • Pure kindness</p>
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
              <p className="text-sm mt-2 font-light">One gentle whisper at a time</p>
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