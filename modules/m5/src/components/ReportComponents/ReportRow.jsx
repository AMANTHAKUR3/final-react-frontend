export const ReportRow = ({ report, setReportViewModal, setCurrentReport }) => {
  return (
    <tr
      className="
        text-sm transition-all duration-150
        hover:bg-[rgba(29,177,162,0.04)]
        border-l-4 border-l-transparent
        hover:border-l-[#1DB1A2]
      "
      style={{ borderBottomColor: "#dbe5ef" }}
    >
      <td className="p-4 font-semibold text-slate-800">{report.id}</td>
      <td className="p-4" style={{ color: "#58697f" }}>{report.period}</td>
      <td className="p-4 font-medium" style={{ color: "#1DB1A2" }}>{report.rateRecovery}%</td>
      <td className="p-4 font-medium" style={{ color: "#F0745A" }}>{report.rateReadmission}%</td>

      <td className="p-4 text-center">
        <button
          className="
            inline-flex items-center gap-1.5
            px-4 py-1.5 rounded-lg text-sm font-semibold
            text-white cursor-pointer
            transition-all duration-150
            hover:shadow-md active:scale-[0.97]
          "
          style={{
            backgroundColor: "#1DB1A2",
            boxShadow: "0 2px 8px -2px rgba(29, 177, 162, 0.35)",
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#179e90"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1DB1A2"}
          onClick={() => {
            setReportViewModal(prev => !prev);
            setCurrentReport(report);
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </button>
      </td>
    </tr>
  );
};
