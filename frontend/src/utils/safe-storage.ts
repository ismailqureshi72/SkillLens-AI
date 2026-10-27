export function readStringList(key: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  } catch { return []; }
}

export function writeStorage(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Storage may be disabled. */ }
}

export function readStorage(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
