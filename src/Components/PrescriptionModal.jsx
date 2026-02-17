
import React, { useEffect, useMemo, useState } from "react";

export default function PrescriptionModal({setViewPrescriptions }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const primaryColor = "#aa4a3a";
  const accentColor = "#1DB1A2";


  useEffect(() => {
    const stored = localStorage.getItem("patientUserId");
    const userId = stored ? Number(JSON.parse(stored)) : null;

    if (!userId) {
      // Defer state updates to avoid synchronous setState warning in effects
      setTimeout(() => {
        setError("User ID not found");
        setLoading(false);
      }, 0);
      return;
    }

    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(`http://localhost:8020/Prescription/api/prescriptions/patient-prescriptions?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch prescriptions");
        const data = await res.json();
        setPrescriptions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const totalPatients = useMemo(() => prescriptions.length, [prescriptions]);

  return (
    <div
      className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={()=>setViewPrescriptions(prev=>!prev)}
    >
      <div
        className="p-6 md:p-7 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border"
        style={{
          borderColor: `${accentColor}55`,
          backgroundColor: "#f6f8f7",
          backgroundImage: `linear-gradient(180deg, rgba(29,177,162,0.06), rgba(170,74,58,0.05))`
        }}
        onClick={(e) => e.stopPropagation()}
      >
          <div
            className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6 p-4 rounded-xl border shadow-sm"
            style={{
              borderColor: `${accentColor}35`,
              backgroundImage: `linear-gradient(90deg, rgba(29,177,162,0.12), rgba(170,74,58,0.08))`,
            }}
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: "black" }}>Patient Prescriptions</h2>
            </div>
            <button
              onClick={()=>setViewPrescriptions(prev=>!prev)}
              className="self-start sm:self-center text-3xl font-light px-3 rounded-lg hover:opacity-70 transition cursor-pointer"
              aria-label="Close prescriptions modal"
              title="Close"
            >
              ×
            </button>
          </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ backgroundColor: `${accentColor}10`, color: accentColor, border: `1px solid ${accentColor}30` }}
          >
            Patients: {totalPatients}
          </div>
          <div className="w-full bg-white border rounded-xl p-3 text-sm text-gray-700 leading-relaxed flex flex-wrap items-center gap-6"
               style={{ borderColor: `${accentColor}25`, backgroundImage: `linear-gradient(90deg, rgba(29,177,162,0.08), rgba(170,74,58,0.08))` }}>
            <span className="font-semibold" style={{ color: primaryColor }}>Frequency (M-A-N):</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${accentColor}15`, color: "black", border: `1px solid ${accentColor}25` }}>1-0-1 = morning & night</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${accentColor}15`, color: "black", border: `1px solid ${accentColor}25` }}>1-1-1 = all day</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${accentColor}15`, color: "black", border: `1px solid ${accentColor}25` }}>0-0-1 = night only</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div
              className="h-12 w-12 rounded-full border-4 border-white border-t-4 animate-spin"
              style={{ borderTopColor: accentColor, borderColor: `${accentColor}66` }}
            />
            <p className="text-lg font-semibold" style={{ color: accentColor }}>Loading prescriptions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>{error}</p>
            <p className="text-sm text-gray-600">Please close and try again.</p>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border" style={{ borderColor: `${accentColor}55` }}>
            <p className="text-lg font-semibold" style={{ color: primaryColor }}>No prescriptions found</p>
            <p className="text-sm text-gray-600 mt-1">Once prescriptions are added, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {prescriptions.map((prescription, index) => (
              <div 
                key={index} 
                className="rounded-xl p-5 shadow-md hover:shadow-lg transition border"
                style={{ borderColor: `${accentColor}35`, backgroundColor: "#fbfcfc", backgroundImage: `linear-gradient(180deg, rgba(29,177,162,0.08), rgba(170,74,58,0.05))` }}
              >
                {/* Patient Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: "black" }}>
                      {prescription.patientName}
                    </h3>
                    {prescription.remarks && (
                      <p className="text-sm text-gray-700 mt-1 italic">
                        <span className="font-semibold" style={{ color: accentColor }}>Suggestions:</span> {" "}
                        {prescription.remarks}
                      </p>
                    )}
                  </div>
                </div>

                {/* Medicines List */}
                {prescription.medicines && prescription.medicines.length > 0 ? (
                  <div className="rounded-lg p-4 border" style={{ borderColor: `${accentColor}25`, backgroundColor: "#fefefe", backgroundImage: `linear-gradient(90deg, rgba(29,177,162,0.07), rgba(29,177,162,0.01))` }}>
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <p className="text-sm font-semibold" style={{ color: primaryColor }}>Medicines</p>
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: primaryColor }}>
                        Frequency (M-A-N)
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {prescription.medicines.map((medicine, medIndex) => (
                        <li 
                          key={medIndex} 
                          className="flex items-start justify-between gap-2 p-3 rounded-lg border"
                          style={{ borderColor: `${accentColor}20`, backgroundColor: "#f8fbfa" }}
                        >
                          <span className="font-semibold text-gray-900 text-base">
                            {medicine.medicineName}
                          </span>
                          <span
                            className="font-semibold px-3.5 py-1.5 rounded-full text-white text-xs uppercase tracking-wide cursor-help"
                            style={{ backgroundColor: accentColor }}
                            title="Frequency pattern: Morning-Afternoon-Night"
                          >
                            {medicine.frequency}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No medicines prescribed.</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-8 pt-6 border-t-2" style={{ borderTopColor: accentColor }}>
          <button
            onClick={()=>setViewPrescriptions(prev=>!prev)}
            className="font-semibold px-8 py-3 rounded-lg text-white shadow-md hover:shadow-lg hover:opacity-90 transition text-base cursor-pointer"
            style={{ backgroundColor: accentColor }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
