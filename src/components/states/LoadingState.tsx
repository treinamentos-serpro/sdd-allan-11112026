interface LoadingStateProps {
  /** Texto exibido e anunciado a leitores de tela. */
  label?: string;
}

export default function LoadingState({ label = 'Carregando…' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-glass backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 rounded-full border-2 border-white/30 border-t-accent-400 motion-safe:animate-spin"
      />
      <p className="text-base">{label}</p>
    </div>
  );
}
