export const Metric = ({ value, label, onClick, accentColor }) => {
  const accent = accentColor || '#1DB1A2';

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e);
        }
      }}
      className="
        group relative flex items-start gap-3
        rounded-xl border p-4 cursor-pointer
        bg-white transition-all duration-200
        hover:bg-[rgba(29,177,162,0.04)] hover:-translate-y-0.5 hover:shadow-md
        focus:outline-none
      "
      style={{
        borderColor: '#dbe5ef',
        backgroundImage: 'linear-gradient(180deg, #ffffff, #f6fbfc)',
        boxShadow: '0 4px 20px -4px rgba(33, 45, 63, 0.08)',
      }}
    >
      {/* Top accent line */}
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-[3px] rounded-t-xl"
        style={{ backgroundColor: accent }}
      />

      {/* Accent dot */}
      <span
        aria-hidden="true"
        className="h-2 w-2 mt-1.5 rounded-full shrink-0"
        style={{ backgroundColor: accent }}
      />

      <div className="flex-1">
        {/* Label — matches StatCard label color */}
        <p className="text-sm font-medium" style={{ color: '#58697f' }}>{label}</p>

        {/* Value in accent */}
        <p
          className="text-lg font-semibold mt-0.5 tracking-tight transition-colors"
          style={{ color: accent }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};
