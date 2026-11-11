import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeather, searchCities } from '../../../src/services/weatherService';
import { useWeather } from '../../../src/hooks/useWeather';
import type { City, WeatherData } from '../../../src/types/weather';

vi.mock('../../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const city: City = {
  id: 1,
  name: 'Recife',
  country: 'Brasil',
  latitude: -8.05,
  longitude: -34.9,
};

const weather: WeatherData = {
  city,
  timezone: 'America/Recife',
  current: { temperatureC: 25, weatherCode: 3, observedAt: '2026-11-11T12:00' },
  days: [
    { date: '2026-11-11', weatherCode: 3, minC: 20, maxC: 28 },
    { date: '2026-11-12', weatherCode: 3, minC: 20, maxC: 28 },
    { date: '2026-11-13', weatherCode: 3, minC: 20, maxC: 28 },
    { date: '2026-11-14', weatherCode: 3, minC: 20, maxC: 28 },
    { date: '2026-11-15', weatherCode: 3, minC: 20, maxC: 28 },
  ],
  queriedAt: '2026-11-11T15:00:00.000Z',
};

const searchCitiesMock = vi.mocked(searchCities);
const getWeatherMock = vi.mocked(getWeather);

afterEach(() => {
  vi.resetAllMocks();
});

describe('useWeather', () => {
  it('inicia idle e busca clima da primeira cidade encontrada', async () => {
    searchCitiesMock.mockResolvedValue([city]);
    getWeatherMock.mockResolvedValue(weather);
    const { result } = renderHook(() => useWeather());

    expect(result.current.status).toBe('idle');

    await act(async () => {
      await result.current.search('  Recife  ');
    });

    expect(searchCitiesMock).toHaveBeenCalledWith('Recife');
    expect(getWeatherMock).toHaveBeenCalledWith(city);
    expect(result.current).toMatchObject({
      status: 'success',
      data: weather,
      cities: [city],
      error: null,
      query: 'Recife',
    });
  });

  it('define empty quando a busca não encontra cidades', async () => {
    searchCitiesMock.mockResolvedValue([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Atlantis');
    });

    expect(result.current.status).toBe('empty');
    expect(result.current.cities).toEqual([]);
    expect(result.current.data).toBeNull();
    expect(getWeatherMock).not.toHaveBeenCalled();
  });

  it('seleciona uma cidade e retry repete essa última operação', async () => {
    getWeatherMock.mockRejectedValueOnce(new Error('Falha de rede.'));
    getWeatherMock.mockResolvedValueOnce(weather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.selectCity(city);
    });

    expect(result.current).toMatchObject({ status: 'error', error: 'Falha de rede.' });

    await act(async () => {
      await result.current.retry();
    });

    expect(getWeatherMock).toHaveBeenNthCalledWith(2, city);
    expect(result.current).toMatchObject({ status: 'success', data: weather });
  });

  it('retry refaz a busca anterior e carrega o primeiro resultado', async () => {
    searchCitiesMock.mockRejectedValueOnce(new Error('Falha de rede.'));
    searchCitiesMock.mockResolvedValueOnce([city]);
    getWeatherMock.mockResolvedValue(weather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Recife');
    });
    await act(async () => {
      await result.current.retry();
    });

    expect(searchCitiesMock).toHaveBeenNthCalledWith(2, 'Recife');
    expect(getWeatherMock).toHaveBeenCalledWith(city);
    expect(result.current.status).toBe('success');
  });
});
