import { useState } from 'react';
import { CalendarCheck, Droplet, ShieldCheck, UserPlus } from 'lucide-react';
import {
  BLOOD_TYPES,
  type BloodType,
  type Donor,
  checkEligibility,
  ageFromDob,
  monthsSince,
} from '../lib/types';
import { uid } from '../lib/format';

interface Props {
  existing: Donor | null;
  onRegister: (d: Donor) => void;
}

const blank = {
  fullName: '',
  bloodType: 'O+' as BloodType,
  phone: '',
  email: '',
  city: '',
  dateOfBirth: '',
  weightKg: 70,
  lastDonationDate: '',
};

export function DonateScreen({ existing, onRegister }: Props) {
  const [form, setForm] = useState(
    existing
      ? {
          fullName: existing.fullName,
          bloodType: existing.bloodType,
          phone: existing.phone,
          email: existing.email,
          city: existing.city,
          dateOfBirth: existing.dateOfBirth,
          weightKg: existing.weightKg,
          lastDonationDate: existing.lastDonationDate ?? '',
        }
      : { ...blank },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const eligibility = checkEligibility({
    age: form.dateOfBirth ? ageFromDob(form.dateOfBirth) : 0,
    weightKg: form.weightKg,
    monthsSinceLast: monthsSince(form.lastDonationDate || null),
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    else if (ageFromDob(form.dateOfBirth) < 16) e.dateOfBirth = 'Enter a valid date';
    if (!form.city.trim()) e.city = 'City is required';
    if (form.weightKg < 30) e.weightKg = 'Enter a valid weight';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const register = () => {
    if (!validate()) return;
    const donor: Donor = {
      id: existing?.id ?? uid('donor'),
      fullName: form.fullName.trim(),
      bloodType: form.bloodType,
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      dateOfBirth: form.dateOfBirth,
      weightKg: form.weightKg,
      lastDonationDate: form.lastDonationDate || null,
      eligible: eligibility.eligible,
      registeredAt: existing?.registeredAt ?? Date.now(),
    };
    onRegister(donor);
    setChecked(true);
  };

  return (
    <div className="px-4 pb-6 pt-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood-50">
          <UserPlus size={20} className="text-blood-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {existing ? 'Donor Profile' : 'Become a Donor'}
          </h1>
          <p className="text-xs text-gray-500">Register & check eligibility</p>
        </div>
      </div>

      <div className="space-y-4">
        <Field label="Full Name" error={errors.fullName}>
          <input
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            placeholder="Your full name"
            className={inputCls(errors.fullName)}
          />
        </Field>

        <Field label="Blood Type">
          <div className="flex flex-wrap gap-2">
            {BLOOD_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set('bloodType', t)}
                className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                  form.bloodType === t
                    ? 'border-blood-500 bg-blood-50 text-blood-700'
                    : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone" error={errors.phone}>
            <input
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+966 ..."
              className={inputCls(errors.phone)}
            />
          </Field>
          <Field label="City" error={errors.city}>
            <input
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder="City"
              className={inputCls(errors.city)}
            />
          </Field>
        </div>

        <Field label="Email (optional)">
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@email.com"
            className={inputCls()}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date of Birth" error={errors.dateOfBirth}>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => set('dateOfBirth', e.target.value)}
              className={inputCls(errors.dateOfBirth)}
            />
          </Field>
          <Field label="Weight (kg)" error={errors.weightKg}>
            <input
              type="number"
              min={30}
              max={200}
              value={form.weightKg}
              onChange={(e) => set('weightKg', Number(e.target.value) || 0)}
              className={inputCls(errors.weightKg)}
            />
          </Field>
        </div>

        <Field label="Last Donation Date (optional)">
          <input
            type="date"
            value={form.lastDonationDate}
            onChange={(e) => set('lastDonationDate', e.target.value)}
            className={inputCls()}
          />
        </Field>

        {/* Eligibility preview */}
        <div
          className={`rounded-2xl border p-3.5 ${
            eligibility.eligible
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-amber-200 bg-amber-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={18}
              className={eligibility.eligible ? 'text-emerald-600' : 'text-amber-600'}
            />
            <p
              className={`text-sm font-semibold ${
                eligibility.eligible ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {eligibility.eligible
                ? 'You appear eligible to donate'
                : 'Eligibility issues to review'}
            </p>
          </div>
          {eligibility.reasons.length > 0 && (
            <ul className="mt-2 space-y-1">
              {eligibility.reasons.map((r) => (
                <li key={r} className="flex items-start gap-1.5 text-xs text-amber-700">
                  <span className="mt-0.5">•</span> {r}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={register}
          className="w-full rounded-xl bg-blood-600 py-3.5 text-sm font-semibold text-white shadow-sm transition active:scale-95"
        >
          {existing ? 'Update Donor Profile' : 'Register as Donor'}
        </button>
      </div>

      {checked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CalendarCheck size={32} className="text-emerald-500" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-gray-900">
              {eligibility.eligible ? 'Registration Complete!' : 'Profile Saved'}
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              {eligibility.eligible
                ? "You're now a registered donor. Your digital donor card is ready."
                : 'We saved your profile. Once eligibility criteria are met, your card will activate.'}
            </p>
            <button
              onClick={() => setChecked(false)}
              className="mt-5 w-full rounded-xl bg-blood-600 py-3 text-sm font-semibold text-white transition active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function inputCls(err?: string) {
  return `w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-blood-500 focus:ring-2 focus:ring-blood-100 ${
    err ? 'border-blood-400' : 'border-gray-200'
  }`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px] font-medium text-blood-600">{error}</p>}
    </div>
  );
}
