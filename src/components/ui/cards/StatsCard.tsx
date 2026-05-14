export default function StatCard({
  label,
  count,
  icon,
  gradient,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-24 h-20 bg-linear-to-br ${gradient} shadow-lg rounded-xl border border-white/10 mx-0.5`}
    >
      <div className="text-lg font-black mb-0.5 flex items-center gap-1">
        {count}
        {icon}
      </div>
      <span className="text-[13px] text-white/90">{label}</span>
    </div>
  );
}
