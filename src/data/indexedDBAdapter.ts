/* ============================================================================
   EDUPULSE — IndexedDB Asynchronous Storage Adapter
   High-capacity client database replacing 5MB LocalStorage limit.
   ============================================================================ */

const DB_NAME = 'edupulse_db';
const DB_VERSION = 1;
const STORE_NAME = 'edupulse_kv_store';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const idbStorage = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await openDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result !== undefined ? (request.result as T) : defaultValue);
        };
        request.onerror = () => resolve(defaultValue);
      });
    } catch (err) {
      console.error(`IndexedDB get error for key ${key}:`, err);
      return defaultValue;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(value, key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error(`IndexedDB set error for key ${key}:`, err);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error(`IndexedDB remove error for key ${key}:`, err);
    }
  },

  async clear(): Promise<void> {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error('IndexedDB clear error:', err);
    }
  },
};
