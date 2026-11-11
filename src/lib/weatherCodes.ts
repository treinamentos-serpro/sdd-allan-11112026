import type { WeatherCode } from '../types/weather';

/** Descrições em pt-BR dos códigos WMO que a Open-Meteo pode devolver. Mapa fechado. */
export const weatherDescription: Readonly<Record<WeatherCode, string>> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Nevoeiro',
  48: 'Nevoeiro com geada',
  51: 'Garoa fraca',
  53: 'Garoa moderada',
  55: 'Garoa forte',
  56: 'Garoa congelante fraca',
  57: 'Garoa congelante forte',
  61: 'Chuva fraca',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva congelante fraca',
  67: 'Chuva congelante forte',
  71: 'Neve fraca',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva fracas',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva fortes',
  85: 'Pancadas de neve fracas',
  86: 'Pancadas de neve fortes',
  95: 'Trovoada',
  96: 'Trovoada com granizo fraco',
  99: 'Trovoada com granizo forte',
};

/** Emoji decorativo por código. A condição sempre aparece também em texto (RNF-03). */
export const weatherIcon: Readonly<Record<WeatherCode, string>> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌦️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '🌨️',
  77: '❄️',
  80: '🌦️',
  81: '🌦️',
  82: '🌦️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

/** Código fora da tabela é inválido (RF-08). */
export function isKnownWeatherCode(code: number): boolean {
  return Object.hasOwn(weatherDescription, code);
}
