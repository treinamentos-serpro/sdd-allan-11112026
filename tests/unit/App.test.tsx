import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { mockWeatherData } from '../../src/mocks/mockWeatherData';
import { getWeather, searchCities } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const searchCitiesMock = vi.mocked(searchCities);
const getWeatherMock = vi.mocked(getWeather);

function setup() {
  return { user: userEvent.setup(), ...render(<App />) };
}

afterEach(() => {
  vi.resetAllMocks();
});

describe('App', () => {
  it('monta cabeçalho, busca, unidade e atribuição', () => {
    setup();

    const header = screen.getByRole('banner');
    expect(within(header).getByRole('heading', { level: 1, name: /Weather App/ })).toBeVisible();
    expect(within(header).getByRole('search')).toBeVisible();
    expect(within(header).getByRole('group', { name: 'Unidade de temperatura' })).toBeVisible();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Open-Meteo.com');
  });

  it('começa em Celsius e renderiza idle', () => {
    setup();

    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'Busque uma cidade' })).toBeVisible();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renderiza loading e success conforme o hook conclui a busca', async () => {
    let resolveSearch!: (cities: City[]) => void;
    let resolveWeather!: (data: typeof mockWeatherData) => void;
    searchCitiesMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve;
        }),
    );
    getWeatherMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveWeather = resolve;
        }),
    );
    const { user } = setup();

    await user.type(screen.getByRole('searchbox'), 'São Paulo{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Carregando clima…');

    await act(async () => resolveSearch([mockWeatherData.city]));
    expect(screen.getByRole('status')).toHaveTextContent('Carregando clima…');

    await act(async () => resolveWeather(mockWeatherData));
    expect(await screen.findByText('20,0 °C')).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: 'Clima atual' })).toBeVisible();
  });

  it('renderiza empty quando não há cidades', async () => {
    searchCitiesMock.mockResolvedValue([]);
    const { user } = setup();

    await user.type(screen.getByRole('searchbox'), 'Atlantis{Enter}');

    expect(await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
    expect(getWeatherMock).not.toHaveBeenCalled();
  });

  it('renderiza erro e ErrorState chama retry da última operação', async () => {
    searchCitiesMock.mockRejectedValueOnce(new Error('Falha de rede.'));
    searchCitiesMock.mockResolvedValueOnce([mockWeatherData.city]);
    getWeatherMock.mockResolvedValue(mockWeatherData);
    const { user } = setup();

    await user.type(screen.getByRole('searchbox'), 'São Paulo{Enter}');
    expect(await screen.findByRole('alert')).toHaveTextContent('Falha de rede.');

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('20,0 °C')).toBeVisible();
    expect(searchCitiesMock).toHaveBeenNthCalledWith(2, 'São Paulo');
  });

  it('mantém unit como estado de UI e não refaz a consulta ao alternar', async () => {
    searchCitiesMock.mockResolvedValue([mockWeatherData.city]);
    getWeatherMock.mockResolvedValue(mockWeatherData);
    const { user } = setup();

    await user.type(screen.getByRole('searchbox'), 'São Paulo{Enter}');
    expect(await screen.findByText('20,0 °C')).toBeVisible();

    await user.click(screen.getByRole('button', { name: /Fahrenheit/ }));
    expect(screen.getByText('68,0 °F')).toBeVisible();
    expect(searchCitiesMock).toHaveBeenCalledTimes(1);
    expect(getWeatherMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Celsius/ }));
    expect(screen.getByText('20,0 °C')).toBeVisible();
  });

  it('AC-07: converte todas as temperaturas e restaura os valores originais após alternar', async () => {
    searchCitiesMock.mockResolvedValue([mockWeatherData.city]);
    getWeatherMock.mockResolvedValue({
      ...mockWeatherData,
      current: { ...mockWeatherData.current, temperatureC: 20 },
      days: [
        { date: '2026-11-11', weatherCode: 0, minC: -1.25, maxC: 1.25 },
        { date: '2026-11-12', weatherCode: 0, minC: 0, maxC: 10 },
        { date: '2026-11-13', weatherCode: 0, minC: -40, maxC: 0 },
        { date: '2026-11-14', weatherCode: 0, minC: 5, maxC: 20 },
        { date: '2026-11-15', weatherCode: 0, minC: 1.35, maxC: 100 },
      ],
    });
    const { user } = setup();

    await user.type(screen.getByRole('searchbox'), 'São Paulo{Enter}');
    const current = await screen.findByRole('region', { name: 'Clima atual' });
    const forecast = screen.getByRole('region', { name: 'Previsão para 5 dias' });
    const items = within(forecast).getAllByRole('listitem');
    expect(current).toHaveTextContent('20,0 °C');
    expect(items[0]).toHaveTextContent('Mínima −1,3 °C');
    expect(items[0]).toHaveTextContent('Máxima 1,3 °C');

    await user.click(screen.getByRole('button', { name: /Fahrenheit/ }));
    expect(current).toHaveTextContent('68,0 °F');
    const expected = [
      ['29,8 °F', '34,3 °F'],
      ['32,0 °F', '50,0 °F'],
      ['−40,0 °F', '32,0 °F'],
      ['41,0 °F', '68,0 °F'],
      ['34,4 °F', '212,0 °F'],
    ];
    items.forEach((item, index) => {
      expect(item).toHaveTextContent(`Mínima ${expected[index][0]}`);
      expect(item).toHaveTextContent(`Máxima ${expected[index][1]}`);
    });

    await user.click(screen.getByRole('button', { name: /Celsius/ }));
    expect(current).toHaveTextContent('20,0 °C');
    expect(items[0]).toHaveTextContent('Mínima −1,3 °C');
    expect(items[0]).toHaveTextContent('Máxima 1,3 °C');
    expect(items[4]).toHaveTextContent('Mínima 1,4 °C');
    expect(searchCitiesMock).toHaveBeenCalledTimes(1);
    expect(getWeatherMock).toHaveBeenCalledTimes(1);
  });
});
