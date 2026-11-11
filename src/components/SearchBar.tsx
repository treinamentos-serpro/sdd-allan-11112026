import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  /** Chamado com o termo já sem espaços nas pontas. Nunca é chamado com texto vazio. */
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [value, setValue] = useState('');
  const inputId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = value.trim();
    if (disabled || term === '') return;
    onSearch(term);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-glass backdrop-blur-md sm:flex-row"
    >
      <label htmlFor={inputId} className="sr-only">
        Buscar cidade
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder="Buscar cidade"
        autoComplete="off"
        enterKeyHint="search"
        className="min-h-11 w-full flex-1 rounded-xl border border-white/40 bg-night-900/60 px-4 text-base text-white placeholder:text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled}
        className="min-h-11 min-w-11 rounded-xl bg-accent-400 px-5 text-base font-medium text-night-900 transition-colors hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buscar
      </button>
    </form>
  );
}
