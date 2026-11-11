import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import { mockWeatherData } from '../../../src/mocks/mockWeatherData';
import type { Unit } from '../../../src/types/weather';

function renderCard(unit: Unit = 'celsius') {
  const { city, current } = mockWeatherData;
  return render(<CurrentWeather city={city} current={current} unit={unit} />);
}

describe('CurrentWeather', () => {
  it('AC-03: identifica a cidade, mostra 20,0 °C, a condição e a estimativa com o horário local', () => {
    renderCard();

    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('São Paulo, Brasil')).toBeInTheDocument();
    expect(screen.getByText('20,0 °C')).toBeInTheDocument();
    expect(screen.getByText('Nublado')).toBeInTheDocument();
    expect(screen.getByText(/Estimativa meteorológica/)).toBeInTheDocument();
    expect(screen.getByText('11/11/2026, 18:45')).toHaveAttribute('datetime', '2026-11-11T18:45');
  });

  it('AC-07: mostra a temperatura na unidade atual a partir do valor original', () => {
    const { rerender } = renderCard('fahrenheit');
    expect(screen.getByText('68,0 °F')).toBeInTheDocument();

    rerender(
      <CurrentWeather
        city={mockWeatherData.city}
        current={mockWeatherData.current}
        unit="celsius"
      />,
    );
    expect(screen.getByText('20,0 °C')).toBeInTheDocument();
  });

  it('expõe uma região nomeada pelo título "Clima atual"', () => {
    renderCard();

    expect(screen.getByRole('heading', { level: 2, name: 'Clima atual' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Clima atual' })).toBeInTheDocument();
  });

  it('esconde o emoji dos leitores de tela e mantém a condição em texto', () => {
    const { container } = renderCard();

    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toHaveTextContent('☁️');
    expect(screen.getByText('Nublado')).not.toHaveAttribute('aria-hidden');
  });

  it('omite o estado quando a cidade não tem admin1', () => {
    const { city, current } = mockWeatherData;
    const { admin1: _admin1, ...cityWithoutState } = city;

    render(<CurrentWeather city={cityWithoutState} current={current} unit="celsius" />);

    expect(screen.getByText('Brasil')).toBeInTheDocument();
  });

  it('RF-06: não exibe umidade, vento, precipitação nem pressão', () => {
    renderCard();

    expect(screen.queryByText(/umidade|vento|precipita|pressão/i)).toBeNull();
  });
});
