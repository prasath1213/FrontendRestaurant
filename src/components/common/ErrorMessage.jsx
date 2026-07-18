export default function ErrorMessage({ message, onRetry, className = "" }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`flex flex-col items-start gap-3 rounded-xl border border-chili-100 bg-chili-50 px-4 py-3 text-sm text-chili-700 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline shrink-0 px-3 py-1.5 text-xs">
          Try again
        </button>
      )}
    </div>
  );
}
