export default function IdleState() {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-glass backdrop-blur-md">
      <h2 className="text-lg font-semibold text-white">Busque uma cidade</h2>
      <p className="text-base text-white/70">
        Digite o nome de uma cidade para ver o clima atual e a previsão dos próximos 5 dias.
      </p>
    </div>
  );
}
