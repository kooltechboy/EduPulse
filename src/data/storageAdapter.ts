const PREFIX = 'edupulse_';

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(PREFIX + key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing storage item ${key}:`, error);
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting storage item ${key}:`, error);
    }
  },
  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },
  clear(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },
  has(key: string): boolean {
    return localStorage.getItem(PREFIX + key) !== null;
  }
};
