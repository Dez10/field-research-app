import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique specimen ID with optional prefix
 * Format: PREFIX-YYYYMMDD-XXXX (e.g., SPEC-20251201-A3F2)
 */
export function generateSpecimenId(prefix: string = 'SPEC'): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = uuidv4().slice(0, 4).toUpperCase();
  
  return `${prefix}-${dateStr}-${randomPart}`;
}

/**
 * Generates a sequential specimen number
 * Format: SPEC-000001, SPEC-000002, etc.
 */
export function generateSequentialId(lastNumber: number, prefix: string = 'SPEC'): string {
  const nextNumber = lastNumber + 1;
  const paddedNumber = String(nextNumber).padStart(6, '0');
  return `${prefix}-${paddedNumber}`;
}

/**
 * Validates specimen ID format
 */
export function validateSpecimenId(id: string): boolean {
  const pattern = /^[A-Z]+-\d{8}-[A-Z0-9]{4}$/;
  return pattern.test(id);
}
