import { useState } from 'react'
import axios from 'axios'

const ICD_10_LIBRARY = [
  { name: 'Hypertension', code: 'I10' },
  { name: 'Type 2 Diabetes', code: 'E11.9' },
  { name: 'Acute Appendicitis', code: 'K35.3' },
  { name: 'Lower Back Pain', code: 'M54.5' },
  { name: 'Heart Disease', code: 'I25.1' },
  { name: 'Acute Bronchitis', code: 'J20.9' },
  { name: 'Hypothyroidism', code: 'E03.9' },
  { name: 'Hyperlipidemia', code: 'E78.5' },
  { name: 'Osteoarthritis', code: 'M19.9' },
  { name: 'Asthma (Mild)', code: 'J45.20' },
];

export default function DiagnosisEditor({ patientId, onRecordUpdate }) {
  const [form, setForm] = useState({ name: '', code: '', severity: '', onset: new Date().toISOString().slice(0, 10), notes: '' })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)

  const filteredSuggestions = ICD_10_LIBRARY.filter(item =>
    item.name.toLowerCase().includes(form.name.toLowerCase()) ||
    item.code.toLowerCase().includes(form.name.toLowerCase())
  ).slice(0, 5);

  function selectSuggestion(item) {
    setForm(f => ({ ...f, name: item.name, code: item.code }));
    setShowSuggestions(false);
  }

  async function submit() {
    if (!form.name) {
      alert("Please select or enter a diagnosis name.");
      return;
    }

    setLoading(true);
    const payload = {
      recordId: null,
      patientId: patientId,
      doctorId: 1,
      recordType: "DIAGNOSIS",
      data: {
        diagnosisName: form.name,
        icdCode: form.code || "N/A",
        severity: form.severity || "Mild",
        onsetDate: form.onset,
        notes: form.notes
      }
    };

    try {
      await axios.post("http://localhost:8020/ehr/api/ehr/upsert-record?", payload);
      
      setForm({ name: '', code: '', severity: '', onset: new Date().toISOString().slice(0, 10), notes: '' });
      alert("Diagnosis recorded successfully.");
      
      // Trigger audit trail refresh
      if (onRecordUpdate) {
        onRecordUpdate();
      }
    } catch (error) {
      console.error("Diagnosis submission failed:", error);
      alert("Server Error: Could not save diagnosis.");
    } finally {
      setLoading(false);
    }
  }

  // Consistent input styling to match other components
  const inputStyle = "w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:font-normal placeholder:text-slate-400";

  return (
    <div className="border border-slate-200 mx-2 md:mx-8 my-4 card shadow-sm rounded-2xl flex flex-col h-full bg-white overflow-hidden">
      
      {/* Header */}
      <div className="px-5 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-slate-900 rounded-full"></div>
          <div>
            <h3 className="font-black text-slate-900 text-sm md:text-lg tracking-tight uppercase">Diagnosis Management</h3>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Clinical Protocol Entry</p>
          </div>
        </div>
        <span className="hidden xs:block text-[9px] md:text-[10px] font-black text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full whitespace-nowrap">
          Record Entry
        </span>
      </div>

      <div className="p-5 md:p-8 space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Diagnosis Name */}
          <div className="space-y-2 relative">
            <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Diagnosis Name*</label>
            <input
              className={inputStyle}
              placeholder="Search Diagnosis..."
              value={form.name}
              onFocus={() => setShowSuggestions(true)}
              onChange={e => {
                setForm(f => ({ ...f, name: e.target.value }));
                setShowSuggestions(true);
              }}
            />

            {showSuggestions && form.name.length > 1 && filteredSuggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl mt-2 overflow-hidden">
                {filteredSuggestions.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-5 py-3 text-sm hover:bg-slate-50 flex justify-between items-center transition-colors border-b border-slate-50 last:border-none"
                    onClick={() => selectSuggestion(item)}
                  >
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ICD Code */}
          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">ICD-10 Code</label>
            <input
              className={`${inputStyle} bg-slate-100 border-dashed text-slate-400 cursor-not-allowed`}
              value={form.code}
              readOnly
              placeholder="Auto-filled"
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Clinical Severity</label>
            <div className="relative">
                <select
                className={`${inputStyle} appearance-none cursor-pointer`}
                value={form.severity}
                onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
                >
                <option value="">Select Level</option>
                <option>Mild</option>
                <option>Moderate</option>
                <option>Severe</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          {/* Onset Date */}
          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Onset Date</label>
            <input 
              type="date"
              className={inputStyle}
              value={form.onset}
              onChange={e => setForm(f => ({ ...f, onset: e.target.value }))}
            />
          </div>

          {/* Clinical Notes */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Clinical Notes & Observations</label>
            <textarea 
              className={`${inputStyle} h-28 md:h-32 resize-none`}
              placeholder="Describe symptoms, patient history, or clinical observations..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
          <button
             type="button"
             onClick={() => setForm({ name: '', code: '', severity: '', onset: new Date().toISOString().slice(0, 10), notes: '' })}
             className="cursor-pointer order-2 sm:order-1 px-6 py-3 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Clear Form
          </button>
          <button
            disabled={loading} 

            className={`
                order-1 sm:order-2
                ${loading ? ' bg-slate-400' : 'bg-slate-900 hover:bg-blue-600'} 
                text-white text-[11px] font-black px-10 py-3.5 rounded-xl 
                hover:scale-[1.02] active:scale-[0.98] transition-all 
                shadow-lg shadow-slate-200 uppercase tracking-widest cursor-pointer
            `}
            onClick={submit}
          >
            {loading ? 'Submitting...' : 'Finalize Diagnosis'}
          </button>
        </div>
      </div>
    </div>
  )
}