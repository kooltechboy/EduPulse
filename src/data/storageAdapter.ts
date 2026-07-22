const PREFIX = 'edupulse_';

// NASA-Grade Resilient Storage Shield with In-Memory Fallback & Quota Protection
const memoryFallbackMap = new Map<string, string>();

function isStorageAvailable(): boolean {
  try {
    const testKey = `${PREFIX}__test__`;
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    const fullKey = PREFIX + key;
    try {
      const item = isStorageAvailable()
        ? localStorage.getItem(fullKey)
        : memoryFallbackMap.get(fullKey) ?? null;

      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[EduPulse Storage] Error parsing storage item ${key}:`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    const fullKey = PREFIX + key;
    const serialized = JSON.stringify(value);

    try {
      if (isStorageAvailable()) {
        try {
          localStorage.setItem(fullKey, serialized);
        } catch (error: any) {
          if (
            error?.name === 'QuotaExceededError' ||
            error?.name === 'NS_ERROR_DOM_QUOTA_REACHED'
          ) {
            console.warn('[EduPulse Storage] Quota exceeded. Evicting old sync queues...');
            localStorage.removeItem(`${PREFIX}sync_queue`);
            try {
              localStorage.setItem(fullKey, serialized);
            } catch {
              memoryFallbackMap.set(fullKey, serialized);
            }
          } else {
            memoryFallbackMap.set(fullKey, serialized);
          }
        }
      } else {
        memoryFallbackMap.set(fullKey, serialized);
      }
    } catch (error) {
      console.error(`[EduPulse Storage] Error setting storage item ${key}:`, error);
    }
  },

  remove(key: string): void {
    const fullKey = PREFIX + key;
    memoryFallbackMap.delete(fullKey);
    try {
      if (isStorageAvailable()) {
        localStorage.removeItem(fullKey);
      }
    } catch (error) {
      console.error(`[EduPulse Storage] Error removing storage item ${key}:`, error);
    }
  },

  clear(): void {
    memoryFallbackMap.clear();
    try {
      if (isStorageAvailable()) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('[EduPulse Storage] Error clearing storage:', error);
    }
  },

  has(key: string): boolean {
    const fullKey = PREFIX + key;
    if (memoryFallbackMap.has(fullKey)) return true;
    try {
      return isStorageAvailable() && localStorage.getItem(fullKey) !== null;
    } catch {
      return false;
    }
  },
};

