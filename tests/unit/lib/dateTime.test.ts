import { describe, expect, it } from 'vitest';
import {
  formatForecastDate,
  formatObservedAt,
  formatQueriedAt,
  localDateKey,
} from '../../../src/lib/dateTime';

describe('localDateKey', () => {
  it('AC-04: usa o calendário local da cidade, não o do instante UTC', () => {
    const now = new Date('2026-11-12T02:30:00Z');

    expect(localDateKey('America/Sao_Paulo', now)).toBe('2026-11-11');
    expect(localDateKey('Asia/Tokyo', now)).toBe('2026-11-12');
  });

  it('muda de dia exatamente à meia-noite local', () => {
    expect(localDateKey('America/Sao_Paulo', new Date('2026-11-12T02:59:59Z'))).toBe('2026-11-11');
    expect(localDateKey('America/Sao_Paulo', new Date('2026-11-12T03:00:00Z'))).toBe('2026-11-12');
  });

  it('rejeita fuso inválido', () => {
    expect(() => localDateKey('Marte/Olympus', new Date())).toThrow(RangeError);
  });
});

describe('formatObservedAt', () => {
  it('AC-03: formata o horário local sem converter de fuso', () => {
    expect(formatObservedAt('2026-11-11T18:45')).toBe('11/11/2026, 18:45');
  });

  it('usa 00:00 e não 24:00 à meia-noite', () => {
    expect(formatObservedAt('2026-11-12T00:00')).toBe('12/11/2026, 00:00');
  });

  it('rejeita formato inválido e datas que o Date corrigiria sozinho', () => {
    for (const value of [
      '2026-11-11',
      '2026-11-11T18:45:00Z',
      '2026-13-01T10:00',
      '2026-11-31T10:00',
    ]) {
      expect(() => formatObservedAt(value)).toThrow(RangeError);
    }
  });
});

describe('formatForecastDate', () => {
  it('AC-04: devolve dia da semana e dia/mês do calendário local, sem deslocar o dia', () => {
    expect(formatForecastDate('2026-11-11')).toBe('qua., 11/11');
    expect(formatForecastDate('2026-11-15')).toBe('dom., 15/11');
  });

  it('rejeita formato inválido e datas que o Date corrigiria sozinho', () => {
    for (const value of ['11/11/2026', '2026-11-11T18:45', '2026-13-01', '2026-02-30']) {
      expect(() => formatForecastDate(value)).toThrow(RangeError);
    }
  });
});

describe('formatQueriedAt', () => {
  it('RNF-07: converte o instante UTC para o fuso da cidade e o identifica', () => {
    expect(formatQueriedAt('2026-11-11T21:46:00.000Z', 'America/Sao_Paulo')).toBe(
      '11/11/2026, 18:46 (America/Sao_Paulo)',
    );
  });

  it('rejeita instante inválido', () => {
    expect(() => formatQueriedAt('ontem', 'America/Sao_Paulo')).toThrow(RangeError);
  });
});
