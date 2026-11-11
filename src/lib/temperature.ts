import type { Unit } from '../types/weather';

/** F = C × 9/5 + 32. Sempre parte do valor original em °C. */
export function toDisplayTemperature(celsius: number, unit: Unit): number {
  return unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius;
}

/**
 * Arredonda empates para longe de zero. Normaliza para 12 dígitos significativos antes e
 * depois de escalar, para que 1,35 e 1,005 não sejam afetados pelo erro binário. `-0` vira `0`.
 */
export function roundHalfAwayFromZero(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  const scaled = Number((Math.abs(Number(value.toPrecision(12))) * factor).toPrecision(12));
  const rounded = (Math.sign(value) * Math.round(scaled)) / factor;
  return rounded === 0 ? 0 : rounded;
}

/** Ex.: (20, 'fahrenheit') → '68,0 °F'; (-1.25, 'celsius') → '−1,3 °C' (sinal U+2212). */
export function formatTemperature(celsius: number, unit: Unit): string {
  const rounded = roundHalfAwayFromZero(toDisplayTemperature(celsius, unit), 1);
  const digits = Math.abs(rounded).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const sign = rounded < 0 ? '−' : '';
  return `${sign}${digits} °${unit === 'fahrenheit' ? 'F' : 'C'}`;
}
