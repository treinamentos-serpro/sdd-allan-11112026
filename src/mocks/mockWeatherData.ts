import type { WeatherData } from '../types/weather';

/**
 * Dados de exemplo para desenvolver a UI sem a API (São Paulo, 11/11/2026).
 * Valores em °C, no formato do contrato `WeatherData`. Remover quando a UI usar o service real.
 */
export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    country: 'Brasil',
    admin1: 'São Paulo',
    latitude: -23.5475,
    longitude: -46.63611,
  },
  timezone: 'America/Sao_Paulo',
  current: {
    temperatureC: 20,
    weatherCode: 3,
    observedAt: '2026-11-11T18:45',
  },
  days: [
    { date: '2026-11-11', weatherCode: 3, minC: 17.4, maxC: 26.1 },
    { date: '2026-11-12', weatherCode: 61, minC: 16.8, maxC: 23.5 },
    { date: '2026-11-13', weatherCode: 95, minC: 15.2, maxC: 21.9 },
    { date: '2026-11-14', weatherCode: 61, minC: 14.6, maxC: 22.3 },
    { date: '2026-11-15', weatherCode: 0, minC: 15.9, maxC: 27.8 },
  ],
  queriedAt: '2026-11-11T21:46:00.000Z',
};
