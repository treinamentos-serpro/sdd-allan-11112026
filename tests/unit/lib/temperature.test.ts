import { describe, expect, it } from 'vitest';
import {
  formatTemperature,
  roundHalfAwayFromZero,
  toDisplayTemperature,
} from '../../../src/lib/temperature';

describe('toDisplayTemperature', () => {
  it('mantém °C e converte para °F com F = C × 9/5 + 32', () => {
    expect(toDisplayTemperature(20, 'celsius')).toBe(20);
    expect(toDisplayTemperature(20, 'fahrenheit')).toBe(68);
    expect(toDisplayTemperature(-40, 'fahrenheit')).toBe(-40);
  });
});

describe('roundHalfAwayFromZero', () => {
  it('arredonda empates para longe de zero, nos dois sinais', () => {
    expect(roundHalfAwayFromZero(1.25, 1)).toBe(1.3);
    expect(roundHalfAwayFromZero(-1.25, 1)).toBe(-1.3);
  });

  it('não sofre com o erro binário de ponto flutuante', () => {
    expect(roundHalfAwayFromZero(1.35, 1)).toBe(1.4);
    expect(roundHalfAwayFromZero(1.005, 2)).toBe(1.01);
  });

  it('nunca devolve -0', () => {
    expect(Object.is(roundHalfAwayFromZero(-0.04, 1), 0)).toBe(true);
  });
});

describe('formatTemperature', () => {
  it('AC-03: exibe 20 °C com uma casa decimal e vírgula', () => {
    expect(formatTemperature(20, 'celsius')).toBe('20,0 °C');
  });

  it('AC-07: converte 20 °C para 68,0 °F', () => {
    expect(formatTemperature(20, 'fahrenheit')).toBe('68,0 °F');
  });

  it('AC-07: arredonda 1,25 e −1,25 °C para longe de zero, com sinal U+2212', () => {
    expect(formatTemperature(1.25, 'celsius')).toBe('1,3 °C');
    expect(formatTemperature(-1.25, 'celsius')).toBe('−1,3 °C');
  });

  it('AC-07: voltar à unidade inicial usa o original, não o valor arredondado', () => {
    const original = 1.25;

    expect(formatTemperature(original, 'fahrenheit')).toBe('34,3 °F');
    expect(formatTemperature(original, 'celsius')).toBe('1,3 °C');
  });

  it('RF-06: 1,35 °C vira 1,4 °C e −0,04 °C vira 0,0 °C, sem "−0,0"', () => {
    expect(formatTemperature(1.35, 'celsius')).toBe('1,4 °C');
    expect(formatTemperature(-0.04, 'celsius')).toBe('0,0 °C');
  });
});
