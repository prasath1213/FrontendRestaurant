export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink-200 bg-white px-6 py-14 text-center">
      {icon && <div className="text-4xl text-ink-400">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-600">{description}</p>}
      {action}
    </div>
  );
}
