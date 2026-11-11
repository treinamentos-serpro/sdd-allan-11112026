import { useRef, useState } from 'react';
import AttributionFooter from './components/AttributionFooter';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import PreviewStateSwitcher, { type PreviewState } from './components/PreviewStateSwitcher';
import SearchBar from './components/SearchBar';
import UnitToggle from './components/UnitToggle';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import IdleState from './components/states/IdleState';
import LoadingState from './components/states/LoadingState';
import { mockWeatherData } from './mocks/mockWeatherData';
import type { Unit } from './types/weather';

export default function App() {
  // `unit` é só estado de UI: os dados ficam em °C e cada componente converte ao renderizar.
  const [unit, setUnit] = useState<Unit>('celsius');
  // Com o mock, o estado é escolhido à mão. Será substituído pelo `view` de `useWeatherApp`.
  const [view, setView] = useState<PreviewState>('idle');
  const mainRef = useRef<HTMLElement>(null);
  const { city, current, days, timezone, queriedAt } = mockWeatherData;

  // Região ativa sempre montada: só ela anuncia o resultado e a troca de unidade (RNF-03).
  const announcement =
    view === 'success'
      ? `Clima de ${city.name} exibido em ${unit === 'celsius' ? 'Celsius' : 'Fahrenheit'}.`
      : '';

  // O botão "Tentar novamente" sai da tela; sem mover o foco, ele iria para o <body>.
  function retry() {
    setView('success');
    mainRef.current?.focus();
  }

  function renderContent() {
    switch (view) {
      case 'idle':
        return <IdleState />;
      case 'loading':
        return <LoadingState label="Carregando clima…" />;
      case 'empty':
        return <EmptyState />;
      case 'error':
        return (
          <ErrorState
            message="Não foi possível consultar o clima. Verifique sua conexão e tente novamente."
            onRetry={retry}
          />
        );
      case 'success':
        return (
          <div className="flex flex-col gap-8">
            <CurrentWeather city={city} current={current} unit={unit} />
            <ForecastList days={days} unit={unit} timezone={timezone} queriedAt={queriedAt} />
          </div>
        );
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-night-900 to-night-800 font-sans text-white antialiased">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 md:flex-row md:items-center">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <span aria-hidden="true" className="text-2xl">
              ⛅
            </span>
            Weather App
          </h1>
          <div className="w-full md:flex-1">
            <SearchBar onSearch={() => setView('success')} />
          </div>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
      </header>

      <main
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 focus:outline-none sm:px-6"
      >
        {renderContent()}
      </main>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {import.meta.env.DEV && <PreviewStateSwitcher value={view} onChange={setView} />}
      <AttributionFooter />
    </div>
  );
}
