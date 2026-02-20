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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="
          relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6
          border
        "
        style={{
          borderColor: '#dbe5ef',
          backgroundImage: 'linear-gradient(180deg, #ffffff, #f6fbfc)',
          boxShadow: '0 8px 30px -12px rgba(33, 45, 63, 0.12), 0 0 36px rgba(29, 177, 162, 0.14)',
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
          <h2 className="text-xl font-semibold text-slate-800">
            Report Summary – <span style={{ color: '#1DB1A2' }}>{CurrentReport.id || 'N/A'}</span>
          </h2>
          <button
            className="inline-flex items-center justify-center cursor-pointer rounded-md p-2 hover:bg-gray-100 transition"
            style={{ color: '#58697f' }}
            onClick={() => setReportViewModal(prev => !prev)}
            aria-label="Close modal"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Metadata */}
        <div className="text-sm mb-6" style={{ color: '#58697f' }}>
          <p><span className="font-semibold text-slate-700">Period:</span> {CurrentReport.period || 'N/A'}</p>
          <p><span className="font-semibold text-slate-700">Generated On:</span> {CurrentReport.generatedDate || new Date().toLocaleDateString()}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Metric label="Recovery Rate" value={`${CurrentReport.rateRecovery || 0}%`} />
          <Metric label="Readmission Rate" value={`${CurrentReport.rateReadmission || 0}%`} accentColor="#F0745A" />
          <Metric label="In-Patients" value={CurrentReport.inPatients || 0} />
          <Metric label="Out-Patients" value={CurrentReport.outPatients || 0} accentColor="#F0745A" />
        </div>

        {/* Export Section */}
        <div className="border-t pt-4" style={{ borderColor: '#dbe5ef' }}>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#58697f' }}>
            Export Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="
              w-full rounded-lg px-3 py-2 mb-4 text-sm
              border cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-[#1DB1A2]
              transition
            "
            style={{ borderColor: '#dbe5ef', color: '#58697f' }}
            onFocus={e => e.currentTarget.style.borderColor = '#1DB1A2'}
            onBlur={e => e.currentTarget.style.borderColor = '#dbe5ef'}
          >
            <option value="">Select format</option>
            <option value="CSV">CSV</option>
            <option value="XLSX">XLSX</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setReportViewModal(prev => !prev)}
              className="
                px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
                border transition-colors
              "
              style={{ borderColor: '#dbe5ef', color: '#58697f' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#F0745A'; e.currentTarget.style.borderColor = '#F0745A'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '#58697f'; e.currentTarget.style.borderColor = '#dbe5ef'; }}
              type="button"
            >
              Close
            </button>

            <button
              disabled={!format}
              className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer text-white transition-all"
              style={{
                backgroundColor: format ? '#1DB1A2' : '#a7ddd7',
                boxShadow: format ? '0 2px 8px -2px rgba(29, 177, 162, 0.35)' : 'none',
                cursor: format ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => { if (format) e.currentTarget.style.backgroundColor = '#179e90'; }}
              onMouseLeave={e => { if (format) e.currentTarget.style.backgroundColor = '#1DB1A2'; }}
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
