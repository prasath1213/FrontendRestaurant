export default function DataTable({
  columns,
  rows = [],
  rowKey = "_id",
  emptyMessage = "No records found.",
}) {
  const safeRows = Array.isArray(rows) ? rows : [];

  if (safeRows.length === 0) {
    return (
      <div className="card flex items-center justify-center p-10 text-sm text-ink-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeRows.map((row) => (
            <tr
              key={row[rowKey]}
              className="border-b border-ink-50 last:border-0 hover:bg-ink-50"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3.5 text-ink-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}