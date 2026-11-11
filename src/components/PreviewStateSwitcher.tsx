export type PreviewState = 'idle' | 'loading' | 'empty' | 'error' | 'success';

const STATES: readonly { value: PreviewState; label: string }[] = [
  { value: 'idle', label: 'Inicial' },
  { value: 'loading', label: 'Carregando' },
  { value: 'empty', label: 'Vazio' },
  { value: 'error', label: 'Erro' },
  { value: 'success', label: 'Sucesso' },
];

interface PreviewStateSwitcherProps {
  value: PreviewState;
  onChange: (state: PreviewState) => void;
}

/** Ferramenta de desenvolvimento para ver cada estado do `App` com o mock. Não vai para produção. */
export default function PreviewStateSwitcher({ value, onChange }: PreviewStateSwitcherProps) {
  return (
    <aside
      aria-label="Pré-visualizar estados (somente desenvolvimento)"
      className="mx-auto flex flex-wrap items-center justify-center gap-2 px-4 py-3 text-sm text-white/70"
    >
      <span>Estados (dev):</span>
      {STATES.map((state) => (
        <button
          key={state.value}
          type="button"
          aria-pressed={state.value === value}
          onClick={() => onChange(state.value)}
          className={`min-h-11 min-w-11 rounded-lg border border-white/10 px-3 ${
            state.value === value ? 'bg-accent-400 text-night-900' : 'bg-white/5 text-white'
          }`}
        >
          {state.label}
        </button>
      ))}
    </aside>
  );
}
