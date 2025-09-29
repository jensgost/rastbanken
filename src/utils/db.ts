/**
 * Simple database utility for Rastbanken
 * Direct IndexedDB operations - no unnecessary abstractions
 */

// Simple types
export interface Class {
  id: string;
  name: string;
  colorCode: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
}

export interface Loan {
  id: string;
  studentId: string;
  equipmentId: string;
  borrowedAt: string;
  studentName: string; // denormalized for speed
  equipmentName: string; // denormalized for speed
  className: string; // denormalized for speed
}

let db: IDBDatabase;

// Initialize database
export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('rastbanken', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      db = (event.target as IDBOpenDBRequest).result;

      // Simple stores - exactly what we need
      if (!db.objectStoreNames.contains('classes')) {
        db.createObjectStore('classes', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('students')) {
        db.createObjectStore('students', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('equipment')) {
        db.createObjectStore('equipment', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('loans')) {
        db.createObjectStore('loans', { keyPath: 'id' });
      }
    };
  });
};

// Simple CRUD operations
export const addItem = <T>(store: string, item: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([store], 'readwrite');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.put(item); // Use put instead of add to allow updates

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const updateItem = <T>(store: string, item: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([store], 'readwrite');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteItem = (store: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([store], 'readwrite');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAll = <T>(store: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([store], 'readonly');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getById = <T>(store: string, id: string): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([store], 'readonly');
    const objectStore = transaction.objectStore(store);
    const request = objectStore.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Equipment availability (simple calculation)
export const getAvailableEquipment = async (): Promise<(Equipment & { available: number })[]> => {
  const equipment = await getAll<Equipment>('equipment');
  const loans = await getAll<Loan>('loans');

  return equipment.map(item => {
    const loanedCount = loans.filter(loan => loan.equipmentId === item.id).length;
    return {
      ...item,
      available: item.totalQuantity - loanedCount
    };
  });
};

// Active loans (simple query)
export const getActiveLoans = async (): Promise<Loan[]> => {
  return await getAll<Loan>('loans');
};

// Clear all data (for reset functionality)
export const clearAllData = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const stores = ['classes', 'students', 'equipment', 'loans'];
    const transaction = db.transaction(stores, 'readwrite');

    let completedStores = 0;

    stores.forEach(storeName => {
      const objectStore = transaction.objectStore(storeName);
      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = () => {
        completedStores++;
        if (completedStores === stores.length) {
          resolve();
        }
      };

      clearRequest.onerror = () => reject(clearRequest.error);
    });

    transaction.onerror = () => reject(transaction.error);
  });
};