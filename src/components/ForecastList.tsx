import { useId } from 'react';
import { formatQueriedAt } from '../lib/dateTime';
import type { Unit, WeatherData } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: WeatherData['days'];
  unit: Unit;
  timezone: string;
  queriedAt: string;
}

export default function ForecastList({ days, unit, timezone, queriedAt }: ForecastListProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="w-full">
      <h2 id={headingId} className="text-lg font-semibold text-white">
        Previsão para 5 dias
      </h2>
      <p className="mt-1 [overflow-wrap:anywhere] text-sm text-white/70">
        Consulta realizada em{' '}
        <time dateTime={queriedAt}>{formatQueriedAt(queriedAt, timezone)}</time>
      </p>
      <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {days.map((day) => (
          <li key={day.date}>
            <ForecastCard day={day} unit={unit} />
          </li>
        ))}
      </ol>
    </section>
  );
}
