

export const BIRTHDAY = new Date('2003-06-23T00:00:00');

// --- BIRTHDAY PROTOCOL CONFIG ---
// Change the year here to set the next mission launch date
export const TARGET_DATE = new Date('2026-06-23T00:00:00');

export const NAME = "Johnson Saka";

// --- CONFIGURATION ARRAYS ---

export const QUOTES = [
  "The courage to begin is often the hardest line of code.",
  "Your consistency is the only dependency your success requires.",
  "I don't just solve problems; I architect reliable futures.",

  
  "Don't minimize your achievements. It's not bragging when it's fact.",
  "Trust the timing of your life.",
  "You are building a masterpiece.",
  "Keep going, you are doing great.",
  "Every star is a victory.",
  "The universe conspires in your favor.",
  "Your potential is infinite.",

];

export const AFFIRMATIONS = [
  "I am a Generative AI Leader and an architect of secure systems.",
  "My unique background is my greatest asset; I turn complexity into clarity for others.",
  "I speak the language of code and the language of impact.",
  "My frontend foundation is strong, and my AI vision is clear.",
  "I invest in my potential, and my commitment is non-negotiable.",
  "I am capable of handling whatever comes next.",
  "I am worthy of great things.",
  "I am exactly where I need to be.",
  "I am surrounded by abundance.",
  "I trust the journey.",
  "I am enough, just as I am."
];

export const INITIAL_STARS: never[] = [];

// --- UTILITY FUNCTIONS ---

/**
 * Calculates current level (Age).
 * @param referenceDate Optional date to calculate age against (e.g., TARGET_DATE for simulations)
 */
export const calculateLevel = (referenceDate: Date = new Date()): number => {
  let age = referenceDate.getFullYear() - BIRTHDAY.getFullYear();
  const m = referenceDate.getMonth() - BIRTHDAY.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < BIRTHDAY.getDate())) {
    age--;
  }
  return age;
};

export const calculateXP = (): number => {
  const today = new Date();
  // Time difference in milliseconds
  const diffTime = Math.abs(today.getTime() - BIRTHDAY.getTime());
  // Convert to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
