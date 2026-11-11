export default function AttributionFooter() {
  return (
    <footer className="border-t border-white/10 px-4 py-4 text-center text-sm text-white/70 sm:px-6">
      <p>
        Dados meteorológicos por{' '}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded text-accent-400 underline underline-offset-2 hover:text-white"
        >
          Open-Meteo.com
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </p>
    </footer>
  );
}
