/**
 * Word filter for inappropriate content in Rastbanken
 * Blocks common foul words in Swedish and English
 */

// Swedish inappropriate words (comprehensive list for school context)
const swedishBlacklist = [
  // Profanity and vulgar terms
  'fan', 'skit', 'satan', 'helvete', 'jävla', 'jävel', 'jävlar', 'kuk', 'fitta', 'hora',
  'slampa', 'knulla', 'runk', 'pulla', 'bajsa', 'kiss', 'piss', 'röv', 'arsle',

  // Offensive/derogatory terms
  'idiot', 'mongo', 'cp', 'handikappad', 'cancer', 'aids', 'kreft', 'dö', 'död',
  'självmord', 'mörda', 'våldta', 'bög', 'bögen', 'hora', 'blatte', 'neger', 'svartskalle',

  // Variations and slang
  'faen', 'fy fan', 'javla', 'javlar', 'kuksugare', 'fitthuvud', 'horunge',
  'skitstövel', 'satans', 'helvetes', 'jävligt', 'förbannad'
];

// English inappropriate words (comprehensive list for school context)
const englishBlacklist = [
  // Strong profanity
  'fuck', 'fucking', 'fucked', 'fucker', 'fuckoff', 'shit', 'shitting', 'damn',
  'dammit', 'hell', 'bitch', 'bitching', 'ass', 'asshole', 'crap', 'piss', 'pissed',

  // Sexual/vulgar terms
  'cock', 'dick', 'penis', 'pussy', 'vagina', 'tits', 'boobs', 'sex', 'sexy',
  'whore', 'slut', 'prostitute', 'rape', 'naked', 'nude',

  // Offensive/derogatory terms
  'bastard', 'moron', 'retard', 'retarded', 'stupid', 'idiot', 'loser', 'kill',
  'murder', 'suicide', 'nazi', 'hitler', 'terrorist', 'bomb',

  // Discriminatory terms
  'gay', 'fag', 'faggot', 'homo', 'lesbian', 'dyke', 'nigger', 'nigga', 'chink', 'spic',
  'kike', 'wetback', 'terrorist',

  // Internet slang and mild inappropriate
  'wtf', 'stfu', 'gtfo', 'lmao', 'omfg', 'fml', 'bs', 'bullshit',
  'suck', 'sucks', 'sucked', 'hate', 'hatred', 'die', 'dead', 'death'
];

// Combine both lists
const blacklistedWords = [...swedishBlacklist, ...englishBlacklist];

/**
 * Check if text contains inappropriate words
 * @param text - Text to check
 * @returns true if text contains blacklisted words
 */
export const containsInappropriateWords = (text: string): boolean => {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const normalizedText = text.toLowerCase().trim();

  // Check for exact matches and partial matches
  return blacklistedWords.some(word => {
    const normalizedWord = word.toLowerCase();

    // Check if word appears as standalone word or part of word
    return normalizedText.includes(normalizedWord);
  });
};

/**
 * Get user-friendly error message in Swedish
 * @returns Error message for inappropriate content
 */
export const getInappropriateWordError = (): string => {
  return 'Namnet innehåller otillåtet innehåll. Vänligen välj ett annat namn.';
};

/**
 * Clean text by removing inappropriate words (alternative approach)
 * @param text - Text to clean
 * @returns Cleaned text with inappropriate words replaced
 */
export const cleanText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let cleanedText = text;

  blacklistedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleanedText = cleanedText.replace(regex, '***');
  });

  return cleanedText;
};