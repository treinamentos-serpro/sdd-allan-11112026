interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex w-full flex-col items-center gap-4 rounded-2xl border border-red-300/30 bg-white/5 p-6 text-center shadow-glass backdrop-blur-md"
    >
      <p className="break-words text-base text-red-200">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 min-w-11 rounded-xl bg-accent-400 px-5 text-base font-medium text-night-900 transition-colors hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Tentar novamente
      </button>
    </div>
  );
}
