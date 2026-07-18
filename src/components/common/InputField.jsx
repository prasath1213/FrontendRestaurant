export default function InputField({ label, error, id, className = "", ...props }) {
  const inputId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="label-text">
          {label}
        </label>
      )}
      <input id={inputId} className="input-field" {...props} />
      {error && <p className="mt-1 text-xs font-medium text-chili-600">{error}</p>}
    </div>
  );
}
