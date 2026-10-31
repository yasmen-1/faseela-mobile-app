import { Droplet, MapPin, Phone, Clock, ChevronRight, PlusCircle } from 'lucide-react';
import type { BloodBank, BloodRequest, BloodUnit } from '../lib/types';
import { BloodTypeBadge, UrgencyBadge } from '../components/Badges';
import { timeAgo } from '../lib/format';

const stockLevel = (units: number) => {
  if (units <= 2) return { label: 'Critical', cls: 'text-blood-600 bg-blood-50' };
  if (units <= 6) return { label: 'Low', cls: 'text-amber-600 bg-amber-50' };
  return { label: 'Good', cls: 'text-emerald-600 bg-emerald-50' };
};

export function HomeScreen({
  requests,
  units,
  banks,
  onSelectRequest,
  onGoRequest,
}: {
  requests: BloodRequest[];
  units: BloodUnit[];
  banks: BloodBank[];
  onSelectRequest: (r: BloodRequest) => void;
  onGoRequest: () => void;
}) {
  const urgent = [...requests]
    .filter((r) => !r.fulfilled)
    .sort((a, b) => Number(a.urgency === 'Critical') !== Number(b.urgency === 'Critical') ? Number(b.urgency === 'Critical') - Number(a.urgency === 'Critical') : a.postedAt - b.postedAt)
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-4">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-blood-600 to-blood-800 px-5 pb-8 pt-6 text-white">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Droplet size={20} className="fill-white text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-none">Faseela</h1>
              <p className="text-[11px] text-white/70">فصيلة · Blood Bank</p>
            </div>
          </div>
          <p className="mt-5 text-2xl font-bold leading-tight">Every drop<br />saves a life.</p>
          <button
            onClick={onGoRequest}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blood-700 shadow-sm transition active:scale-95"
          >
            <PlusCircle size={16} /> Request Blood
          </button>
        </div>
      </header>

      {/* Inventory */}
      <section className="px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Blood Inventory</h2>
          <span className="text-[11px] font-medium text-gray-400">Units available</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {units.map((u) => {
            const lvl = stockLevel(u.units);
            return (
              <div
                key={u.type}
                className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-2.5 shadow-sm"
              >
                <BloodTypeBadge type={u.type} size="sm" />
                <span className="mt-1.5 text-lg font-bold text-gray-900">{u.units}</span>
                <span className={`mt-0.5 rounded-full px-1.5 text-[9px] font-semibold ${lvl.cls}`}>
                  {lvl.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Urgent requests */}
      <section className="px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Urgent Requests</h2>
          <span className="text-[11px] font-medium text-blood-600">{urgent.length} active</span>
        </div>
        <div className="space-y-2.5">
          {urgent.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRequest(r)}
              className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm transition active:scale-[0.99]"
            >
              <BloodTypeBadge type={r.bloodType} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-gray-900">{r.patientName}</p>
                  <UrgencyBadge urgency={r.urgency} />
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {r.hospital} · {r.unitsNeeded} unit{r.unitsNeeded > 1 ? 's' : ''}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="inline-flex items-center gap-0.5">
                    <MapPin size={11} /> {r.distanceKm} km
                  </span>
                  <span>·</span>
                  <span>{timeAgo(r.postedAt)}</span>
                </div>
              </div>
              <ChevronRight size={18} className="shrink-0 text-gray-300" />
            </button>
          ))}
        </div>
      </section>

      {/* Nearby banks */}
      <section className="px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Nearby Blood Banks</h2>
        </div>
        <div className="space-y-2.5">
          {banks.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blood-50">
                <Droplet size={20} className="text-blood-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{b.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-500">
                  <span className="inline-flex items-center gap-0.5">
                    <MapPin size={11} /> {b.distanceKm} km
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Clock size={11} /> {b.openUntil}
                  </span>
                  <span className="font-medium text-emerald-600">{b.inStock} units</span>
                </div>
              </div>
              <a
                href={`tel:${b.phone.replace(/\s/g, '')}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blood-50 text-blood-600 transition active:scale-90"
                aria-label={`Call ${b.name}`}
              >
                <Phone size={16} />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
