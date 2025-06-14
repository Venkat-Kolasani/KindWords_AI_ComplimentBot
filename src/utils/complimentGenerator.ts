// Simulated AI compliment generation with extensive fallback templates

const complimentTemplates = {
  uplift: [
    "Hey {name}! Just wanted to remind you that your positive energy lights up every room you enter. Your resilience and strength inspire everyone around you. Keep being amazing! 🌟",
    "{name}, you have this incredible ability to find silver linings in any situation. Your optimism is contagious and makes the world a brighter place. Thank you for being you! ✨",
    "Hi {name}! Your kindness and compassion never go unnoticed. You have a gift for making others feel valued and heard. You're making a real difference! 💖",
    "Dear {name}, your spirit shines so brightly that it illuminates the path for others. You have a beautiful soul that radiates warmth and hope wherever you go. 🌈",
    "{name}, you possess an inner strength that's truly remarkable. Even in challenging times, you manage to lift others up with your grace and wisdom. You're extraordinary! 💫",
    "Hello beautiful {name}! Your authentic self is a gift to this world. The way you embrace life with such courage and joy is absolutely inspiring. Keep glowing! ✨",
    "{name}, you have this magical way of turning ordinary moments into something special. Your presence alone brings comfort and happiness to those around you. 🌸",
    "Sweet {name}, your heart is pure gold. The love and care you show to others creates ripples of positivity that reach far beyond what you can imagine. 💛",
    "{name}, you are a beacon of hope in this world. Your unwavering faith in goodness and your ability to see beauty everywhere is truly remarkable. 🌟",
    "Wonderful {name}, your laughter is like sunshine breaking through clouds. You have this amazing gift of bringing joy and lightness to even the heaviest moments. ☀️"
  ],
  congrats: [
    "Congratulations, {name}! Your hard work and dedication have truly paid off. You've achieved something amazing and you should be incredibly proud. You've earned every bit of this success! 🎉",
    "{name}, what an incredible achievement! Your perseverance and talent have led you to this moment. You've inspired so many people with your journey. Celebrate this win! 🏆",
    "Way to go, {name}! Your success is a testament to your character and determination. You've shown that dreams do come true with effort and passion. So proud of you! 🌟",
    "Bravo, {name}! This milestone is just the beginning of all the wonderful things you'll accomplish. Your dedication and vision have brought you here. Enjoy this moment! 🎊",
    "Outstanding work, {name}! You've turned your dreams into reality through sheer determination and skill. This achievement is so well-deserved. Congratulations! 🥳",
    "Fantastic job, {name}! Your commitment to excellence has paid off in the most beautiful way. You've proven that persistence and passion create magic. Celebrate big! 🎈",
    "Incredible, {name}! You've reached a goal that seemed impossible, but you never gave up. Your journey has been inspiring to watch. This is your moment to shine! ✨",
    "Amazing work, {name}! Your success story is one of courage, hard work, and unwavering belief in yourself. You've earned this celebration and so much more! 🎆",
    "Phenomenal achievement, {name}! You've shown the world what's possible when talent meets determination. Your success lights the way for others to follow. Bravo! 🌟",
    "Spectacular, {name}! This accomplishment reflects all the effort, sacrifice, and dedication you've poured into your dreams. You've made it happen! 🎯"
  ],
  thanks: [
    "Thank you, {name}, for being such an incredible friend. Your support, kindness, and genuine care mean the world to me. I'm so grateful to have you in my life! 🙏",
    "{name}, I can't thank you enough for everything you do. Your thoughtfulness and generosity never cease to amaze me. You make life so much better! 💕",
    "Dear {name}, your friendship is one of life's greatest gifts. Thank you for being there through thick and thin, for your wisdom, and for your unwavering support. You're amazing! ✨",
    "Sweet {name}, your kindness has touched my heart in ways you'll never know. Thank you for being the beautiful soul that you are. Your presence is a blessing! 🌸",
    "{name}, I'm overwhelmed with gratitude for all the ways you've enriched my life. Your compassion and understanding have been my anchor. Thank you for being you! 💖",
    "Wonderful {name}, thank you for always believing in me, even when I didn't believe in myself. Your faith and encouragement have been my guiding light. 🌟",
    "Dear friend {name}, your generosity of spirit never goes unnoticed. Thank you for the countless ways you spread joy and make the world a kinder place. 🤗",
    "Beautiful {name}, I'm so thankful for your listening ear, your wise words, and your warm heart. You've been a true gift in my life. Thank you! 💝",
    "Amazing {name}, thank you for being my cheerleader, my confidant, and my source of strength. Your friendship has been one of my life's greatest treasures. 🌈",
    "Precious {name}, your acts of kindness, both big and small, have made such a difference. Thank you for being a shining example of what goodness looks like. ✨"
  ],
  motivation: [
    "{name}, you have incredible strength within you that can overcome any challenge. Your potential is limitless, and I believe in you completely. You've got this! 💪",
    "Hey {name}! Remember that every expert was once a beginner, and every champion was once a contender. Your journey is just beginning, and greatness awaits! 🚀",
    "{name}, your determination and spirit are unstoppable forces. Even when things get tough, you have the power to rise above and achieve anything you set your mind to! 🌟",
    "Powerful {name}, within you lies the strength of mountains and the resilience of the ocean. No obstacle is too great when you have such fierce determination! ⛰️",
    "{name}, you are braver than you believe, stronger than you seem, and more capable than you imagine. Trust in your abilities and watch miracles unfold! ✨",
    "Unstoppable {name}, every setback is a setup for a comeback. Your courage in the face of challenges is what separates dreamers from achievers. Keep pushing! 🔥",
    "Mighty {name}, you have the heart of a warrior and the soul of a champion. When you combine your passion with persistence, nothing can stand in your way! ⚡",
    "Fearless {name}, remember that diamonds are formed under pressure. You're being shaped into something extraordinary through every challenge you face! 💎",
    "Incredible {name}, your dreams are not too big, you're just growing into them. Every step forward, no matter how small, brings you closer to your destiny! 🌠",
    "Phenomenal {name}, you have everything within you to turn your vision into reality. Trust the process, embrace the journey, and watch yourself soar! 🦅"
  ],
  celebration: [
    "It's party time, {name}! Your joy and enthusiasm are absolutely infectious. You know how to make every moment special and memorable. Let's celebrate life together! 🎊",
    "{name}, you bring such vibrant energy to everything you do! Your zest for life and ability to find joy in the little things makes every day an adventure. Keep shining! ✨",
    "Hey {name}! Your laughter is music to everyone's ears, and your smile can light up the darkest day. You're a celebration of everything wonderful in this world! 🎉",
    "Joyful {name}, your spirit is like confetti - colorful, uplifting, and impossible to ignore! Thank you for bringing such happiness wherever you go! 🎈",
    "Radiant {name}, you have this amazing gift of turning ordinary moments into extraordinary memories. Your presence makes every gathering feel like a festival! 🎪",
    "Sparkling {name}, your enthusiasm is like fireworks - bright, beautiful, and absolutely captivating! You make life feel like one big celebration! 🎆",
    "Bubbly {name}, your positive energy is so contagious that everyone around you can't help but smile. You're living proof that joy is the best accessory! 🥳",
    "Dazzling {name}, you dance through life with such grace and happiness. Your ability to find reasons to celebrate inspires everyone to embrace joy! 💃",
    "Brilliant {name}, your optimism shines brighter than any spotlight. You remind us all that life is meant to be celebrated, not just endured! 🌟",
    "Magnificent {name}, you're like a walking party - wherever you go, fun follows! Your gift for creating magical moments is truly special! 🎭"
  ],
  support: [
    "{name}, I want you to know that you're not alone in this journey. You're stronger than you realize, and you have people who care about you deeply. Take it one day at a time. 🤗",
    "Dear {name}, remember that it's okay not to be okay sometimes. Your feelings are valid, and your courage to keep going is admirable. You're braver than you believe! 💙",
    "{name}, you've weathered storms before and come out stronger. This challenging time will pass, and you'll emerge with even more wisdom and resilience. I believe in you! 🌈",
    "Gentle {name}, healing isn't linear, and that's perfectly okay. Be patient with yourself as you navigate this difficult time. You're doing better than you think! 🌱",
    "Courageous {name}, even in your darkest moments, there's a light within you that refuses to be extinguished. Hold onto that light - it will guide you through! 🕯️",
    "Strong {name}, it's okay to rest when you're tired, to cry when you're sad, and to ask for help when you need it. These aren't signs of weakness but of wisdom! 🌸",
    "Resilient {name}, you've survived 100% of your worst days so far. That's an incredible track record. Trust in your ability to get through this too! 💪",
    "Beautiful {name}, your worth isn't determined by your productivity or your struggles. You are valuable simply because you exist. Be gentle with yourself! 🦋",
    "Precious {name}, storms don't last forever, but strong people like you do. This difficult chapter is not your whole story. Better days are coming! ⛅",
    "Beloved {name}, you don't have to be perfect or have it all figured out. You just need to keep breathing, keep hoping, and keep believing in tomorrow! 🌅"
  ],
};

async function generateWithGemini(friendName: string, moodTheme: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    // Silently fall back to templates instead of throwing an error
    return generateFromTemplate(friendName, moodTheme);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a heartfelt, personalized ${moodTheme} message for someone named ${friendName}. The message should be warm, genuine, and uplifting. Keep it between 50-150 words and include appropriate emojis. Make it feel personal and authentic.`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (generatedText) {
      return generatedText.trim();
    } else {
      throw new Error('No content generated');
    }
  } catch (error) {
    console.warn('Gemini API failed, falling back to templates:', error);
    // Fall back to templates on any error
    return generateFromTemplate(friendName, moodTheme);
  }
}

function generateFromTemplate(friendName: string, moodTheme: string): string {
  const templates = complimentTemplates[moodTheme as keyof typeof complimentTemplates] || complimentTemplates.uplift;
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  return randomTemplate.replace(/{name}/g, friendName);
}

export async function generateCompliment(friendName: string, moodTheme: string): Promise<string> {
  return await generateWithGemini(friendName, moodTheme);
}