// src/app/userProfile.model.ts
import type { Timestamp, FieldValue } from 'firebase/firestore';
import { Category } from './shared/products';


// Un champ horodaté Firestore peut être un Timestamp (en lecture) OU un FieldValue (serverTimestamp() en écriture)
export type FireTime = Timestamp | FieldValue;

export type UserPreferences = {
  regionId?: string;
  taxRate?: number;
  favoriteCategories?: Category[];
  newsletter?: boolean;
};

export type UserProfile = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt: FireTime;   // ⬅️ accepte Timestamp OU FieldValue
  updatedAt: FireTime;   // ⬅️ idem
  prefs?: UserPreferences;
};
