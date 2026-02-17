import { Metric } from "./Metric";
import { downloadReport } from "../../utils/downloadReport";

export const ReportView = ({
  CurrentReport,
  handleDownload,
  format,
  setFormat,
  setReportViewModal
}) => {
  const handleDownloadClick = () => {
    if (!format) {
      return;
    }
    
    // Check if CurrentReport has the necessary data
    if (!CurrentReport || !CurrentReport.id) {
      alert('Report data is not available. Please try again.');
      return;
    }
    
    try {
      // Prepare report data with proper field mapping
      const reportData = {
        reportId: CurrentReport.id,
        period: CurrentReport.period || 'N/A',
        generatedDate: CurrentReport.generatedDate || new Date().toLocaleDateString(),
        rateRecovery: CurrentReport.rateRecovery || 0,
        rateReadmission: CurrentReport.rateReadmission || 0,
        inPatients: CurrentReport.inPatients || 0,
        outPatients: CurrentReport.outPatients || 0,
      };
      
      // Download the report using the utility function
      downloadReport(reportData, format);
      
      // Call the original handleDownload if needed
      if (handleDownload) {
        handleDownload();
      }
      
      // Reset format and close modal after successful download
      setFormat("");
      setReportViewModal(false);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="
          relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6
          border
        "
        style={{
          borderColor: '#dbe5ef',
          backgroundImage: 'linear-gradient(180deg, #ffffff, #f6fbfc)',
          boxShadow: '0 8px 30px -12px rgba(33, 45, 63, 0.12), 0 0 36px rgba(29, 177, 162, 0.14)', // subtle + teal glow
        }}
      >
        {/* Top Accent Line */}
        <span
          className="absolute left-0 top-0 w-full h-[3px] rounded-t-xl"
          style={{ backgroundColor: '#1DB1A2' }}
          aria-hidden="true"
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Report Summary – {CurrentReport.id || 'N/A'}
          </h2>
          <button
            onClick={() => setReportViewModal(prev => !prev)}
            className="text-gray-500 hover:text-gray-700 text-xl"
            type="button"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Metadata */}
        <div className="text-sm text-gray-600 mb-6">
          <p><span className="font-medium">Period:</span> {CurrentReport.period || 'N/A'}</p>
          <p><span className="font-medium">Generated On:</span> {CurrentReport.generatedDate || new Date().toLocaleDateString()}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Metric label="Recovery Rate" value={`${CurrentReport.rateRecovery || 0}%`} />
          <Metric label="Readmission Rate" value={`${CurrentReport.rateReadmission || 0}%`} />
          <Metric label="In-Patients" value={CurrentReport.inPatients || 0} />
          <Metric label="Out-Patients" value={CurrentReport.outPatients || 0} />
        </div>

        {/* Export Section */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium mb-2">
            Export Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="
              w-full rounded-md px-3 py-2 mb-4
              border border-[#1DB1A2]
              focus:outline-none focus:ring-2 focus:ring-[#1DB1A2]
            "
          >
            <option value="">Select format</option>
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="XLSX">XLSX</option>
          </select>

          <div className="flex justify-end gap-3">
            {/* Close → hover red */}
            <button
              onClick={() => setReportViewModal(prev => !prev)}
              className="
                px-4 py-2 border rounded-md text-gray-700
                hover:bg-red-100 hover:text-red-600 transition
              "
              type="button"
            >
              Close
            </button>

            <button
              disabled={!format}
              className={`px-4 py-2 rounded-md text-white transition
                ${format
                  ? "bg-[#1DB1A2] hover:bg-[#097268]"
                  : "bg-[#81dcd3] cursor-not-allowed"
                }`}
              onClick={handleDownloadClick}
              type="button"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
