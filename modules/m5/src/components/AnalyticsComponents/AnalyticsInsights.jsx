export default function AnalyticsInsights({data}) {
  const PRIMARY = "#1DB1A2";
  const ACCENT = "#aa4a3a";

  return (
    <div
      className="
        group relative rounded-xl border p-4 md:p-5
        bg-white shadow-sm space-y-4 transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
      "
      style={{
        backgroundImage: "linear-gradient(180deg, #ffffff, #f6fbfc)",
        borderColor: "#dbe5ef",
        boxShadow: "0 4px 20px -4px rgba(33, 45, 63, 0.08)",
      }}
    >
      {/* Accent strip */}
      <span
        className="absolute left-0 top-0 h-[2px] w-full rounded-t-xl"
        style={{ backgroundColor: PRIMARY }}
        aria-hidden="true"
      />

      {/* Header */}
      <h2 className="text-sm font-semibold text-[#1f2a37]">Insights</h2>

      {/* Insight cards */}
      <div
        className="p-3 rounded-lg text-sm flex items-center gap-2"
        style={{
          backgroundColor: "rgba(29, 177, 162, 0.08)",
          color: "#1f2a37",
          borderLeft: `4px solid ${PRIMARY}`,
        }}
      >
        {/* 📈 Readmissions increased by <b style={{ color: PRIMARY }}>4%</b> compared to last quarter */}
        {data[0]}
      </div>

      <div
        className="p-3 rounded-lg text-sm flex items-center gap-2"
        style={{
          backgroundColor: "rgba(170, 74, 58, 0.08)",
          color: "#1f2a37",
          borderLeft: `4px solid ${ACCENT}`,
        }}
      >
        {/* 💡 Diabetes shows the highest readmission rate among diseases */}
        {data[1]}
      </div>
    </div>
  );
}
