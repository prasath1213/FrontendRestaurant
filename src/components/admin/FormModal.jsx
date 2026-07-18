import { FiX } from "react-icons/fi";

export default function FormModal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 px-4 py-6">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700" aria-label="Close">
            <FiX size={20} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
