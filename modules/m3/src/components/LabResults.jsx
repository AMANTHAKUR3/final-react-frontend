import { useMemo, useState, useEffect } from 'react'
import Modal from './Modal'
import { LAB_TESTS, getDefaultsFor } from '../data/tests'
// import axios from "axios"
import axios from '../../../../src/api/http'


const calculateStatus = (val, refRange) => {
  const numValue = parseFloat(val);
  if (isNaN(numValue) || !refRange) return "NORMAL";

  const rangeNumbers = refRange.match(/(\d+(\.\d+)?)/g);
  
  if (rangeNumbers) {
    const numbers = rangeNumbers.map(Number);
    // Logic for "< 100"
    if (refRange.includes('<')) {
      return numValue >= numbers[0] ? "ELEVATED" : "NORMAL";
    }
    // Logic for "> 100"
    if (refRange.includes('>')) {
      return numValue <= numbers[0] ? "ELEVATED" : "NORMAL";
    }
    // Logic for range "70 - 99"
    if (numbers.length === 2) {
      const [min, max] = numbers;
      return (numValue < min || numValue > max) ? "ELEVATED" : "NORMAL";
    }
  }
  return "NORMAL";
};

export default function LabResults({ onAdd, onFlag, doctors = [], patientId = 1, refreshKey }) {
  const [items, setItems] = useState([]) 
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false) 
  const [fullHistoryOpen, setFullHistoryOpen] = useState(false) 

  const [test, setTest] = useState("")
  const [value, setValue] = useState(0)
  const [unit, setUnit] = useState("")
  const [range, setRange] = useState("")
  const [date, setDate] = useState("")
  const [lab, setLab] = useState("Central Lab")

  const fetchLabs = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8020/ehr/api/ehr/patient-ehr?`, {
        params: { patientId }
      });
      const mappedLabs = response.data.labResults.map((lr, index) => ({
        id: `api-lab-${index}`,
        name: lr.testName,
        value: lr.result.split(' ')[0], 
        units: lr.result.split(' ')[1] || "",
        refRange: lr.referenceRange,
        date: lr.testDate,
        lab: "Central Lab",
        status: lr.status.charAt(0) + lr.status.slice(1).toLowerCase(),
        flagged: lr.status === "ELEVATED"
      }));
      setItems(mappedLabs);
    } catch (error) {
      console.error("Failed to fetch lab results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLabs(); }, [patientId, refreshKey]);

  const recentItems = items.slice(0, 5);
  const hasMore = items.length > 5;

  function handleTestChange(name) {
    const defs = getDefaultsFor(name);
    setTest(name); 
    setUnit(defs.units || ""); 
    setRange(defs.refRange || "");
  }

  const submit = async () => {
    if (!test || !value || !date) return alert("Please fill in required fields.");

    // Determine status before sending to DB
    const dynamicStatus = calculateStatus(value, range);

    const payload = {
      recordId: null, 
      patientId, 
      doctorId: 1, 
      recordType: "LAB_RESULT",
      data: { 
        testName: test, 
        result: `${value} ${unit}`, 
        referenceRange: range, 
        status: dynamicStatus, 
        testDate: date 
      }
    };

    try {
      setLoading(true);
      await axios.post("http://localhost:8020/ehr/api/ehr/upsert-record?", payload);
      await fetchLabs(); 
      setOpen(false);
      setTest(""); setValue(0); setDate("");
    } catch (error) {
      alert("Error saving record.");
    } finally {
      setLoading(false);
    }
  };

  const LabRow = ({ item }) => (
    <tr key={item.id} className={`hover:bg-[#1DB1A2]/5 transition-colors border-b border-gray-50 last:border-0 ${item.status === 'Elevated' ? 'bg-[#aa4a3a]/10' : ''}`}>
      <td className="px-4 md:px-8 py-4 align-middle">
        <div className="font-bold text-slate-900 text-sm">{item.name}</div>
        <div className="text-[12px] font-bold text-[#1DB1A2] uppercase tracking-tighter">{item.lab}</div>
      </td>
      
      <td className="px-4 md:px-8 py-4 text-center align-middle">
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-baseline gap-1">
                <span className={`text-xs md:text-[15px] font-black text-[#1DB1A2]'}`}>
                    {item.value}
                </span>
                <span className="text-[9px] md:text-[15px] font-bold text-black uppercase tracking-tighter">{item.units}</span>
            </div>
            <div className="xs:hidden text-[13px] font-mono text-black font-bold mt-0.5">{item.date}</div>
        </div>
      </td>

      <td className="hidden sm:table-cell px-4 md:px-8 py-4 text-center align-middle">
        <span className="inline-block px-2 py-0.5 bg-gray-50 text-black rounded-md text-[15px] font-mono font-bold border border-gray-200 min-w-[60px]">
          {item.refRange}
        </span>
      </td>

      <td className="hidden xs:table-cell px-4 md:px-8 py-4 text-center align-middle text-[10px] font-bold text-slate-950 font-mono italic whitespace-nowrap">
        {item.date}
      </td>

      <td className="px-4 md:px-8 py-4 text-center align-middle">
        <div className="flex justify-center">
            <span className={`inline-block w-24 py-1 rounded-full text-[9px] md:text-[12px] font-black uppercase tracking-widest border shadow-sm ${
            item.status === 'Elevated' ? 'bg-[#aa4a3a]/20 text-[#aa4a3a] border-[#aa4a3a]/30' : 'bg-[#1DB1A2]/10 text-[#1DB1A2] border-[#1DB1A2]/30'
            }`}>
            {item.status}
            </span>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="border border-[#1DB1A2]/30 mx-2 md:mx-8 my-4 card shadow-sm rounded-2xl flex flex-col h-full bg-white overflow-hidden">
      
      {/* Header */}
      <div className="px-5 md:px-8 py-5 border-b border-[#1DB1A2]/20 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-[#1DB1A2] rounded-full"></div>
          <div>
            <h3 className="text-sm md:text-base font-black text-slate-900 tracking-tight uppercase">Lab Diagnostics</h3>
            <p className="text-[9px] md:text-[10px] font-bold text-[#1DB1A2] uppercase tracking-widest mt-0.5">
              {loading ? "Syncing..." : `Showing ${recentItems.length} Recent`}
            </p>
          </div>
        </div>
        <button 
          className="cursor-pointer bg-[#1DB1A2] text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-[#1DB1A2]/90 transition-all active:scale-95 shadow-md" 
          onClick={() => setOpen(true)}
        >
          Add Result
        </button>
      </div>
      
      {/* Table Area */}
      <div className="overflow-x-auto flex-1 bg-white">
        <table className="w-full text-left border-collapse table-fixed md:table-auto">
          <thead>
            <tr className="bg-[#1DB1A2]/5 border-b border-[#1DB1A2]/20">
              <th className="px-4 md:px-8 py-3 text-[13px] font-black text-black uppercase tracking-widest text-left">Test Name</th>
              <th className="px-4 md:px-8 py-3 text-[13px] font-black text-black uppercase tracking-widest text-center">Result</th>
              <th className="hidden sm:table-cell px-4 md:px-8 py-3 text-[13px] font-black text-black uppercase tracking-widest text-center">Ref. Range</th>
              <th className="hidden xs:table-cell px-4 md:px-8 py-3 text-[13px] font-black text-black uppercase tracking-widest text-center">Date</th>
              <th className="px-4 md:px-8 py-3 text-[13px] font-black text-black uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentItems.length > 0 ? recentItems.map(item => <LabRow key={item.id} item={item} />) : (
              <tr>
                <td colSpan="5" className="text-center py-16 text-slate-950 font-bold italic text-xs">
                   {loading ? "Fetching clinical records..." : "No laboratory records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / History Button */}
      {hasMore && (
        <div className="border-t border-[#1DB1A2]/20 bg-[#1DB1A2]/5 px-6 py-5 flex justify-center items-center">
          <button 
            onClick={() => setFullHistoryOpen(true)} 
            className=" cursor-pointer group flex items-center gap-3 py-2.5 px-6 bg-white border border-[#1DB1A2]/30 rounded-full text-[10px] md:text-[11px] font-black text-slate-950 uppercase tracking-widest hover:border-[#1DB1A2] hover:text-[#1DB1A2] transition-all"
          >
            <span>Complete Lab History</span>
            <span className="bg-[#1DB1A2]/10 px-2 py-0.5 rounded-md text-[9px] border border-[#1DB1A2]/30">
              {items.length}
            </span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Full History Overlay */}
      {fullHistoryOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 md:p-8 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border-2 border-[#1DB1A2]/30">
            <div className="px-6 md:px-8 py-5 border-b border-[#1DB1A2]/20 flex justify-between items-center bg-white">
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">Diagnostic History</h2>
              <button onClick={() => setFullHistoryOpen(false)} className="w-10 h-10 rounded-full bg-[#1DB1A2]/10 flex items-center justify-center text-slate-900 font-bold border border-[#1DB1A2]/30 hover:bg-[#1DB1A2]/20 transition-colors">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 md:p-6">
               <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-50">{items.map(item => <LabRow key={item.id} item={item} />)}</tbody>
               </table>
            </div>
          </div>
        </div>
      )}

      {/* New Entry Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Log Lab Result">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-2 relative">
              <label className="text-[10px] md:text-[11px] font-black text-slate-950 uppercase tracking-widest ml-1">Panel Type*</label>
              <select 
                className="w-full border border-[#1DB1A2]/30 bg-[#1DB1A2]/5 rounded-xl px-4 py-3 text-sm font-bold text-slate-950 outline-none transition-all focus:border-[#1DB1A2] focus:ring-2 focus:ring-[#1DB1A2]/20" 
                value={test} 
                onChange={(e) => handleTestChange(e.target.value)}
              >
                <option value="">Select test panel...</option>
                {LAB_TESTS.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black text-slate-950 uppercase tracking-widest ml-1">Numeric Result*</label>
              <input type="number" step="any" className="w-full border border-[#1DB1A2]/30 bg-[#1DB1A2]/5 rounded-xl px-4 py-3 text-sm font-bold text-slate-950 outline-none focus:border-[#1DB1A2] focus:ring-2 focus:ring-[#1DB1A2]/20" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black text-slate-950 uppercase tracking-widest ml-1">Observation Date*</label>
              <input type="date" className="w-full border border-[#1DB1A2]/30 bg-[#1DB1A2]/5 rounded-xl px-4 py-3 text-sm font-bold text-slate-950 outline-none focus:border-[#1DB1A2] focus:ring-2 focus:ring-[#1DB1A2]/20" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black text-slate-950 uppercase tracking-widest ml-1">Lab Facility</label>
              <input className="w-full border border-[#1DB1A2]/30 bg-[#1DB1A2]/5 rounded-xl px-4 py-3 text-sm font-bold text-slate-950 outline-none focus:border-[#1DB1A2] focus:ring-2 focus:ring-[#1DB1A2]/20" value={lab} onChange={(e) => setLab(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black text-slate-950 uppercase tracking-widest ml-1">Reference Range</label>
              <input className="w-full bg-[#1DB1A2]/10 border border-[#1DB1A2]/30 text-slate-950 rounded-xl px-4 py-3 text-sm font-bold italic" value={range} readOnly />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-black text-slate-950 uppercase tracking-widest ml-1">Units</label>
              <input className="w-full bg-[#1DB1A2]/10 border border-[#1DB1A2]/30 text-slate-950 rounded-xl px-4 py-3 text-sm font-bold italic" value={unit} readOnly />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[#1DB1A2]/20">
            <button className="px-6 py-3 rounded-xl text-[11px] font-black text-slate-950 uppercase tracking-widest hover:bg-[#1DB1A2]/10 transition-colors" onClick={() => setOpen(false)}>Discard</button>
            <button 
              className="bg-[#1DB1A2] text-white px-10 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-[#1DB1A2]/90 transition-all disabled:bg-slate-300" 
              onClick={submit} 
              disabled={loading}
            >
              Commit Result
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}