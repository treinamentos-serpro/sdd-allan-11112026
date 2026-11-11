import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../../src/components/ForecastList';
import { mockWeatherData } from '../../../src/mocks/mockWeatherData';
import type { Unit } from '../../../src/types/weather';

function renderList(unit: Unit = 'celsius') {
  const { days, timezone, queriedAt } = mockWeatherData;
  return render(<ForecastList days={days} unit={unit} timezone={timezone} queriedAt={queriedAt} />);
}

describe('ForecastList', () => {
  it('AC-04: renderiza exatamente 5 dias em uma lista, de 11/11 a 15/11, sem deslocamento', () => {
    renderList();

    const items = within(screen.getByRole('list')).getAllByRole('listitem');

    expect(items).toHaveLength(5);
    const labels = items.map((item) => within(item).getByText(/\d{2}\/\d{2}/).textContent);
    expect(labels).toEqual([
      'qua., 11/11',
      'qui., 12/11',
      'sex., 13/11',
      'sáb., 14/11',
      'dom., 15/11',
    ]);
  });

  it('RF-04: mostra o horário da consulta no fuso da cidade, identificado', () => {
    renderList();

    expect(screen.getByText('11/11/2026, 18:46 (America/Sao_Paulo)')).toHaveAttribute(
      'datetime',
      '2026-11-11T21:46:00.000Z',
    );
    expect(screen.getByText(/Consulta realizada em/)).toBeInTheDocument();
  });

  it('expõe uma região nomeada pelo título', () => {
    renderList();

    expect(screen.getByRole('region', { name: 'Previsão para 5 dias' })).toBeInTheDocument();
  });

  it('AC-07: aplica a unidade a todas as máximas e mínimas', () => {
    renderList('fahrenheit');

    expect(screen.getAllByText(/Máxima/)).toHaveLength(5);
    expect(screen.getAllByText(/Mínima/)).toHaveLength(5);
    expect(screen.queryByText(/°C/)).toBeNull();
    // 17,4 °C → 63,3 °F; 26,1 °C → 79,0 °F
    expect(screen.getAllByText(/Mínima/)[0].parentElement).toHaveTextContent('Mínima 63,3 °F');
  });
});
