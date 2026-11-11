import { formatForecastDate } from '../lib/dateTime';
import { formatTemperature } from '../lib/temperature';
import { weatherDescription, weatherIcon } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  return (
    <article className="flex h-full flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-glass backdrop-blur-md">
      <time
        dateTime={day.date}
        className="[overflow-wrap:anywhere] text-sm font-medium capitalize text-white/70"
      >
        {formatForecastDate(day.date)}
      </time>
      <span aria-hidden="true" className="text-4xl">
        {weatherIcon[day.weatherCode]}
      </span>
      <p className="break-words text-sm text-white">{weatherDescription[day.weatherCode]}</p>
      <p className="break-words text-base font-semibold text-white">
        <span className="font-normal text-white/70">Máxima</span>{' '}
        {formatTemperature(day.maxC, unit)}
      </p>
      <p className="break-words text-base text-white">
        <span className="text-white/70">Mínima</span> {formatTemperature(day.minC, unit)}
      </p>
    </article>
  );
}
