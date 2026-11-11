import { useCallback, useEffect, useRef, useState } from 'react';
import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

type LastOperation = { type: 'search'; name: string } | { type: 'selectCity'; city: City };

export interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  search(name: string): Promise<void>;
  selectCity(city: City): Promise<void>;
  retry(): Promise<void>;
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const requestId = useRef(0);
  const mounted = useRef(true);
  const lastOperation = useRef<LastOperation | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestId.current += 1;
    };
  }, []);

  const runSearch = useCallback(async (name: string): Promise<void> => {
    const id = ++requestId.current;
    setQuery(name);
    setStatus('loading');
    setData(null);
    setCities([]);
    setError(null);

    try {
      const results = await searchCities(name);
      if (!mounted.current || requestId.current !== id) return;

      setCities(results);
      if (results.length === 0) {
        setStatus('empty');
        return;
      }

      const weather = await getWeather(results[0]);
      if (!mounted.current || requestId.current !== id) return;
      setData(weather);
      setStatus('success');
    } catch (cause) {
      if (!mounted.current || requestId.current !== id) return;
      setError(cause instanceof Error ? cause.message : 'Falha inesperada.');
      setStatus('error');
    }
  }, []);

  const runSelection = useCallback(async (city: City): Promise<void> => {
    const id = ++requestId.current;
    setStatus('loading');
    setData(null);
    setError(null);

    try {
      const weather = await getWeather(city);
      if (!mounted.current || requestId.current !== id) return;
      setData(weather);
      setStatus('success');
    } catch (cause) {
      if (!mounted.current || requestId.current !== id) return;
      setError(cause instanceof Error ? cause.message : 'Falha inesperada.');
      setStatus('error');
    }
  }, []);

  const search = useCallback(
    async (name: string): Promise<void> => {
      const term = name.trim();
      lastOperation.current = { type: 'search', name: term };
      await runSearch(term);
    },
    [runSearch],
  );

  const selectCity = useCallback(
    async (city: City): Promise<void> => {
      lastOperation.current = { type: 'selectCity', city };
      await runSelection(city);
    },
    [runSelection],
  );

  const retry = useCallback(async (): Promise<void> => {
    const operation = lastOperation.current;
    if (!operation) return;

    if (operation.type === 'search') {
      await runSearch(operation.name);
    } else {
      await runSelection(operation.city);
    }
  }, [runSearch, runSelection]);

  return { status, data, cities, error, query, search, selectCity, retry };
}
