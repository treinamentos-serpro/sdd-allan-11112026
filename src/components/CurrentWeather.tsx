import { useId } from 'react';
import { formatObservedAt } from '../lib/dateTime';
import { formatTemperature } from '../lib/temperature';
import { weatherDescription, weatherIcon } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const headingId = useId();
  const location = [city.admin1, city.country].filter(Boolean).join(', ');

  return (
    <section
      aria-labelledby={headingId}
      className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md"
    >
      <h2 id={headingId} className="text-sm font-medium uppercase tracking-wide text-white/70">
        Clima atual
      </h2>
      <p className="mt-2 break-words text-2xl font-semibold text-white">{city.name}</p>
      <p className="break-words text-base text-white/70">{location}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span aria-hidden="true" className="text-5xl sm:text-6xl">
          {weatherIcon[current.weatherCode]}
        </span>
        <p className="[overflow-wrap:anywhere] text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          {formatTemperature(current.temperatureC, unit)}
        </p>
      </div>

      <p className="mt-2 break-words text-xl text-white">
        {weatherDescription[current.weatherCode]}
      </p>

      <p className="mt-4 [overflow-wrap:anywhere] text-sm text-white/70">
        Estimativa meteorológica · horário local da cidade:{' '}
        <time dateTime={current.observedAt}>{formatObservedAt(current.observedAt)}</time>
      </p>
    </section>
  );
}
