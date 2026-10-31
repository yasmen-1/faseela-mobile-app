import { X, MapPin, Phone, Droplet, Clock, AlertCircle } from 'lucide-react';
import type { BloodRequest } from '../lib/types';
import { timeAgo } from '../lib/format';
import { BloodTypeBadge, UrgencyBadge } from '../components/Badges';

export function RequestDetailModal({
  request,
  onClose,
  onFulfill,
}: {
  request: BloodRequest;
  onClose: () => void;
  onFulfill: (id: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BloodTypeBadge type={request.bloodType} size="lg" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{request.patientName}</h2>
              <div className="mt-1 flex items-center gap-2">
                <UrgencyBadge urgency={request.urgency} />
                <span className="text-[11px] text-gray-400">{timeAgo(request.postedAt)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition active:scale-90"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <InfoRow icon={<Droplet size={15} />} label="Units Needed" value={`${request.unitsNeeded} unit${request.unitsNeeded > 1 ? 's' : ''}`} />
          <InfoRow icon={<MapPin size={15} />} label="Hospital" value={request.hospital} />
          <InfoRow icon={<MapPin size={15} />} label="Location" value={`${request.city} · ${request.distanceKm} km away`} />
          <InfoRow icon={<Phone size={15} />} label="Contact" value={request.contact} />
        </div>

        {request.note && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-3 text-amber-700">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <p className="text-xs">{request.note}</p>
          </div>
        )}

        <div className="mt-5 flex gap-2.5">
          <a
            href={`tel:${request.contact.replace(/\s/g, '')}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blood-600 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-95"
          >
            <Phone size={16} /> Call
          </a>
          {!request.fulfilled && (
            <button
              onClick={() => onFulfill(request.id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition active:scale-95"
            >
              <Clock size={16} /> Mark Fulfilled
            </button>
          )}
        </div>
        {request.fulfilled && (
          <p className="mt-3 text-center text-xs font-medium text-emerald-600">
            This request has been fulfilled. Thank you.
          </p>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-3.5 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blood-50 text-blood-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-gray-400">{label}</p>
        <p className="truncate text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
