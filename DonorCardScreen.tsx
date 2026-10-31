import { QRCodeCanvas } from 'qrcode.react';
import { Droplet, Download, ShieldCheck, Calendar, MapPin } from 'lucide-react';
import type { DonationRecord, Donor } from '../lib/types';
import { fmtDate } from '../lib/format';
import { BloodTypeBadge } from '../components/Badges';

export function DonorCardScreen({
  donor,
  donations,
}: {
  donor: Donor | null;
  donations: DonationRecord[];
}) {
  if (!donor) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blood-50">
          <Droplet size={28} className="text-blood-400" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-gray-900">No Donor Card Yet</h2>
        <p className="mt-1.5 max-w-xs text-sm text-gray-500">
          Register as a donor in the Donate tab to generate your digital donor card with a QR code.
        </p>
      </div>
    );
  }

  const cardData = JSON.stringify({
    id: donor.id,
    name: donor.fullName,
    bloodType: donor.bloodType,
    eligible: donor.eligible,
  });

  const totalUnits = donations.reduce((s, d) => s + d.units, 0);

  const download = () => {
    const canvas = document.getElementById('donor-qr') as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `faseela-donor-${donor.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="px-4 pb-6 pt-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blood-50">
          <Droplet size={20} className="text-blood-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Digital Donor Card</h1>
          <p className="text-xs text-gray-500">Show this at any blood bank</p>
        </div>
      </div>

      {/* The card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blood-600 to-blood-800 p-5 text-white shadow-xl">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-4 h-28 w-28 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Droplet size={16} className="fill-white text-white" />
                <span className="text-sm font-extrabold tracking-wide">FASEELA</span>
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-wider text-white/60">Donor</p>
              <h2 className="text-xl font-bold leading-tight">{donor.fullName}</h2>
              <p className="mt-0.5 text-xs text-white/70">{donor.city}</p>
            </div>
            <BloodTypeBadge type={donor.bloodType} size="lg" />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Donor ID</p>
              <p className="font-mono text-xs text-white/90">{donor.id}</p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5">
                <ShieldCheck size={11} />
                <span className="text-[10px] font-medium">
                  {donor.eligible ? 'Eligible' : 'Not Eligible'}
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-white p-1.5">
              <QRCodeCanvas
                id="donor-qr"
                value={cardData}
                size={84}
                level="M"
                includeMargin={false}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={download}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition active:scale-95"
      >
        <Download size={16} /> Download QR Code
      </button>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-blood-600">{donations.length}</p>
          <p className="mt-0.5 text-[11px] font-medium text-gray-500">Total Donations</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-blood-600">{totalUnits}</p>
          <p className="mt-0.5 text-[11px] font-medium text-gray-500">Units Donated</p>
        </div>
      </div>

      {/* Donation history */}
      <section className="mt-6">
        <h3 className="mb-2 text-sm font-bold text-gray-900">Donation History</h3>
        {donations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <Calendar size={24} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No donations recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {donations
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blood-50">
                    <Droplet size={18} className="text-blood-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                      <MapPin size={12} className="text-gray-400" />
                      <span className="truncate">{d.location}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">{fmtDate(d.date)}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-blood-50 px-2 py-0.5 text-xs font-semibold text-blood-600">
                      {d.type}
                    </span>
                    <p className="mt-0.5 text-[11px] text-gray-400">{d.units} unit{d.units > 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
