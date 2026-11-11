import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastCard from '../../../src/components/ForecastCard';
import type { ForecastDay, Unit } from '../../../src/types/weather';

const day: ForecastDay = { date: '2026-11-12', weatherCode: 61, minC: -1.25, maxC: 20 };

function renderCard(unit: Unit = 'celsius') {
  return render(<ForecastCard day={day} unit={unit} />);
}

describe('ForecastCard', () => {
  it('AC-04: mostra o rótulo do dia, a condição em texto e máxima e mínima', () => {
    renderCard();

    expect(screen.getByText('qui., 12/11')).toHaveAttribute('datetime', '2026-11-12');
    expect(screen.getByText('Chuva fraca')).toBeInTheDocument();
    expect(screen.getByText(/Máxima/).parentElement).toHaveTextContent('Máxima 20,0 °C');
    expect(screen.getByText(/Mínima/).parentElement).toHaveTextContent('Mínima −1,3 °C');
  });

  it('AC-07: converte máxima e mínima para a unidade atual a partir dos originais', () => {
    renderCard('fahrenheit');

    expect(screen.getByText(/Máxima/).parentElement).toHaveTextContent('Máxima 68,0 °F');
    expect(screen.getByText(/Mínima/).parentElement).toHaveTextContent('Mínima 29,8 °F');
  });

  it('esconde o emoji dos leitores de tela', () => {
    const { container } = renderCard();

    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('🌧️');
  });

  it('RF-06: não exibe probabilidade de chuva, umidade, vento nem pressão', () => {
    renderCard();

    expect(screen.queryByText(/chuva:|probabilidade|%|umidade|vento|pressão/i)).toBeNull();
  });
});
