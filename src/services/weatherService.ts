import { isKnownWeatherCode } from '../lib/weatherCodes';
import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

export class WeatherServiceError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'WeatherServiceError';
    this.status = status;
  }
}

interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  timezone?: string;
  current?: {
    time?: string;
    temperature_2m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_min?: number[];
    temperature_2m_max?: number[];
  };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === 'AbortError'
    ) {
      throw new WeatherServiceError('A requisição demorou demais.');
    }

    throw new WeatherServiceError('Falha de rede.');
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function searchCities(name: string): Promise<City[]> {
  const term = name.trim();
  if (term === '') return [];

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(term)}&count=10&language=pt&format=json`;
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError(
      `Falha na busca de cidades (HTTP ${response.status})`,
      response.status,
    );
  }

  const data = (await response.json()) as GeocodingResponse;

  return (data.results ?? []).map(({ id, name, country, admin1, latitude, longitude }) => ({
    id,
    name,
    country,
    admin1,
    latitude,
    longitude,
  }));
}

export async function getWeather(city: City): Promise<WeatherData> {
  const url =
    `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}` +
    '&current=temperature_2m,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
    '&forecast_days=5&timezone=auto&temperature_unit=celsius';
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError(
      `Falha na consulta meteorológica (HTTP ${response.status})`,
      response.status,
    );
  }

  const data = (await response.json()) as ForecastResponse;
  const { current, daily, timezone } = data;
  if (!current || !daily) {
    throw new WeatherServiceError('Resposta meteorológica incompleta');
  }

  const currentWeatherCode = current.weather_code;
  const {
    time: dates,
    weather_code: weatherCodes,
    temperature_2m_min: minima,
    temperature_2m_max: maxima,
  } = daily;
  if (
    typeof timezone !== 'string' ||
    typeof current.time !== 'string' ||
    !isFiniteNumber(current.temperature_2m) ||
    !isFiniteNumber(currentWeatherCode) ||
    !isKnownWeatherCode(currentWeatherCode) ||
    !dates ||
    !weatherCodes ||
    !minima ||
    !maxima ||
    dates.length !== 5 ||
    weatherCodes.length !== 5 ||
    minima.length !== 5 ||
    maxima.length !== 5
  ) {
    throw new WeatherServiceError('Resposta meteorológica inválida');
  }

  const getForecastDay = (index: number): ForecastDay => {
    const date = dates[index];
    const weatherCode = weatherCodes[index];
    const minC = minima[index];
    const maxC = maxima[index];

    if (
      typeof date !== 'string' ||
      !isKnownWeatherCode(weatherCode) ||
      !isFiniteNumber(minC) ||
      !isFiniteNumber(maxC) ||
      minC > maxC
    ) {
      throw new WeatherServiceError('Resposta meteorológica inválida');
    }

    return { date, weatherCode, minC, maxC };
  };
  const forecastDays: [ForecastDay, ForecastDay, ForecastDay, ForecastDay, ForecastDay] = [
    getForecastDay(0),
    getForecastDay(1),
    getForecastDay(2),
    getForecastDay(3),
    getForecastDay(4),
  ];

  const currentWeather: CurrentWeather = {
    observedAt: current.time,
    temperatureC: current.temperature_2m,
    weatherCode: currentWeatherCode,
  };

  return {
    city,
    timezone,
    current: currentWeather,
    days: forecastDays,
    queriedAt: new Date().toISOString(),
  };
}
