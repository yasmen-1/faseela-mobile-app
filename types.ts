export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export type Urgency = 'Critical' | 'Urgent' | 'Standard';

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: BloodType;
  unitsNeeded: number;
  hospital: string;
  city: string;
  distanceKm: number;
  urgency: Urgency;
  postedAt: number;
  contact: string;
  note?: string;
  fulfilled: boolean;
}

export interface BloodUnit {
  type: BloodType;
  units: number;
}

export interface BloodBank {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  openUntil: string;
  phone: string;
  inStock: number;
}

export interface Donor {
  id: string;
  fullName: string;
  bloodType: BloodType;
  phone: string;
  email: string;
  city: string;
  dateOfBirth: string;
  weightKg: number;
  lastDonationDate: string | null;
  eligible: boolean;
  registeredAt: number;
}

export interface DonationRecord {
  id: string;
  date: string;
  location: string;
  units: number;
  type: BloodType;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export function monthsSince(iso: string | null): number {
  if (!iso) return Infinity;
  const diff = Date.now() - new Date(iso).getTime();
  return diff / (1000 * 60 * 60 * 24 * 30.44);
}

export function ageFromDob(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function checkEligibility(d: {
  age: number;
  weightKg: number;
  monthsSinceLast: number;
}): EligibilityResult {
  const reasons: string[] = [];
  if (d.age < 18) reasons.push('Must be at least 18 years old.');
  if (d.age > 65) reasons.push('Must be under 65 years old.');
  if (d.weightKg < 50) reasons.push('Weight must be at least 50 kg.');
  if (d.monthsSinceLast < 3) reasons.push('Must wait 3 months between donations.');
  return { eligible: reasons.length === 0, reasons };
}
