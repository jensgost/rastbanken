/**
 * Equipment image utilities
 * Maps equipment names to their image files with smart matching
 */
import { findMatchingImage } from './equipmentImageList';

/**
 * Get image URL for equipment name with smart matching
 * Returns the WebP image path if a match is found
 * Properly encodes Swedish characters (å, ä, ö) for URL compatibility
 * Uses Vite's BASE_URL for correct path in both dev and production
 * Uses NFC encoding for URLs (web standard)
 */
export const getEquipmentImageUrl = (equipmentName: string): string | undefined => {
  const matchedImage = findMatchingImage(equipmentName);
  if (!matchedImage) {
    return undefined;
  }
  // Keep as NFC (already normalized in image list) and encode for URL
  // This works for both dev server and GitHub Pages
  const encodedFilename = encodeURIComponent(matchedImage);
  // Use Vite's BASE_URL which is '/' in dev and '/rastbanken/' in production
  const baseUrl = import.meta.env.BASE_URL;
  return `${baseUrl}equipment-icons/${encodedFilename}.webp`;
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
