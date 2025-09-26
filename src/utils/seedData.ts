/**
 * Simple seed data - exactly what you need for testing
 */
import { addItem, deleteItem, getAll } from './db';
import type { Class } from './db';

// Shared color constants
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export const seedDatabase = async (forceReseed = false) => {
  // Check if already seeded (unless forcing reseed)
  const existing = localStorage.getItem('rastbanken_seeded');
  if (existing && !forceReseed) return;

  try {
    // If forcing reseed, clear all existing data first
    if (forceReseed) {
      const [existingClasses, existingStudents, existingEquipment] = await Promise.all([
        getAll<Class>('classes'),
        getAll<any>('students'),
        getAll<any>('equipment')
      ]);

      // Delete all existing data
      for (const item of existingClasses) await deleteItem('classes', item.id);
      for (const item of existingStudents) await deleteItem('students', item.id);
      for (const item of existingEquipment) await deleteItem('equipment', item.id);

      // Clear the seeded flag
      localStorage.removeItem('rastbanken_seeded');
    }

    // All classes from 1A-6C with rotating colors
    const colors = COLORS;
    const classes: Class[] = [];

    // Generate förskoleklass FA-FC
    for (let classLetter of ['A', 'B', 'C']) {
      const id = `f${classLetter.toLowerCase()}`;
      const name = `F${classLetter}`;
      const colorIndex = (classes.length) % colors.length;
      classes.push({
        id,
        name,
        colorCode: colors[colorIndex]
      });
    }

    // Generate classes 1A-6C (grades 1-6, classes A-C)
    for (let grade = 1; grade <= 6; grade++) {
      for (let classLetter of ['A', 'B', 'C']) {
        const id = `${grade}${classLetter.toLowerCase()}`;
        const name = `${grade}${classLetter}`;
        const colorIndex = (classes.length) % colors.length;
        classes.push({
          id,
          name,
          colorCode: colors[colorIndex]
        });
      }
    }

    // No sample students or equipment - admin will add real data

    // Add only classes to database
    for (const cls of classes) {
      await addItem('classes', cls);
    }

    localStorage.setItem('rastbanken_seeded', 'true');
    // Database seeded successfully
  } catch (error) {
    // Error seeding database - fail silently in production
  }
};