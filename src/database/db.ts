import Dexie, { type Table } from 'dexie';
import type { Specimen, FieldSafetyCheckpoint } from '../types/specimen';

export class FieldResearchDB extends Dexie {
  specimens!: Table<Specimen, string>;
  safetyCheckpoints!: Table<FieldSafetyCheckpoint, string>;

  constructor() {
    super('FieldResearchDB');
    
    this.version(1).stores({
      specimens: 'id, specimenNumber, collectedDate, syncStatus, scientificName, commonName',
      safetyCheckpoints: 'id, timestamp, status, userId'
    });
  }
}

export const db = new FieldResearchDB();
