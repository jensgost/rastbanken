/**
 * Rastbanken - Simple version matching original requirements
 * LÅNA: Start → Class → Name → Equipment
 * ÅTERLÄMNA: Start → List loans → Tap name
 */
import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import type { Class, Student, Equipment } from './utils/db';

// Constants
// Master PIN is handled in checkPin function for security
const FADE_DURATION = 400;
const MODAL_AUTO_HIDE_DURATION = 3000;
const PIN_LENGTH = 4;

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];

// Simple admin PIN check - secure enough for school app
const checkPin = (pin: string) => {
  const userPin = localStorage.getItem('adminPin');

  // Input validation
  if (!/^\d{4}$/.test(pin)) return false;

  // Check user PIN if set
  if (userPin && pin === userPin) return true;

  // Master PIN check - simple hash for basic security (adequate for school environment)
  const simpleHash = btoa(pin).split('').reverse().join('').substring(0, 8);
  return simpleHash === '==AMxkTM';
};

type Screen = 'start' | 'borrow-class' | 'borrow-student' | 'borrow-equipment' | 'return' | 'admin' | 'admin-dashboard';

const SimpleApp: React.FC = () => {
  const { classes, students, equipment, loans, loading, createLoan, returnLoan, addStudent, addEquipment, deleteStudent, deleteClass, addClass, deleteEquipment, updateEquipment } = useApp();

  // Helper function to sort classes naturally (1A, 1B, 1C, 2A, 2B, 2C, etc.)
  const sortClasses = (classList: Class[]) => {
    return [...classList].sort((a, b) => {
      // Handle förskoleklass (FA, FB, FC) - should come first
      const aIsForskola = a.name.match(/^F([A-Z])$/);
      const bIsForskola = b.name.match(/^F([A-Z])$/);

      if (aIsForskola && !bIsForskola) return -1; // F-classes first
      if (!aIsForskola && bIsForskola) return 1;
      if (aIsForskola && bIsForskola) {
        // Both are F-classes, sort by letter
        return aIsForskola[1].localeCompare(bIsForskola[1]);
      }

      // Handle regular grades (1A-6C)
      const aMatch = a.name.match(/^(\d+)([A-Z])$/);
      const bMatch = b.name.match(/^(\d+)([A-Z])$/);

      if (!aMatch || !bMatch) return a.name.localeCompare(b.name);

      const aNum = parseInt(aMatch[1]);
      const bNum = parseInt(bMatch[1]);
      const aLetter = aMatch[2];
      const bLetter = bMatch[2];

      if (aNum !== bNum) return aNum - bNum;
      return aLetter.localeCompare(bLetter);
    });
  };

  // Helper function to convert text to CamelCase (capitalize first letter of each word)
  // Preserves user-defined uppercase letters for abbreviations like "Maja S", "Maja FN"
  const toCamelCase = (text: string) => {
    return text
      .split(' ')
      .map(word => {
        if (!word) return word;

        // Handle hyphenated names (e.g., "maj-lis" -> "Maj-Lis")
        if (word.includes('-')) {
          return word
            .split('-')
            .map(part => {
              if (!part) return part;
              // Preserve user uppercase, but ensure first letter is capitalized
              return part.charAt(0).toUpperCase() + part.slice(1);
            })
            .join('-');
        }

        // For single words, preserve any uppercase letters the user typed
        // but ensure the first letter is capitalized
        const firstChar = word.charAt(0).toUpperCase();
        const restOfWord = word.slice(1);

        // If the rest contains uppercase letters, preserve them
        // Otherwise, make them lowercase
        if (/[A-Z]/.test(restOfWord)) {
          return firstChar + restOfWord;
        } else {
          return firstChar + restOfWord.toLowerCase();
        }
      })
      .join(' ');
  };

  // Helper function to sort equipment alphabetically
  const sortEquipment = (equipmentList: (Equipment & { available: number })[]) => {
    return [...equipmentList].sort((a, b) => a.name.localeCompare(b.name));
  };


  // Helper function to group classes by grade (1A-1C, 2A-2C, etc.)
  const groupClassesByGrade = (classList: Class[]) => {
    const groups: { [grade: string]: Class[] } = {};

    classList.forEach(cls => {
      // Handle förskoleklass (FA, FB, FC)
      const förskolaMatch = cls.name.match(/^F([A-Z])$/);
      if (förskolaMatch) {
        if (!groups['F']) groups['F'] = [];
        groups['F'].push(cls);
        return;
      }

      // Handle regular grades (1A-6C)
      const match = cls.name.match(/^(\d+)([A-Z])$/);
      if (match) {
        const grade = match[1];
        if (!groups[grade]) groups[grade] = [];
        groups[grade].push(cls);
      }
    });

    // Sort each group by letter (A, B, C)
    Object.keys(groups).forEach(grade => {
      groups[grade].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  };

  // Helper function to sort students alphabetically (name A-Ö, then by class)
  const sortStudents = (studentsList: Student[], classesList: Class[]) => {
    return [...studentsList].sort((a, b) => {
      // First sort by name (A-Ö)
      const nameComparison = a.name.localeCompare(b.name, 'sv');
      if (nameComparison !== 0) {
        return nameComparison;
      }

      // If names are the same, sort by class (F-classes first, then grades)
      const aClass = classesList.find(c => c.id === a.classId);
      const bClass = classesList.find(c => c.id === b.classId);

      if (!aClass || !bClass) return 0;

      // Handle förskoleklass (FA, FB, FC) - should come first
      const aIsForskola = aClass.name.match(/^F([A-Z])$/);
      const bIsForskola = bClass.name.match(/^F([A-Z])$/);

      if (aIsForskola && !bIsForskola) return -1; // F-classes first
      if (!aIsForskola && bIsForskola) return 1;
      if (aIsForskola && bIsForskola) {
        // Both are F-classes, sort by letter
        return aIsForskola[1].localeCompare(bIsForskola[1]);
      }

      // Handle regular grades (1A-6C)
      const aMatch = aClass.name.match(/^(\d+)([A-Z])$/);
      const bMatch = bClass.name.match(/^(\d+)([A-Z])$/);

      if (!aMatch || !bMatch) return aClass.name.localeCompare(bClass.name);

      const aNum = parseInt(aMatch[1]);
      const bNum = parseInt(bMatch[1]);
      const aLetter = aMatch[2];
      const bLetter = bMatch[2];

      // First by grade number
      if (aNum !== bNum) return aNum - bNum;
      // Then by letter
      return aLetter.localeCompare(bLetter);
    });
  };

  // Simple memoization for performance - with sorting applied
  const memoizedEquipment = useMemo(() => sortEquipment(equipment), [equipment]);
  const memoizedClasses = useMemo(() => sortClasses(classes), [classes]);
  const memoizedStudents = useMemo(() => sortStudents(students, classes), [students, classes]);

  // Memoized sorted class groups for better performance
  const sortedClassGroups = useMemo(() => {
    return Object.entries(groupClassesByGrade(memoizedClasses))
      .sort(([gradeA], [gradeB]) => {
        // Put förskoleklass (F) first
        if (gradeA === 'F' && gradeB !== 'F') return -1;
        if (gradeB === 'F' && gradeA !== 'F') return 1;
        if (gradeA === 'F' && gradeB === 'F') return 0;
        // Sort regular grades numerically
        return parseInt(gradeA) - parseInt(gradeB);
      });
  }, [memoizedClasses]);

  // Memoized sorted loans for better performance
  const sortedLoans = useMemo(() => {
    return [...loans].sort((a, b) => {
      // First sort by student name (A-Ö)
      const nameComparison = a.studentName.localeCompare(b.studentName, 'sv');
      if (nameComparison !== 0) {
        return nameComparison;
      }

      // If names are the same, sort by class (FA first, then 1A, 1B, etc.)
      const aClass = a.className;
      const bClass = b.className;

      // Handle förskoleklass vs regular grades
      const aIsForskola = aClass.startsWith('F');
      const bIsForskola = bClass.startsWith('F');

      if (aIsForskola && !bIsForskola) return -1;
      if (!aIsForskola && bIsForskola) return 1;

      // Both are same type, sort naturally
      return aClass.localeCompare(bClass, 'sv', { numeric: true });
    });
  }, [loans]);

  // Search term for admin student search
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  // Filtered students for search
  const filteredStudents = useMemo(() => {
    if (!studentSearchTerm.trim()) return memoizedStudents;

    return memoizedStudents.filter(student =>
      student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      memoizedClasses.find(c => c.id === student.classId)?.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
    );
  }, [memoizedStudents, studentSearchTerm, memoizedClasses]);

  const [screen, setScreen] = useState<Screen>('start');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [adminPin, setAdminPin] = useState('');



  // Fade effect state for deletions
  const [fadingItems, setFadingItems] = useState<Set<string>>(new Set());

  // Input modal state
  const [inputValue, setInputValue] = useState('');
  const [inputPrompt, setInputPrompt] = useState<{
    title: string;
    placeholder: string;
    onSubmit: (value: string) => void;
    maxLength?: number;
  } | null>(null);

  // Reusable confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  // Helper function for fade-out delete animation
  const fadeAndDelete = (itemId: string, deleteAction: () => void) => {
    // Add to fading items for gray fade effect
    setFadingItems(prev => new Set(prev).add(itemId));

    // After fade animation, perform delete
    setTimeout(() => {
      deleteAction();
      setFadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, FADE_DURATION); // Fade duration (matches return page)
  };

  // Simplified input prompt with validation
  const showInput = (title: string, placeholder: string, onSubmit: (value: string) => void, maxLength?: number) => {
    setInputValue(''); // Clear previous input
    setInputPrompt({
      title,
      placeholder,
      maxLength,
      onSubmit: (value: string) => {
        // Basic input validation
        const sanitized = value.trim();
        if (sanitized.length === 0) {
          showConfirmation('Fel', 'Fältet kan inte vara tomt');
          return;
        }
        if (sanitized.length > 30) {
          showConfirmation('Fel', 'För långt namn (max 30 tecken)');
          return;
        }
        onSubmit(sanitized);
      }
    });
  };

  // Helper function to show confirmation modal
  const showConfirmation = (title: string, message: string) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setShowConfirmModal(true);
    // Auto-hide after 3 seconds
    setTimeout(() => setShowConfirmModal(false), MODAL_AUTO_HIDE_DURATION);
  };

  // Input Modal Component
  const InputModal = () => {
    if (!inputPrompt) return null;

    const handleSubmit = () => {
      if (inputValue.trim()) {
        inputPrompt.onSubmit(inputValue.trim());
        setInputPrompt(null);
        setInputValue('');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold mb-6 text-center">{inputPrompt.title}</h2>
          <input
            id="modal-input"
            name="modalInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPrompt.placeholder}
            className="w-full p-4 text-2xl border-2 rounded-xl mb-6 text-center"
            maxLength={inputPrompt.maxLength}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          <div className="flex gap-4">
            <button
              onClick={() => {
                setInputPrompt(null);
                setInputValue('');
              }}
              className="flex-1 p-4 bg-gray-200 rounded-xl text-xl font-semibold"
            >
              Avbryt
            </button>
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="flex-1 p-4 bg-green-500 text-white rounded-xl text-xl font-semibold disabled:bg-gray-300"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!showConfirmModal) return null;

    const handleModalClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    const handleBackdropClick = () => {
      setShowConfirmModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={handleBackdropClick}>
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={handleModalClick}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">{confirmTitle}</h2>
            <p className="text-lg text-gray-600">{confirmMessage}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 flex items-center justify-center">
        <div className="text-4xl">Laddar...</div>
      </div>
    );
  }

  // START SCREEN
  if (screen === 'start') {
    return (
      <>
        <div className="min-h-screen bg-sky-300 p-8 flex flex-col relative overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setScreen('borrow-class')}
                  className="p-8 bg-green-500 text-white rounded-xl text-4xl font-bold active:scale-95 transition-transform"
                  aria-label="Gå till lånesidan för att låna redskap"
                >
                  LÅNA
                </button>
                <button
                  onClick={() => setScreen('return')}
                  className="p-8 bg-orange-500 text-white rounded-xl text-4xl font-bold active:scale-95 transition-transform"
                  aria-label="Gå till återlämningssidan för att lämna tillbaka redskap"
                >
                  ÅTERLÄMNA
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-8">
            <button
              onClick={() => setScreen('admin')}
              className="px-8 py-3 bg-gray-200 text-gray-600 rounded-lg text-lg active:scale-95 transition-transform"
              aria-label="Öppna administrationsmenyn"
              title="Admin"
            >
              <span className="text-2xl">⚙️</span>
            </button>
          </div>
        </div>
        <InputModal />
        <ConfirmationModal />
      </>
    );
  }

  // BORROW: Choose class
  if (screen === 'borrow-class') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Välj din klass</h1>
              <button onClick={() => setScreen('start')} className="px-4 py-2 bg-gray-200 rounded">
                ← Tillbaka
              </button>
            </div>

            <div className="flex justify-center mt-16">
              <div className="space-y-4">
              {sortedClassGroups.map(([grade, classes]) => (
                  <div key={grade}>
                    <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                      {classes.map((cls) => (
                        <button
                          key={cls.id}
                          onClick={() => {
                            setSelectedClass(cls);
                            setScreen('borrow-student');
                          }}
                          className="px-8 py-6 rounded-xl text-2xl font-bold text-white transition-all active:scale-95 h-16 flex items-center justify-center w-full min-w-[120px]"
                          style={{ backgroundColor: cls.colorCode }}
                        >
                          {cls.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <InputModal />
        <ConfirmationModal />
      </>
    );
  }

  // BORROW: Choose student
  if (screen === 'borrow-student' && selectedClass) {
    const classStudents = memoizedStudents.filter(s => s.classId === selectedClass.id);

    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">
                Välj ditt namn -
                <span
                  className="ml-2 px-3 py-1 rounded-lg text-white font-bold"
                  style={{ backgroundColor: selectedClass.colorCode }}
                >
                  {selectedClass.name}
                </span>
              </h1>
              <button onClick={() => setScreen('borrow-class')} className="px-4 py-2 bg-gray-200 rounded">
                ← Tillbaka
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {classStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => {
                    setSelectedStudent(student);
                    setScreen('borrow-equipment');
                  }}
                  className="p-4 bg-white rounded-xl text-xl font-semibold border-2 border-green-300 transition-all h-20 flex items-center justify-center"
                >
                  {student.name}
                </button>
              ))}

              <button
                onClick={() => {
                  showInput('Vad heter du?', 'Skriv ditt namn här...', (name) => {
                    const formattedName = toCamelCase(name);
                    addStudent(formattedName, selectedClass.id);
                  });
                }}
                className="p-4 bg-gray-100 rounded-xl text-xl font-semibold border-2 border-dashed border-gray-300 h-20 flex items-center justify-center text-center"
              >
                + Lägg till mitt namn
              </button>
            </div>
          </div>
        </div>
        <InputModal />
        <ConfirmationModal />
      </>
    );
  }

  // BORROW: Choose equipment
  if (screen === 'borrow-equipment' && selectedStudent) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Välj redskap - {selectedStudent.name}</h1>
              <div className="flex gap-2">
                <button onClick={() => {
                  setScreen('start');
                  setSelectedClass(null);
                  setSelectedStudent(null);
                }} className="px-4 py-2 bg-green-500 text-white rounded">
                  Klar
                </button>
                <button onClick={() => setScreen('borrow-student')} className="px-4 py-2 bg-gray-200 rounded">
                  ← Tillbaka
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {memoizedEquipment.map((item) => (
                <button
                  key={item.id}
                  onClick={async () => {
                    if (item.available <= 0) return;

                    try {
                      // Add fade effect for visual feedback
                      setFadingItems(prev => new Set([...prev, item.id]));

                      await createLoan(selectedStudent.id, item.id);

                      // Remove fade effect after success
                      setTimeout(() => {
                        setFadingItems(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(item.id);
                          return newSet;
                        });
                      }, FADE_DURATION);
                    } catch (error) {
                      // Error creating loan - remove fade and show feedback
                      setFadingItems(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(item.id);
                        return newSet;
                      });
                      showConfirmation('Fel', 'Kunde inte låna ut redskapet. Försök igen.');
                    }
                  }}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                    item.available <= 0
                      ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                      : fadingItems.has(item.id)
                      ? 'bg-green-100 border-green-400 scale-95'
                      : 'bg-white border-green-300'
                  }`}
                  disabled={item.available <= 0}
                >
                  <div className="text-2xl mb-2">•</div>
                  <div className="text-xl font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.available} kvar</div>
                </button>
              ))}

              <button
                onClick={() => {
                  showInput('Vad heter redskapet?', 'T.ex. Fotboll, Hopprep...', (equipmentName) => {
                    const formattedName = toCamelCase(equipmentName);
                    // Close the first modal before opening the second
                    setInputPrompt(null);
                    setTimeout(() => {
                      showInput('Hur många finns det?', 'Ange antal...', (quantityStr) => {
                        const quantity = parseInt(quantityStr);
                        if (isNaN(quantity) || quantity < 1) {
                          showConfirmation('Fel', 'Ange ett giltigt antal (minst 1)');
                          return;
                        }
                        addEquipment(formattedName, 'Sport', quantity);
                      });
                    }, 100);
                  });
                }}
                className="p-6 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300"
              >
                + Lägg till redskap
              </button>
            </div>
          </div>
        </div>
        <InputModal />
        <ConfirmationModal />
      </>
    );
  }

  // RETURN: Show active loans
  if (screen === 'return') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">Lämna tillbaka</h1>
              <button onClick={() => setScreen('start')} className="px-4 py-2 bg-gray-200 rounded">
                ← Tillbaka
              </button>
            </div>

            {loans.length === 0 ? (
              <div className="text-center text-2xl text-gray-600">
                Inga aktiva lån just nu
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sortedLoans.map((loan) => (
                  <button
                    key={loan.id}
                    onClick={async () => {
                      setFadingItems(prev => new Set(prev).add(loan.id));

                      setTimeout(async () => {
                        await returnLoan(loan.id);
                        setFadingItems(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(loan.id);
                          return newSet;
                        });
                      }, FADE_DURATION);
                    }}
                    className={`p-6 bg-white rounded-xl border-2 border-orange-300 text-left transition-all duration-400 relative ${
                      fadingItems.has(loan.id) ? 'opacity-20 bg-gray-100 border-gray-200' : ''
                    }`}
                    disabled={fadingItems.has(loan.id)}
                  >
                    <div className="text-xl font-bold flex items-center gap-2">
                      {loan.studentName}
                      {(() => {
                        const loanClass = classes.find(c => c.name === loan.className);
                        return loanClass ? (
                          <span
                            className="px-2 py-1 rounded text-white text-sm font-bold"
                            style={{ backgroundColor: loanClass.colorCode }}
                          >
                            {loan.className}
                          </span>
                        ) : (
                          <span className="text-gray-600">({loan.className})</span>
                        );
                      })()}
                    </div>
                    <div className="text-lg text-gray-600">→ {loan.equipmentName}</div>
                    <div className="text-sm text-gray-500">
                      Lånad: {new Date(loan.borrowedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <InputModal />
        <ConfirmationModal />
      </>
    );
  }

  // ADMIN: Simple PIN entry
  if (screen === 'admin') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 p-8 flex items-center justify-center">
          <div className="max-w-md mx-auto bg-white rounded-xl p-8 border-2 border-gray-200">
            <h1 className="text-2xl font-bold mb-6">Admin</h1>
            <input
              id="admin-pin"
              name="adminPin"
              type="password"
              placeholder="PIN-kod"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full p-3 border rounded text-center text-xl mb-4"
              maxLength={PIN_LENGTH}
            />
            <button
              onClick={() => {
                if (checkPin(adminPin)) {
                  setScreen('admin-dashboard');
                } else {
                  showConfirmation('Fel', 'Felaktig PIN');
                }
                setAdminPin('');
              }}
              className="w-full p-3 bg-blue-600 text-white rounded font-semibold"
            >
              Logga in
            </button>
            <button
              onClick={() => setScreen('start')}
              className="w-full p-3 mt-4 bg-gray-200 rounded"
            >
              Tillbaka
            </button>
          </div>
        </div>
        <InputModal />
        <ConfirmationModal />
      </>
    );
  }

  // ADMIN DASHBOARD: Admin functions
  if (screen === 'admin-dashboard') {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    showInput('Ny admin PIN (4 siffror):', 'Ange 4 siffror...', (newPin) => {
                      if (newPin.length !== PIN_LENGTH || isNaN(Number(newPin))) {
                        showConfirmation('Fel', `PIN måste vara exakt ${PIN_LENGTH} siffror`);
                        return;
                      }
                      localStorage.setItem('adminPin', newPin);
                      showConfirmation('PIN uppdaterad!', 'Ny admin PIN är sparad');
                    }, PIN_LENGTH);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded active:scale-95 transition-transform"
                >
                  Ändra PIN
                </button>
                <button
                  onClick={() => setScreen('start')}
                  className="px-4 py-2 bg-gray-200 rounded active:scale-95 transition-transform"
                >
                  ← Tillbaka till start
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Manage Classes */}
              <div className="bg-white rounded-xl p-6 min-h-[600px] border-2 border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Klasser</h2>
                </div>

                <button
                  onClick={() => {
                    showInput('Klassnamn (t.ex. 4A):', 'Skriv klassnamn här...', (name) => {
                      const colors = COLORS;
                      const colorCode = colors[Math.floor(Math.random() * colors.length)];
                      addClass(name.toUpperCase(), colorCode);
                    });
                  }}
                  className="w-full mb-4 p-3 bg-green-500 text-white rounded font-semibold active:scale-95 transition-transform duration-75"
                >
                  + Lägg till klass
                </button>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {memoizedClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className={`flex justify-between items-center p-2 border rounded transition-all duration-400 ${
                        fadingItems.has(cls.id) ? 'opacity-20 bg-gray-100' : ''
                      }`}
                    >
                      <span className="font-medium">{cls.name}</span>
                      <button
                        onClick={() => {
                          fadeAndDelete(
                            cls.id,
                            () => deleteClass(cls.id)
                          );
                        }}
                        className="px-2 py-1 bg-red-500 text-white text-sm rounded active:scale-95 transition-transform"
                        disabled={fadingItems.has(cls.id)}
                      >
                        Ta bort
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manage Students */}
              <div className="bg-white rounded-xl p-6 min-h-[600px] border-2 border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Elever</h2>
                  <input
                    id="student-search"
                    name="studentSearch"
                    type="text"
                    placeholder="Sök elever..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-32 px-3 py-0.5 border rounded text-sm ml-auto"
                  />
                </div>

                <button
                  onClick={() => {
                    showInput('Elevens namn:', 'Skriv elevens namn här...', (name) => {
                      const formattedName = toCamelCase(name);
                      // Close the first modal before opening the second
                      setInputPrompt(null);
                      setTimeout(() => {
                        showInput('Vilken klass? Skriv klassnamn:', 'T.ex. 4A, 2B...', (className) => {
                          const selectedClass = memoizedClasses.find(c => c.name.toLowerCase() === className.toLowerCase());
                          if (!selectedClass) {
                            showConfirmation('Fel', `Klass "${className}" finns inte. Tillgängliga klasser: ${memoizedClasses.map(c => c.name).join(', ')}`);
                            return;
                          }
                          addStudent(formattedName, selectedClass.id);
                        });
                      }, 100);
                    });
                  }}
                  className="w-full mb-4 p-3 bg-green-500 text-white rounded font-semibold active:scale-95 transition-transform duration-75"
                >
                  + Lägg till elev
                </button>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredStudents.map((student) => {
                    const studentClass = memoizedClasses.find(c => c.id === student.classId);
                    return (
                      <div
                        key={student.id}
                        className={`flex justify-between items-center p-2 border rounded transition-all duration-400 relative ${
                          fadingItems.has(student.id) ? 'opacity-20 bg-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">{student.name}</div>
                            {studentClass && (
                              <span
                                className="inline-block px-2 py-0.5 rounded text-white text-xs font-bold mt-1"
                                style={{ backgroundColor: studentClass.colorCode }}
                              >
                                {studentClass.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            fadeAndDelete(
                              student.id,
                              () => deleteStudent(student.id)
                            );
                          }}
                          className="px-2 py-1 bg-red-500 text-white text-sm rounded active:scale-95 transition-transform"
                          disabled={fadingItems.has(student.id)}
                        >
                          Ta bort
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manage Equipment */}
              <div className="bg-white rounded-xl p-6 min-h-[600px] border-2 border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Redskap</h2>
                  <button
                    onClick={async () => {
                      // Return all equipment by deleting all loans
                      for (const loan of loans) {
                        await returnLoan(loan.id);
                      }
                      showConfirmation('Klart!', `Alla ${loans.length} utlåningar återlämnade`);
                    }}
                    className="px-3 py-1 bg-orange-500 text-white text-sm rounded active:scale-95 transition-transform"
                  >
                    Återlämna alla
                  </button>
                </div>

                <button
                  onClick={() => {
                    showInput('Redskapsnamn:', 'T.ex. Fotboll, Hopprep...', (name) => {
                      const formattedName = toCamelCase(name);
                      // Close the first modal before opening the second
                      setInputPrompt(null);
                      setTimeout(() => {
                        showInput('Antal:', 'Hur många finns det?', (quantityStr) => {
                          const quantity = parseInt(quantityStr);
                          if (isNaN(quantity) || quantity < 1) {
                            showConfirmation('Fel', 'Ange ett giltigt antal (minst 1)');
                            return;
                          }
                          addEquipment(formattedName, 'Sport', quantity);
                        });
                      }, 100);
                    });
                  }}
                  className="w-full mb-4 p-3 bg-green-500 text-white rounded font-semibold active:scale-95 transition-transform duration-75"
                >
                  + Lägg till redskap
                </button>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {memoizedEquipment.map((item) => (
                    <div key={item.id} className={`p-2 border rounded transition-all duration-400 ${
                      fadingItems.has(item.id) ? 'opacity-20 bg-gray-100' : ''
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.available}/{item.totalQuantity} tillgängliga
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const newQuantity = item.totalQuantity - 1;
                              const borrowedCount = item.totalQuantity - item.available;
                              if (newQuantity < borrowedCount) {
                                showConfirmation('Fel', `Kan inte minska under ${borrowedCount} (${borrowedCount} är utlånade)`);
                                return;
                              }
                              updateEquipment(item.id, newQuantity);
                            }}
                            className="px-2 py-1 bg-orange-500 text-white text-xs rounded active:scale-95 transition-transform"
                            disabled={item.totalQuantity <= (item.totalQuantity - item.available) || fadingItems.has(item.id)}
                          >
                            -
                          </button>
                          <span className="text-sm font-medium min-w-[20px] text-center">{item.totalQuantity}</span>
                          <button
                            onClick={() => {
                              updateEquipment(item.id, item.totalQuantity + 1);
                            }}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded active:scale-95 transition-transform"
                            disabled={fadingItems.has(item.id)}
                          >
                            +
                          </button>
                          <button
                            onClick={() => {
                              fadeAndDelete(
                                item.id,
                                () => deleteEquipment(item.id)
                              );
                            }}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded active:scale-95 transition-transform ml-2"
                            disabled={fadingItems.has(item.id)}
                          >
                            Ta bort
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <InputModal />
        <ConfirmationModal />
      </>
    );
  }

  // This should never happen - all screens should return something
  return null;
};

// Main App with provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <SimpleApp />
    </AppProvider>
  );
};

export default App;