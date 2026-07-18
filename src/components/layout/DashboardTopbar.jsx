import { FiMenu } from "react-icons/fi";

export default function DashboardTopbar({ title, onMenuClick }) {
  return (
    <div className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-100 bg-ink-50/95 px-4 backdrop-blur lg:px-8">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100 lg:hidden"
        aria-label="Open menu"
      >
        <FiMenu size={20} />
      </button>
      <h1 className="font-display text-lg font-semibold text-ink-900">{title}</h1>
    </div>
  );
}
