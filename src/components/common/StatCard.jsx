export default function StatCard({ icon, label, value, accent = "bg-chili-50 text-chili-600" }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm text-ink-600">{label}</p>
        <p className="font-display text-2xl font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}
