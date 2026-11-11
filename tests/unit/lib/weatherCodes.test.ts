import { describe, expect, it } from 'vitest';
import { isKnownWeatherCode, weatherDescription, weatherIcon } from '../../../src/lib/weatherCodes';

describe('weatherCodes', () => {
  it('descreve os códigos de referência em pt-BR', () => {
    expect(weatherDescription[0]).toBe('Céu limpo');
    expect(weatherDescription[3]).toBe('Nublado');
    expect(weatherDescription[61]).toBe('Chuva fraca');
    expect(weatherDescription[95]).toBe('Trovoada');
  });

  it('tem descrição e ícone não vazios para todo código da tabela', () => {
    const codes = Object.keys(weatherDescription);

    expect(codes.length).toBeGreaterThan(0);
    for (const code of codes) {
      expect(weatherDescription[Number(code)].trim()).not.toBe('');
      expect(weatherIcon[Number(code)]?.trim()).toBeTruthy();
    }
  });

  it('mantém ícones e descrições com exatamente os mesmos códigos', () => {
    expect(Object.keys(weatherIcon)).toEqual(Object.keys(weatherDescription));
  });

  it('reconhece códigos da tabela', () => {
    expect(isKnownWeatherCode(0)).toBe(true);
    expect(isKnownWeatherCode(99)).toBe(true);
  });

  it('rejeita códigos fora da tabela', () => {
    for (const code of [-1, 1.5, 4, 999, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(isKnownWeatherCode(code)).toBe(false);
    }
  });
});
