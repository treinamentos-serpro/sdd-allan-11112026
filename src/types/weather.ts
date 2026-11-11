/** Unidade de exibição. Afeta só a apresentação; os dados são guardados em °C. */
export type Unit = 'celsius' | 'fahrenheit';

/** Código WMO (`weather_code`). Valores fora da tabela em `lib/weatherCodes.ts` são inválidos. */
export type WeatherCode = number;

/** Cidade do geocoding (`/v1/search`, campo `results[]`). */
export interface City {
  /** `id`: identificador do provedor; desempate final da ordenação. */
  id: number;
  /** `name`: grafia da fonte, sem tradução própria. */
  name: string;
  /** `country`: obrigatório; sem ele o item é inválido. */
  country: string;
  /** `admin1`: estado/província; opcional, pode não existir. */
  admin1?: string;
  /** `latitude`: finito, entre -90 e 90. */
  latitude: number;
  /** `longitude`: finito, entre -180 e 180. */
  longitude: number;
}

/** Estimativa corrente (`current` no `/v1/forecast`). */
export interface CurrentWeather {
  /** `current.temperature_2m`: °C, finito. */
  temperatureC: number;
  /** `current.weather_code`: condição atual. */
  weatherCode: WeatherCode;
  /** `current.time`: horário do dado no fuso da cidade ('YYYY-MM-DDTHH:mm'). */
  observedAt: string;
}

/** Um dia da previsão (`daily`, índice i dos arrays). */
export interface ForecastDay {
  /** `daily.time[i]`: 'YYYY-MM-DD' no calendário local da cidade. */
  date: string;
  /** `daily.weather_code[i]`: condição do dia. */
  weatherCode: WeatherCode;
  /** `daily.temperature_2m_min[i]`: °C, finito, `minC <= maxC`. */
  minC: number;
  /** `daily.temperature_2m_max[i]`: °C, finito. */
  maxC: number;
}

/** Consulta íntegra da cidade: atual + exatamente 5 dias. Sem sucesso parcial. */
export interface WeatherData {
  /** Cidade selecionada que originou a consulta. */
  city: City;
  /** `timezone`: IANA válido, devolvido com `timezone=auto`. */
  timezone: string;
  current: CurrentWeather;
  /** Hoje + 4 dias. */
  days: readonly [ForecastDay, ForecastDay, ForecastDay, ForecastDay, ForecastDay];
  /** ISO (UTC) em que a resposta foi aceita pelo cliente; não vem da API. */
  queriedAt: string;
}
