import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Droplet } from 'lucide-react';
import { BLOOD_TYPES, type BloodRequest, type BloodType, type Urgency } from '../lib/types';
import { uid } from '../lib/format';
import { BloodTypeBadge } from '../components/Badges';

const empty = {
  patientName: '',
  bloodType: 'O-' as BloodType,
  unitsNeeded: 1,
  hospital: '',
  city: '',
  distanceKm: 1,
  urgency: 'Urgent' as Urgency,
  contact: '',
  note: '',
};

export function RequestScreen({ onSubmit }: { onSubmit: (r: BloodRequest) => void }) {
  const [form, setForm] = useState({ ...empty });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientName.trim()) e.patientName = 'Patient name is required';
    if (!form.hospital.trim()) e.hospital = 'Hospital is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.contact.trim()) e.contact = 'Contact number is required';
    else if (form.contact.replace(/\D/g, '').length < 7) e.contact = 'Enter a valid phone';
    if (form.unitsNeeded < 1) e.unitsNeeded = 'At least 1 unit';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const req: BloodRequest = {
      id: uid('req'),
      patientName: form.patientName.trim(),
      bloodType: form.bloodType,
      unitsNeeded: form.unitsNeeded,
      hospital: form.hospital.trim(),
      city: form.city.trim(),
      distanceKm: form.distanceKm,
      urgency: form.urgency,
      contact: form.contact.trim(),
      note: form.note.trim() || undefined,
      postedAt: Date.now(),
      fulfilled: false,
    };
    onSubmit(req);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-gray-900">Request Submitted</h2>
        <p className="mt-2 text-sm text-gray-500">
          Your blood request for <span className="font-semibold">{form.patientName}</span> has been
          posted. Nearby donors and blood banks have been notified.
        </p>
        <button
          onClick={() => {
            setForm({ ...empty });
            setDone(false);
          }}
          className="mt-8 w-full max-w-xs rounded-xl bg-blood-600 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-95"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6 pt-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood-50">
          <Droplet size={20} className="text-blood-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Request Blood</h1>
          <p className="text-xs text-gray-500">Post an urgent blood need</p>
        </div>
      </div>

      <div className="space-y-4">
        <Field label="Patient Name" error={errors.patientName}>
          <input
            value={form.patientName}
            onChange={(e) => set('patientName', e.target.value)}
            placeholder="e.g. Ahmed Al-Rashid"
            className={inputCls(errors.patientName)}
          />
        </Field>

        <Field label="Blood Type Needed">
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
          <Field label="Units Needed" error={errors.unitsNeeded}>
            <input
              type="number"
              min={1}
              max={20}
              value={form.unitsNeeded}
              onChange={(e) => set('unitsNeeded', Number(e.target.value) || 0)}
              className={inputCls(errors.unitsNeeded)}
            />
          </Field>
          <Field label="Urgency">
            <select
              value={form.urgency}
              onChange={(e) => set('urgency', e.target.value as Urgency)}
              className={inputCls()}
            >
              <option>Critical</option>
              <option>Urgent</option>
              <option>Standard</option>
            </select>
          </Field>
        </div>

        <Field label="Hospital" error={errors.hospital}>
          <input
            value={form.hospital}
            onChange={(e) => set('hospital', e.target.value)}
            placeholder="Hospital name"
            className={inputCls(errors.hospital)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="City" error={errors.city}>
            <input
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder="City"
              className={inputCls(errors.city)}
            />
          </Field>
          <Field label="Distance (km)">
            <input
              type="number"
              min={0}
              step={0.1}
              value={form.distanceKm}
              onChange={(e) => set('distanceKm', Number(e.target.value) || 0)}
              className={inputCls()}
            />
          </Field>
        </div>

        <Field label="Contact Number" error={errors.contact}>
          <input
            value={form.contact}
            onChange={(e) => set('contact', e.target.value)}
            placeholder="+966 ..."
            className={inputCls(errors.contact)}
          />
        </Field>

        <Field label="Note (optional)">
          <textarea
            value={form.note}
            onChange={(e) => set('note', e.target.value)}
            rows={2}
            placeholder="Any additional details"
            className={`${inputCls()} resize-none`}
          />
        </Field>

        <button
          onClick={submit}
          className="w-full rounded-xl bg-blood-600 py-3.5 text-sm font-semibold text-white shadow-sm transition active:scale-95"
        >
          Submit Blood Request
        </button>
        <p className="text-center text-[11px] text-gray-400">
          Your request will be visible to nearby donors immediately.
        </p>
      </div>
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
