/**
 * Simple app context - exactly what we need, nothing more
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initDB, getAll, addItem, updateItem, deleteItem, getAvailableEquipment, getActiveLoans, clearAllData } from '@/utils/db';
import type { Class, Student, Equipment, Loan } from '@/utils/db';
import { getNextColor } from '@/constants/colors';
import { findMatchingImage } from '@/utils/equipmentImageList';

interface AppState {
  // Data
  classes: Class[];
  students: Student[];
  equipment: (Equipment & { available: number })[];
  loans: Loan[];

  // UI state
  loading: boolean;

  // Simple actions
  loadData: () => Promise<void>;
  createLoan: (_studentId: string, _equipmentId: string) => Promise<void>;
  returnLoan: (_loanId: string) => Promise<void>;
  addStudent: (_name: string, _classId: string) => Promise<void>;
  addEquipment: (_name: string, _category: string, _quantity: number) => Promise<void>;

  // Admin actions
  deleteStudent: (_studentId: string) => Promise<void>;
  deleteClass: (_classId: string) => Promise<void>;
  addClass: (_name: string) => Promise<void>;
  deleteEquipment: (_equipmentId: string) => Promise<void>;
  updateEquipment: (_equipmentId: string, _newQuantity: number) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [equipment, setEquipment] = useState<(Equipment & { available: number })[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data - simple and direct
  const loadData = async () => {
    try {
      setLoading(true);
      await initDB();

      // Get existing data
      const [classesData, studentsData, equipmentData, loansData] = await Promise.all([
        getAll<Class>('classes'),
        getAll<Student>('students'),
        getAvailableEquipment(),
        getActiveLoans()
      ]);

      setClasses(classesData);

      setStudents(studentsData);
      setEquipment(equipmentData);
      setLoans(loansData);
    } catch (error) {
      // Error loading data - log for debugging
      console.error('Failed to load data from database:', error);
      alert('Kunde inte ladda data. Försök ladda om sidan.');
    } finally {
      setLoading(false);
    }
  };

  // Create loan - with availability check
  const createLoan = async (studentId: string, equipmentId: string) => {
    const student = students.find(s => s.id === studentId);
    const equipmentItem = equipment.find(e => e.id === equipmentId);
    const studentClass = classes.find(c => c.id === student?.classId);

    if (!student || !equipmentItem || !studentClass) {
      throw new Error('Student, equipment, or class not found');
    }

    // Check if equipment is available
    if (equipmentItem.available <= 0) {
      throw new Error('Equipment not available');
    }

    const loan: Loan = {
      id: Date.now().toString(),
      studentId,
      equipmentId,
      borrowedAt: new Date().toISOString(),
      studentName: student.name,
      equipmentName: equipmentItem.name,
      className: studentClass.name
    };

    await addItem('loans', loan);

    // Update state directly instead of reloading all data
    setLoans(prev => [...prev, loan]);
    setEquipment(prev => prev.map(eq =>
      eq.id === equipmentId
        ? { ...eq, available: eq.available - 1 }
        : eq
    ));
  };

  // Return loan - simple
  const returnLoan = async (loanId: string) => {
    // Find the loan to get equipment ID before deleting
    const loan = loans.find(l => l.id === loanId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    await deleteItem('loans', loanId);

    // Update state directly instead of reloading all data
    setLoans(prev => prev.filter(l => l.id !== loanId));
    setEquipment(prev => prev.map(eq =>
      eq.id === loan.equipmentId
        ? { ...eq, available: eq.available + 1 }
        : eq
    ));
  };

  // Add student - simple
  const addStudent = async (name: string, classId: string) => {
    const student: Student = {
      id: Date.now().toString(),
      name,
      classId
    };

    await addItem('students', student);

    // Update state directly instead of reloading all data
    setStudents(prev => [...prev, student]);
  };

  // Add equipment - simple
  const addEquipment = async (name: string, category: string, quantity: number) => {
    // Try to find matching image using smart search
    const matchedImageName = findMatchingImage(name);
    const imageUrl = matchedImageName ? `/equipment-icons/${matchedImageName}.webp` : undefined;

    const equipmentItem: Equipment = {
      id: Date.now().toString(),
      name,
      category,
      totalQuantity: quantity,
      imageUrl // Auto-set image URL based on smart match
    };

    await addItem('equipment', equipmentItem);

    // Update state directly - add equipment with full availability
    setEquipment(prev => [...prev, { ...equipmentItem, available: quantity }]);
  };

  // Delete student - with loan cleanup
  const deleteStudent = async (studentId: string) => {
    // Find all loans by this student and return them first
    const studentLoans = loans.filter(l => l.studentId === studentId);

    // Return all loans (this updates equipment availability)
    for (const loan of studentLoans) {
      await deleteItem('loans', loan.id);

      // Update equipment availability immediately for each returned loan
      setEquipment(prev => prev.map(eq =>
        eq.id === loan.equipmentId
          ? { ...eq, available: eq.available + 1 }
          : eq
      ));
    }

    // Delete the student
    await deleteItem('students', studentId);

    // Update state directly instead of reloading all data
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setLoans(prev => prev.filter(l => l.studentId !== studentId));
  };

  // Delete class - cascading delete (students + their loans)
  const deleteClass = async (classId: string) => {
    // Find all students in this class
    const classStudents = students.filter(s => s.classId === classId);

    // Find all loans by students in this class and return them
    const studentIds = classStudents.map(s => s.id);
    const classLoans = loans.filter(l => studentIds.includes(l.studentId));

    // Return all loans (this updates equipment availability)
    for (const loan of classLoans) {
      await deleteItem('loans', loan.id);
    }

    // Delete all students in this class
    for (const student of classStudents) {
      await deleteItem('students', student.id);
    }

    // Finally delete the class
    await deleteItem('classes', classId);

    // Update state directly instead of reloading all data
    setLoans(prev => prev.filter(l => !studentIds.includes(l.studentId)));
    setStudents(prev => prev.filter(s => s.classId !== classId));
    setClasses(prev => prev.filter(c => c.id !== classId));

    // Reload equipment to refresh availability counts
    const updatedEquipment = await getAvailableEquipment();
    setEquipment(updatedEquipment);
  };

  // Add class - with automatic color cycling
  const addClass = async (name: string) => {
    const colorCode = getNextColor(classes);
    const newClass: Class = {
      id: Date.now().toString(),
      name,
      colorCode
    };

    await addItem('classes', newClass);

    // Update state directly instead of reloading all data
    setClasses(prev => [...prev, newClass]);
  };

  // Delete equipment - simple
  const deleteEquipment = async (equipmentId: string) => {
    await deleteItem('equipment', equipmentId);

    // Update state directly instead of reloading all data
    setEquipment(prev => prev.filter(eq => eq.id !== equipmentId));
  };

  // Update equipment quantity - simple
  const updateEquipment = async (equipmentId: string, newQuantity: number) => {
    const equipmentItem = equipment.find(e => e.id === equipmentId);
    if (!equipmentItem) {
      throw new Error('Equipment not found');
    }

    const updatedEquipment: Equipment = {
      ...equipmentItem,
      totalQuantity: newQuantity
    };

    await updateItem('equipment', updatedEquipment);

    // Update state directly instead of reloading all data
    // Calculate new available quantity (total - currently borrowed)
    const currentlyBorrowed = equipmentItem.totalQuantity - equipmentItem.available;
    const newAvailable = newQuantity - currentlyBorrowed;

    setEquipment(prev => prev.map(eq =>
      eq.id === equipmentId
        ? { ...eq, totalQuantity: newQuantity, available: Math.max(0, newAvailable) }
        : eq
    ));
  };

  // Reset all data - clear database and reset state
  const resetAllData = async () => {
    await clearAllData();

    // Reset all state to empty
    setClasses([]);
    setStudents([]);
    setEquipment([]);
    setLoans([]);
  };

  // Initialize on mount
  useEffect(() => {
    loadData();
  }, []);

  const value: AppState = {
    classes,
    students,
    equipment,
    loans,
    loading,
    loadData,
    createLoan,
    returnLoan,
    addStudent,
    addEquipment,
    deleteStudent,
    deleteClass,
    addClass,
    deleteEquipment,
    updateEquipment,
    resetAllData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};