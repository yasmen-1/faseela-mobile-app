import { useState } from 'react';
import { BottomNav, type Tab } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { RequestScreen } from './screens/RequestScreen';
import { DonateScreen } from './screens/DonateScreen';
import { DonorCardScreen } from './screens/DonorCardScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RequestDetailModal } from './components/RequestDetailModal';
import { useLocalStorage } from './lib/useLocalStorage';
import {
  SEED_BANKS,
  SEED_DONATIONS,
  SEED_REQUESTS,
  SEED_BLOOD_UNITS,
} from './lib/seed';
import type { BloodRequest, BloodUnit, Donor, DonationRecord } from './lib/types';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [selected, setSelected] = useState<BloodRequest | null>(null);

  const [requests, setRequests] = useLocalStorage<BloodRequest[]>(
    'faseela.requests',
    SEED_REQUESTS,
  );
  const [units, setUnits] = useLocalStorage<BloodUnit[]>('faseela.units', SEED_BLOOD_UNITS);
  const [donor, setDonor] = useLocalStorage<Donor | null>('faseela.donor', null);
  const [donations] = useLocalStorage<DonationRecord[]>(
    'faseela.donations',
    SEED_DONATIONS,
  );

  const submitRequest = (r: BloodRequest) => {
    setRequests((prev) => [r, ...prev]);
    setUnitsForType(r.bloodType, r.unitsNeeded);
  };

  const setUnitsForType = (type: BloodRequest['bloodType'], used: number) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.type === type ? { ...u, units: Math.max(0, u.units - used) } : u,
      ),
    );
  };

  const registerDonor = (d: Donor) => setDonor(d);

  const fulfill = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, fulfilled: true } : r)));
    setSelected((s) => (s ? { ...s, fulfilled: true } : s));
  };

  const resetData = () => {
    if (!window.confirm('Reset all app data? This restores the demo content.')) return;
    localStorage.removeItem('faseela.requests');
    localStorage.removeItem('faseela.units');
    localStorage.removeItem('faseela.donor');
    localStorage.removeItem('faseela.donations');
    window.location.reload();
  };

  const signOut = () => setTab('profile');

  const banks = SEED_BANKS;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-gray-50 font-sans text-gray-900">
      <main className="pb-24">
        {tab === 'home' && (
          <HomeScreen
            requests={requests}
            units={units}
            banks={banks}
            onSelectRequest={(r) => setSelected(r)}
            onGoRequest={() => setTab('request')}
          />
        )}
        {tab === 'request' && <RequestScreen onSubmit={submitRequest} />}
        {tab === 'donate' && (
          <DonateScreen existing={donor} onRegister={registerDonor} />
        )}
        {tab === 'card' && <DonorCardScreen donor={donor} donations={donations} />}
        {tab === 'profile' && (
          <ProfileScreen
            donor={donor}
            requests={requests}
            donations={donations}
            onSignOut={signOut}
            onResetData={resetData}
          />
        )}
      </main>

      <BottomNav active={tab} onChange={setTab} />

      {selected && (
        <RequestDetailModal
          request={selected}
          onClose={() => setSelected(null)}
          onFulfill={fulfill}
        />
      )}
    </div>
  );
}
