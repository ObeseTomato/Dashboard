// obesetomato/dashboard/Dashboard-c1fdb5a0f45fa9f7c956a11b09f4801f23b45082/src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// NEW: Utility to safely get a nested property from an object
export function safeGet<T = any>(obj: any, path: string | string[], defaultValue: T | undefined = undefined): T | undefined {
  if (obj === null || obj === undefined) return defaultValue;

  const pathParts = Array.isArray(path) ? path : path.split('.');
  let current: any = obj;

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    if (typeof current !== 'object' || current === null || !current.hasOwnProperty(part)) {
      return defaultValue;
    }
    current = current[part];
  }
  return current !== undefined ? current : defaultValue;
}

// NEW: Utility to safely ensure a value is an array
export function safeArray<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}
// NEW: Utility to safely render any value as a string
export function renderSafeValue(value: any): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (typeof value === 'string' && value.trim() === '') {
    return 'N/A';
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return 'N/A';
    }
  }
  return String(value);
}