import { useEffect, useState } from "react";
import { ReportTable } from "../components/ReportComponents/ReportTable";
import { Reportgeneration } from "../components/ReportComponents/Reportgeneration";
import { ReportView } from "../components/ReportComponents/ReportView";

export const Reports = () => {
  const [Report, setReport] = useState([]);
  const [ReportSelectionModal, setReportSelectionModal] = useState(false);
  const [ReportViewModal, setReportViewModal] = useState(false);
  const [CurrentReport, setCurrentReport] = useState({});
  const [format, setFormat] = useState("");
  const [periodType, setPeriodType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [reload,setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  const onGenerate = async({ periodType, selectedDate }) => {
    console.log(periodType , selectedDate);
    const response = fetch("http://localhost:8020/admin/api/admin/generate",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({
                    frequency: periodType,
                    selectedDate: selectedDate
                })
            });
            if((await response).ok) setReload(prev=>!prev);
  };

  const handleGenerate = () => {
    if (!periodType || !selectedDate) return;

    onGenerate({
      periodType,
      selectedDate,
    });

    setReportSelectionModal(prev => !prev);
    setPeriodType("");
    setSelectedDate("");
  };

  const handleDownload = () => {
    setReportViewModal(prev => !prev);
  };

  useEffect( () => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8020/admin/api/admin/reports");
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [reload]);


  if (loading)
    return (
      <div className="mx-auto max-w-[70%] pt-24 flex items-start justify-center">
        <div
          className="relative w-full rounded-xl border p-10 text-center shadow-sm"
          style={{
            borderColor: "#dbe5ef",
            backgroundImage: "linear-gradient(180deg, #ffffff, #f6fbfc)",
            boxShadow: "0 4px 20px -4px rgba(33, 45, 63, 0.08)",
          }}
        >
          <span
            className="absolute left-0 top-0 w-full h-[3px] rounded-t-xl"
            style={{ backgroundColor: "#1DB1A2" }}
            aria-hidden="true"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <svg className="animate-spin h-8 w-8" style={{ color: "#1DB1A2" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span
                className="absolute -top-1 -right-1 h-3 w-3 rounded-full animate-ping"
                style={{ backgroundColor: '#F0745A', opacity: 0.6 }}
              />
            </div>
            <p className="text-sm font-medium animate-pulse" style={{ color: "#58697f" }}>
              Loading reports from database…
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className="
        relative mx-auto max-w-[70%] min-h-[calc(100vh-5rem)]
        rounded-xl border p-6 md:p-7
        shadow-sm bg-white mt-16 mb-10
      "
      style={{
        borderColor: "#dbe5ef",
        boxShadow: "0 8px 30px -12px rgba(33, 45, 63, 0.12), 0 0 36px rgba(29, 177, 162, 0.14)",
        backgroundImage: "linear-gradient(180deg, #ffffff, #f6fbfc)",
      }}
    >
      {/* Top Accent Line */}
      <span
        className="absolute left-0 top-0 w-full h-[3px] rounded-t-xl"
        style={{ backgroundColor: "#1DB1A2" }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Reports &amp; Compliance</h1>
        <button
          className="
            inline-flex items-center gap-2
            rounded-lg px-4 py-2 text-sm font-semibold
            text-white
            transition-all duration-150 cursor-pointer
            hover:opacity-90 active:scale-[0.98]
          "
          style={{
            background: "#F0745A",
            boxShadow: "0 6px 20px -8px rgba(240, 116, 90, 0.3)",
          }}
          onClick={() => setReportSelectionModal(prev => !prev)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Generate Report
        </button>
      </div>

      {/* Modals */}
      {ReportSelectionModal && (
        <Reportgeneration
          setReportSelectionModal={setReportSelectionModal}
          periodType={periodType}
          setCurrentReport={setPeriodType}       
          setSelectedDate={setSelectedDate}
          handleGenerate={handleGenerate}
          setPeriodType={setPeriodType}
        />
      )}

      {ReportViewModal && (
        <ReportView
          CurrentReport={CurrentReport}
          format={format}
          handleDownload={handleDownload}
          setFormat={setFormat}
          setReportViewModal={setReportViewModal}
        />
      )}

      {/* Table */}
      <div className="mt-4">
        <ReportTable
          reports={Report}
          setReportViewModal={setReportViewModal}
          setCurrentReport={setCurrentReport}
        />
      </div>
    </div>
  );
};
