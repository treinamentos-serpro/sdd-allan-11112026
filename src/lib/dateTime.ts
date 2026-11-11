const OBSERVED_AT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
};

/** Data civil 'YYYY-MM-DD' no calendário local do fuso IANA. `now` é sempre parâmetro. */
export function localDateKey(timezone: string, now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

/**
 * `observedAt` ('YYYY-MM-DDTHH:mm') já está no fuso da cidade, então é formatado como está,
 * sem conversão de fuso. Ex.: '2026-11-11T18:45' → '11/11/2026, 18:45'.
 */
export function formatObservedAt(observedAt: string): string {
  const match = OBSERVED_AT.exec(observedAt);
  if (!match) throw new RangeError(`observedAt inválido: ${observedAt}`);
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  const instant = new Date(Date.UTC(year, month - 1, day, hour, minute));
  // Rejeita datas que o Date "corrige" sozinho (ex.: mês 13, hora 25).
  if (instant.toISOString().slice(0, 16) !== observedAt) {
    throw new RangeError(`observedAt inválido: ${observedAt}`);
  }
  return new Intl.DateTimeFormat('pt-BR', { ...DATE_TIME_OPTIONS, timeZone: 'UTC' }).format(
    instant,
  );
}

/**
 * Rótulo de um dia da previsão ('YYYY-MM-DD', calendário local da cidade), ex.: 'qua., 11/11'.
 * Formata em UTC para o dia civil não deslocar com o fuso do navegador.
 */
export function formatForecastDate(date: string): string {
  const match = DATE_KEY.exec(date);
  if (!match) throw new RangeError(`date inválida: ${date}`);
  const [year, month, day] = match.slice(1).map(Number);
  const instant = new Date(Date.UTC(year, month - 1, day));
  if (instant.toISOString().slice(0, 10) !== date) throw new RangeError(`date inválida: ${date}`);
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(instant);
}

/** `queriedAt` (ISO UTC) no fuso da cidade, com o fuso identificado. */
export function formatQueriedAt(queriedAt: string, timezone: string): string {
  const instant = new Date(queriedAt);
  if (Number.isNaN(instant.getTime())) throw new RangeError(`queriedAt inválido: ${queriedAt}`);
  const text = new Intl.DateTimeFormat('pt-BR', {
    ...DATE_TIME_OPTIONS,
    timeZone: timezone,
  }).format(instant);
  return `${text} (${timezone})`;
}
