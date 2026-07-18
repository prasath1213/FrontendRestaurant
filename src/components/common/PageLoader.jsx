import Spinner from "./Spinner";

export default function PageLoader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-ink-600">
      <Spinner size="lg" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
