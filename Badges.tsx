import type { BloodType, Urgency } from '../lib/types';

const urgencyStyles: Record<Urgency, string> = {
  Critical: 'bg-blood-100 text-blood-700 ring-blood-300',
  Urgent: 'bg-amber-100 text-amber-700 ring-amber-300',
  Standard: 'bg-sky-100 text-sky-700 ring-sky-300',
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${urgencyStyles[urgency]}`}
    >
      {urgency}
    </span>
  );
}

const typeColors: Record<BloodType, string> = {
  'A+': 'from-blood-500 to-blood-600',
  'A-': 'from-rose-500 to-rose-600',
  'B+': 'from-red-500 to-rose-500',
  'B-': 'from-pink-500 to-rose-500',
  'AB+': 'from-blood-600 to-rose-700',
  'AB-': 'from-rose-600 to-pink-600',
  'O+': 'from-blood-500 to-red-600',
  'O-': 'from-red-600 to-blood-700',
};

export function BloodTypeBadge({
  type,
  size = 'md',
}: {
  type: BloodType;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims =
    size === 'sm'
      ? 'h-9 w-9 text-sm'
      : size === 'lg'
        ? 'h-16 w-16 text-xl'
        : 'h-12 w-12 text-base';
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${typeColors[type]} font-bold text-white shadow-sm ${dims}`}
    >
      {type}
    </div>
  );
}
