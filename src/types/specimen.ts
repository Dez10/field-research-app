export interface Specimen {
  id: string;
  specimenNumber: string;
  qrCode?: string;
  
  // Basic Info
  commonName?: string;
  scientificName?: string;
  description?: string;
  
  // Location Data
  latitude?: number;
  longitude?: number;
  altitude?: number;
  locationDescription?: string;
  
  // Environmental Data
  habitat?: string;
  slope?: string;
  aspect?: string;
  soilType?: string;
  
  // Measurements
  height?: number;
  diameter?: number;
  measurements?: Record<string, number>;
  units?: string;
  
  // Media
  photos?: string[];
  
  // Metadata
  collectedBy: string;
  collectedDate: Date;
  modifiedDate: Date;
  notes?: string;
  tags?: string[];
  
  // Chain of Custody
  chainOfCustody?: ChainOfCustodyEntry[];
  
  // Sync Status
  syncStatus: 'pending' | 'synced' | 'error';
  lastSyncDate?: Date;
}

export interface ChainOfCustodyEntry {
  id: string;
  timestamp: Date;
  action: 'collected' | 'transferred' | 'processed' | 'stored' | 'analyzed';
  person: string;
  location?: string;
  notes?: string;
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'range' | 'pattern' | 'custom';
  message: string;
  validator?: (value: unknown) => boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
}

export interface FieldSafetyCheckpoint {
  id: string;
  timestamp: Date;
  location?: { latitude: number; longitude: number };
  status: 'ok' | 'alert' | 'emergency';
  notes?: string;
  userId: string;
}
