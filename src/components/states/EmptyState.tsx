export default function EmptyState() {
  return (
    <div
      role="status"
      className="flex w-full flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-glass backdrop-blur-md"
    >
      <h2 className="text-lg font-semibold text-white">Nenhuma cidade encontrada</h2>
      <p className="text-base text-white/70">Confira a grafia ou tente buscar por outro nome.</p>
    </div>
  );
}
