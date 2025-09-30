/**
 * Shared color constants for Rastbanken
 */
export const CLASS_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
];

export const getNextColor = (existingClasses: { colorCode?: string }[]): string => {
  const colorIndex = existingClasses.length % CLASS_COLORS.length;
  return CLASS_COLORS[colorIndex];
};