import { Droplet, LogOut, ShieldCheck, Trash2, User } from 'lucide-react';
import type { BloodRequest, Donor, DonationRecord } from '../lib/types';
import { fmtDate } from '../lib/format';
import { BloodTypeBadge } from '../components/Badges';

export function ProfileScreen({
  donor,
  requests,
  donations,
  onSignOut,
  onResetData,
}: {
  donor: Donor | null;
  requests: BloodRequest[];
  donations: DonationRecord[];
  onSignOut: () => void;
  onResetData: () => void;
}) {
  const myRequests = requests.length;
  const totalUnits = donations.reduce((s, d) => s + d.units, 0);

  return (
    <div className="px-4 pb-6 pt-6">
      {/* Profile header */}
      <div className="flex flex-col items-center rounded-3xl bg-gradient-to-br from-blood-600 to-blood-800 p-6 text-center text-white shadow-lg">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur">
          {donor ? (
            <span className="text-2xl font-bold">{donor.fullName.charAt(0)}</span>
          ) : (
            <User size={32} />
          )}
        </div>
        <h1 className="mt-3 text-lg font-bold">{donor ? donor.fullName : 'Guest User'}</h1>
        {donor && (
          <div className="mt-1 flex items-center gap-2">
            <BloodTypeBadge type={donor.bloodType} size="sm" />
            {donor.eligible && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium">
                <ShieldCheck size={11} /> Eligible
              </span>
            )}
          </div>
        )}
        {donor && <p className="mt-1.5 text-xs text-white/70">{donor.city} · {donor.phone}</p>}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <Stat label="Requests" value={myRequests} />
        <Stat label="Donations" value={donor ? donations.length : 0} />
        <Stat label="Units" value={donor ? totalUnits : 0} />
      </div>

      {/* Details */}
      <section className="mt-5">
        <h2 className="mb-2 text-sm font-bold text-gray-900">Account Details</h2>
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <Row label="Name" value={donor?.fullName ?? '—'} />
          <Row label="Blood Type" value={donor?.bloodType ?? '—'} />
          <Row label="Phone" value={donor?.phone ?? '—'} />
          <Row label="Email" value={donor?.email || '—'} />
          <Row label="City" value={donor?.city ?? '—'} />
          <Row label="Date of Birth" value={donor ? fmtDate(donor.dateOfBirth) : '—'} />
          <Row
            label="Registered"
            value={donor ? fmtDate(new Date(donor.registeredAt).toISOString()) : '—'}
          />
        </div>
      </section>

      {/* My requests */}
      {myRequests > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-sm font-bold text-gray-900">My Blood Requests</h2>
          <div className="space-y-2">
            {requests
              .slice()
              .sort((a, b) => b.postedAt - a.postedAt)
              .map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <BloodTypeBadge type={r.bloodType} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{r.patientName}</p>
                    <p className="text-xs text-gray-500">
                      {r.hospital} · {fmtDate(new Date(r.postedAt).toISOString())}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      r.fulfilled
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {r.fulfilled ? 'Fulfilled' : 'Active'}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="mt-6 space-y-2.5">
        <button
          onClick={onSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition active:scale-95"
        >
          <LogOut size={16} /> {donor ? 'Sign Out' : 'Sign In'}
        </button>
        <button
          onClick={onResetData}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-blood-100 bg-blood-50 py-3 text-sm font-semibold text-blood-600 transition active:scale-95"
        >
          <Trash2 size={16} /> Reset App Data
        </button>
      </div>

      <p className="mt-5 flex items-center justify-center gap-1 text-center text-[11px] text-gray-400">
        <Droplet size={11} className="fill-blood-200 text-blood-200" />
        Faseela · فصيلة Blood Bank · Assignment 3
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm">
      <p className="text-xl font-bold text-blood-600">{value}</p>
      <p className="mt-0.5 text-[10px] font-medium text-gray-500">{label}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="max-w-[60%] truncate text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
