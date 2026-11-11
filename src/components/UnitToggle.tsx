import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const OPTIONS: readonly { unit: Unit; symbol: string; label: string }[] = [
  { unit: 'celsius', symbol: '°C', label: 'Celsius' },
  { unit: 'fahrenheit', symbol: '°F', label: 'Fahrenheit' },
];

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md"
    >
      {OPTIONS.map((option) => {
        const pressed = option.unit === unit;
        return (
          <button
            key={option.unit}
            type="button"
            aria-pressed={pressed}
            onClick={() => {
              if (!pressed) onChange(option.unit);
            }}
            className={`min-h-11 min-w-11 rounded-lg px-4 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              pressed ? 'bg-accent-400 text-night-900' : 'text-white hover:bg-white/10'
            }`}
          >
            {option.symbol} <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
