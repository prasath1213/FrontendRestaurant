export default function SelectField({ label, error, id, options = [], className = "", ...props }) {
  const selectId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="label-text">
          {label}
        </label>
      )}
      <select id={selectId} className="input-field" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs font-medium text-chili-600">{error}</p>}
    </div>
  );
}
