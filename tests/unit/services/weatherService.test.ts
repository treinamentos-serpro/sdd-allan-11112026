import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../../src/services/weatherService';
import type { City } from '../../../src/types/weather';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);
const city: City = {
  id: 1,
  name: 'Recife',
  country: 'Brasil',
  latitude: -8.05,
  longitude: -34.9,
};

function validForecast() {
  return {
    timezone: 'America/Recife',
    current: { time: '2026-11-11T18:45', temperature_2m: 23.4, weather_code: 3 },
    daily: {
      time: ['2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'],
      weather_code: [3, 61, 80, 3, 2],
      temperature_2m_min: [20, 21, 19, 20, 22],
      temperature_2m_max: [27, 28, 26, 27, 29],
    },
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  fetchMock.mockReset();
});

describe('searchCities', () => {
  it('retorna [] para input vazio sem chamar a rede', async () => {
    expect(await searchCities('')).toEqual([]);
    expect(await searchCities('   ')).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('usa encodeURIComponent no nome', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    await searchCities('São Paulo');
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo');
  });

  it('mapeia results para City[]', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 1,
            name: 'Recife',
            country: 'Brasil',
            admin1: 'Pernambuco',
            latitude: -8.05,
            longitude: -34.9,
            timezone: 'x',
          },
        ],
      }),
    });
    expect(await searchCities('Recife')).toEqual([
      {
        id: 1,
        name: 'Recife',
        country: 'Brasil',
        admin1: 'Pernambuco',
        latitude: -8.05,
        longitude: -34.9,
      },
    ]);
  });

  it('retorna [] quando a resposta não tem results', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    expect(await searchCities('xyzxyz')).toEqual([]);
  });

  it.each([
    ['results nulo', { results: null }],
    ['cidade sem país', { results: [{ id: 1, name: 'Recife', latitude: -8, longitude: -34 }] }],
    ['coordenada fora da faixa', { results: [{ ...city, latitude: 91 }] }],
  ])('rejeita estrutura inválida de geocoding: %s', async (_description, body) => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => body });
    await expect(searchCities('Recife')).rejects.toThrow();
  });

  it('lança WeatherServiceError em resposta não-ok', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    await expect(searchCities('Recife')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('converte falha de rede em WeatherServiceError', async () => {
    fetchMock.mockRejectedValue(new TypeError('network failure'));
    await expect(searchCities('Recife')).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha de rede.',
    });
  });

  it('aborta após 10 segundos e limpa o timer no finally', async () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    fetchMock.mockImplementation(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        }),
    );

    const request = searchCities('Recife');
    const requestAssertion = expect(request).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'A requisição demorou demais.',
    });
    await vi.advanceTimersByTimeAsync(10_000);

    await requestAssertion;
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    expect(clearTimeoutSpy).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('getWeather', () => {
  it('consulta o forecast e mapeia current e os cinco dias', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        timezone: 'America/Recife',
        current: {
          time: '2026-11-11T18:45',
          temperature_2m: 23.4,
          weather_code: 3,
        },
        daily: {
          time: ['2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'],
          weather_code: [3, 61, 80, 3, 2],
          temperature_2m_min: [20, 21, 19, 20, 22],
          temperature_2m_max: [27, 28, 26, 27, 29],
        },
      }),
    });

    const result = await getWeather(city);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toBe(
      'https://api.open-meteo.com/v1/forecast?latitude=-8.05&longitude=-34.9' +
        '&current=temperature_2m,weather_code' +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
        '&forecast_days=5&timezone=auto&temperature_unit=celsius',
    );
    expect(result.city).toBe(city);
    expect(result.current).toEqual({
      observedAt: '2026-11-11T18:45',
      temperatureC: 23.4,
      weatherCode: 3,
    });
    expect(result.days).toHaveLength(5);
    expect(result.days[0]).toEqual({
      date: '2026-11-11',
      weatherCode: 3,
      minC: 20,
      maxC: 27,
    });
    expect(result.timezone).toBe('America/Recife');
    expect(Number.isNaN(Date.parse(result.queriedAt))).toBe(false);
  });

  it.each([
    ['current', { daily: {} }],
    ['daily', { current: {} }],
  ])('lança WeatherServiceError quando %s está ausente', async (_missing, body) => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => body,
    });

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('informa falha HTTP da consulta meteorológica', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 });

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      status: 503,
      message: 'Falha na consulta meteorológica (HTTP 503)',
    });
  });

  it('informa falha de rede da consulta meteorológica', async () => {
    fetchMock.mockRejectedValue(new TypeError('network failure'));

    await expect(getWeather(city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      message: 'Falha de rede.',
    });
  });

  it.each([
    [
      'temperatura atual ausente',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, current: { ...body.current, temperature_2m: undefined } };
      },
    ],
    [
      'temperatura atual não finita',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, current: { ...body.current, temperature_2m: Number.NaN } };
      },
    ],
    [
      'condição atual desconhecida',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, current: { ...body.current, weather_code: 999 } };
      },
    ],
    [
      'horário atual inválido',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, current: { ...body.current, time: 'inválido' } };
      },
    ],
    [
      'fuso ausente',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, timezone: undefined };
      },
    ],
    [
      'fuso inválido',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, timezone: 'Marte/Olympus' };
      },
    ],
    [
      'quatro dias',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, daily: { ...body.daily, time: body.daily.time.slice(0, 4) } };
      },
    ],
    [
      'mínima não finita',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, daily: { ...body.daily, temperature_2m_min: [20, 21, NaN, 20, 22] } };
      },
    ],
    [
      'mínima maior que máxima',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, daily: { ...body.daily, temperature_2m_min: [28, 21, 19, 20, 22] } };
      },
    ],
    [
      'condição diária desconhecida',
      (body: ReturnType<typeof validForecast>) => {
        return { ...body, daily: { ...body.daily, weather_code: [3, 61, 999, 3, 2] } };
      },
    ],
    [
      'datas repetidas',
      (body: ReturnType<typeof validForecast>) => {
        return {
          ...body,
          daily: {
            ...body.daily,
            time: ['2026-11-11', '2026-11-12', '2026-11-12', '2026-11-14', '2026-11-15'],
          },
        };
      },
    ],
    [
      'datas não consecutivas',
      (body: ReturnType<typeof validForecast>) => {
        return {
          ...body,
          daily: {
            ...body.daily,
            time: ['2026-11-11', '2026-11-12', '2026-11-14', '2026-11-15', '2026-11-16'],
          },
        };
      },
    ],
  ])('RF-08: rejeita resposta meteorológica inválida: %s', async (_description, makeBody) => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => makeBody(validForecast()) });

    await expect(getWeather(city)).rejects.toThrow();
  });

  it('AC-04: rejeita janela de previsão que não começa no dia local da consulta', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-12T03:30:00Z'));
    fetchMock.mockResolvedValue({ ok: true, json: async () => validForecast() });

    await expect(getWeather(city)).rejects.toThrow();
  });
});
