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
    const token = localStorage.getItem('token');
    const response = fetch("http://localhost:8020/admin/api/admin/generate",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
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
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:8020/admin/api/admin/reports", {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
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


  if (loading) return <div>Loading reports from database...</div>;
  return (
    <div
      className="
        relative mx-auto max-w-[70%]
        rounded-xl border p-6 md:p-7
        shadow-sm bg-white mt-16
      "
      style={{
        borderColor: "#dbe5ef",
        boxShadow: "0 8px 30px -12px rgba(33, 45, 63, 0.12), 0 0 36px rgba(29, 177, 162, 0.14)", // soft + teal glow
        backgroundImage: "linear-gradient(180deg, #ffffff, #f6fbfc)",
      }}
    >
      {/* Top Accent Line */}
      <span
        className="absolute left-0 top-0 w-full h-[3px] rounded-t-xl"
        style={{ backgroundColor: "#1DB1A2" }} // teal accent
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Reports &amp; Compliance</h1>
        <button
          className="
            inline-flex items-center gap-2
            rounded-lg px-4 py-2
            text-white
            transition-all duration-150
            hover:opacity-90 active:scale-[0.98]
          "
          style={{
            backgroundImage: "linear-gradient(135deg, #1DB1A2, #3b82f6)",
            boxShadow: "0 6px 20px -8px rgba(33, 45, 63, 0.18)",
          }}
          onClick={() => setReportSelectionModal(prev => !prev)}
        >
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
