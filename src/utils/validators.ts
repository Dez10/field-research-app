import type { ValidationRule } from '../types/specimen';

/**
 * Validates coordinate values
 */
export function validateCoordinates(lat?: number, lon?: number): { valid: boolean; message?: string } {
  if (lat !== undefined && (lat < -90 || lat > 90)) {
    return { valid: false, message: 'Latitude must be between -90 and 90' };
  }
  
  if (lon !== undefined && (lon < -180 || lon > 180)) {
    return { valid: false, message: 'Longitude must be between -180 and 180' };
  }
  
  return { valid: true };
}

/**
 * Validates measurement units
 */
export function validateUnits(value: number, unit: string): { valid: boolean; message?: string } {
  const validUnits = ['m', 'cm', 'mm', 'km', 'ft', 'in', 'kg', 'g', 'lb'];
  
  if (!validUnits.includes(unit)) {
    return { 
      valid: false, 
      message: `Invalid unit: ${unit}. Valid units: ${validUnits.join(', ')}` 
    };
  }
  
  if (value < 0) {
    return { valid: false, message: 'Measurement cannot be negative' };
  }
  
  return { valid: true };
}

/**
 * Generic field validator
 */
export function validateField(value: unknown, rules: ValidationRule[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          errors.push(rule.message);
        }
        break;
        
      case 'range':
        if (typeof value === 'number') {
          if (rule.min !== undefined && value < rule.min) {
            errors.push(rule.message);
          }
          if (rule.max !== undefined && value > rule.max) {
            errors.push(rule.message);
          }
        }
        break;
        
      case 'pattern':
        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
          errors.push(rule.message);
        }
        break;
        
      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          errors.push(rule.message);
        }
        break;
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Auto-corrects common data entry errors
 */
export function autoCorrectData(data: Record<string, unknown>): Record<string, unknown> {
  const corrected = { ...data };
  
  // Trim whitespace from strings
  Object.keys(corrected).forEach(key => {
    if (typeof corrected[key] === 'string') {
      corrected[key] = corrected[key].trim();
    }
  });
  
  // Fix common coordinate formatting issues
  if (corrected.latitude) {
    corrected.latitude = parseFloat(String(corrected.latitude).replace(',', '.'));
  }
  if (corrected.longitude) {
    corrected.longitude = parseFloat(String(corrected.longitude).replace(',', '.'));
  }
  
  return corrected;
}
