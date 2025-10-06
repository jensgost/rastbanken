/**
 * Equipment image utilities
 * Maps equipment names to their image files with smart matching
 */
import { findMatchingImage } from './equipmentImageList';

/**
 * Normalize equipment name to match filename
 * Converts to lowercase and removes special characters
 */
export const normalizeEquipmentName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '_') // Replace spaces with underscores (match your filenames)
    .replace(/[^a-z0-9_]/g, ''); // Remove special chars except underscore
};

/**
 * Get image URL for equipment name with smart matching
 * Returns the WebP image path if a match is found
 * Properly encodes Swedish characters (å, ä, ö) for URL compatibility
 */
export const getEquipmentImageUrl = (equipmentName: string): string | undefined => {
  const matchedImage = findMatchingImage(equipmentName);
  if (!matchedImage) {
    return undefined;
  }
  // Encode the filename to handle Swedish characters (å, ä, ö) and spaces
  const encodedFilename = encodeURIComponent(matchedImage);
  return `/equipment-icons/${encodedFilename}.webp`;
};

/**
 * Get equipment image with smart matching
 * Supports partial matches (e.g., "gräv" matches "grävmaskiner_och_stora_bilar")
 */
export const getEquipmentImage = (equipmentName: string): string | undefined => {
  if (!equipmentName || equipmentName.trim().length === 0) {
    return undefined;
  }
  return getEquipmentImageUrl(equipmentName);
};
