import { ReportRow } from "./ReportRow";
export const ReportTable = ({ reports, setReportViewModal, setCurrentReport }) => {
  return (
    <div
      className="relative bg-white rounded-xl border shadow-sm overflow-x-auto"
      style={{
        borderColor: "#dbe5ef",
        boxShadow: "0 4px 20px -4px rgba(33, 45, 63, 0.08)",
        backgroundImage: "linear-gradient(180deg, #ffffff, #f6fbfc)",
      }}
    >

      <table className="w-full border-collapse">
        <thead>
          <tr
            className="text-left text-sm font-medium border-b"
            style={{ color: "#58697f", borderColor: "#dbe5ef" }}
          >
            <th className="p-4">Report ID</th>
            <th className="p-4">Period</th>
            <th className="p-4">Recovery Rate</th>
            <th className="p-4" style={{ color: '#F0745A' }}>Readmission</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y" style={{ borderColor: "#dbe5ef22" }}>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-8 text-center text-sm" style={{ color: "#58697f" }}>
                No reports found. Click <strong style={{ color: "#1DB1A2" }}>Generate Report</strong> to create one.
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <ReportRow
                key={report.reportId}
                report={report}
                setReportViewModal={setReportViewModal}
                setCurrentReport={setCurrentReport}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
