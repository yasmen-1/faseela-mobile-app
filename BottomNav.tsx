import { Droplet, Home, IdCard, PlusCircle, User } from 'lucide-react';

export type Tab = 'home' | 'request' | 'donate' | 'card' | 'profile';

const tabs: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'request', label: 'Request', Icon: PlusCircle },
  { id: 'donate', label: 'Donate', Icon: Droplet },
  { id: 'card', label: 'Card', Icon: IdCard },
  { id: 'profile', label: 'Profile', Icon: User },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-gray-200 bg-white/95 backdrop-blur-lg safe-bottom">
      <div className="flex items-stretch justify-between px-2">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = id === active;
          const isCenter = id === 'donate';
          if (isCenter) {
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className="relative -top-3 flex flex-1 flex-col items-center"
                aria-label={label}
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform ${
                    isActive
                      ? 'bg-blood-600 scale-105 text-white'
                      : 'bg-blood-500 text-white hover:scale-105'
                  }`}
                >
                  <Icon size={26} />
                </span>
                <span
                  className={`mt-0.5 text-[10px] font-medium ${isActive ? 'text-blood-600' : 'text-gray-500'}`}
                >
                  {label}
                </span>
              </button>
            );
          }
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5"
              aria-label={label}
            >
              <Icon
                size={22}
                className={isActive ? 'text-blood-600' : 'text-gray-400'}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span
                className={`text-[10px] font-medium ${isActive ? 'text-blood-600' : 'text-gray-500'}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
