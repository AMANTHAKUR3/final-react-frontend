import React, { useEffect, useState } from 'react';
import TagInput from '../components/TagInput.jsx';
import Modal from '../components/Modal.jsx';
import axios from 'axios';
import { 
  HiOutlineCheckCircle, 
  HiOutlineClipboardCheck,
  HiUser,
  HiLightningBolt
} from "react-icons/hi";

const BASE_URL = "http://localhost:8020/Prescription/api/prescriptions";

export default function GeneratePrescription() {
  const steps = ['Patient', 'Meds', 'Dosage', 'Notes', 'Review'];
  const [activeStep, setActiveStep] = useState(0);
  const [patients, setPatients] = useState([]);
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [medicationList, setMedicationList] = useState([]);
  const [dosages, setDosages] = useState({});
  const [remarks, setRemarks] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // New Quick Suggestions for Doctors
  const suggestions = [
    "Drink plenty of water",
    "Avoid oily food",
    "Complete bed rest",
    "Avoid cold drinks",
    "Follow up in 7 days",
    "Take after meals"
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const doctorId = Number(JSON.parse(localStorage.getItem('doctorUserId')));
      try {
        const [patRes, medRes] = await Promise.all([
          axios.get(`${BASE_URL}/patients?doctorId=${doctorId}`),
          axios.get(`${BASE_URL}/medicines`)
        ]);
        setPatients(patRes.data);
        setMeds(medRes.data);
        if (patRes.data.length > 0) {
          setPatientId(patRes.data[0].patientId);
          setPatientName(patRes.data[0].patientName);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const onPatientChange = (id) => {
    const p = patients.find(x => String(x.patientId) === String(id));
    setPatientId(id);
    setPatientName(p?.patientName || '');
  };

  const handleDosageChange = (medName, value) => setDosages(prev => ({ ...prev, [medName]: value }));

  // Helper to add suggestion to remarks
  const addSuggestion = (text) => {
    setRemarks(prev => prev ? `${prev}, ${text}` : text);
  };

  const canNext = () => {
    if (activeStep === 0) return !!patientId;
    if (activeStep === 1) return medicationList.length > 0;
    if (activeStep === 2) return medicationList.length > 0 && medicationList.every(m => dosages[m]?.trim());
    return true;
  };

  const confirmCreate = async () => {
    const doctorId = Number(JSON.parse(localStorage.getItem('doctorUserId')));
    const p = patients.find(p => String(p.patientId) === String(patientId));
    const items = medicationList.map(name => ({
      medicineId: meds.find(m => m.name === name)?.id || 0,
      frequency: dosages[name] || ""
    }));
    try {
      await axios.post(`${BASE_URL}/add?doctorId=${doctorId}`, { patientId, appointmentId: p?.appointmentId || 0, remarks, items });
      setPreviewOpen(false);
      setIsSuccess(true);
      setTimeout(() => { setIsSuccess(false); setActiveStep(0); setMedicationList([]); }, 2000);
    } catch (error) { alert("Error."); }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full md:w-[70%] max-w-4xl h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-visible">
        
        {/* Header */}
        <header className="shrink-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl z-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-tighter">Medical Prescription</h2>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-[#AA4A3A] bg-[#AA4A3A]/10 px-3 py-1 rounded-full">Case ID: {patientId || '---'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between w-full max-w-lg mx-auto relative">
            {steps.map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                    activeStep === idx 
                    ? 'bg-[#1DB1A2] text-white ring-4 ring-[#1DB1A2]/20' 
                    : activeStep > idx ? 'bg-[#AA4A3A] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${activeStep === idx ? 'text-[#1DB1A2]' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
                {idx !== steps.length - 1 && (
                  <div className={`flex-1 h-[3px] mb-5 mx-2 rounded-full transition-colors duration-500 ${activeStep > idx ? 'bg-[#AA4A3A]' : 'bg-slate-100'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* Main Body */}
        <main className={`flex-1 px-6 py-4 bg-slate-50/30 relative ${activeStep === 1 ? 'overflow-visible' : 'overflow-y-auto'}`}>
          <div className="w-full h-full flex items-center justify-center relative">
            
            {activeStep === 0 && (
              <div className="w-full max-w-sm space-y-3 text-center">
                <div className="w-12 h-12 bg-[#1DB1A2]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <HiUser className="text-2xl text-[#1DB1A2]" />
                </div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Patient Profile</label>
                <select 
                  className="w-full p-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-[#1DB1A2] shadow-sm outline-none transition-all" 
                  value={patientId} 
                  onChange={e => onPatientChange(e.target.value)}
                >
                  {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.patientName}</option>)}
                </select>
              </div>
            )}

            {activeStep === 1 && (
              <div className="w-full max-w-sm flex flex-col min-h-[220px] relative z-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center mb-3">Search Medications</label>
                <div className="bg-white rounded-xl p-1 border-2 border-[#1DB1A2]/30 shadow-sm focus-within:border-[#1DB1A2] transition-all">
                  <TagInput suggestions={meds} value={medicationList} onChange={setMedicationList} />
                </div>
                <p className="text-[8px] text-slate-400 mt-2 font-bold uppercase tracking-tighter text-center">Type to search database</p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="w-full max-w-md space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center mb-2">Dosage Instructions</label>
                <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto px-2">
                  {medicationList.map((med) => (
                    <div key={med} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <span className="font-bold text-slate-700 text-xs flex-1">{med}</span>
                      <input 
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-20 text-center font-black text-[#1DB1A2] focus:border-[#1DB1A2] outline-none" 
                        placeholder="M-N-E" 
                        value={dosages[med] || ''} 
                        onChange={(e) => handleDosageChange(med, e.target.value)} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="w-full max-w-md space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-center">Physician Remarks</label>
                <textarea 
                  className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl h-24 resize-none text-xs font-medium outline-none focus:border-[#1DB1A2] shadow-sm" 
                  placeholder="Type additional advice..." 
                  value={remarks} 
                  onChange={e => setRemarks(e.target.value)} 
                />
                
                {/* Suggestions Tooltip */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[9px] font-black text-[#1DB1A2] uppercase tracking-widest">
                    <HiLightningBolt /> Quick Suggestions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => addSuggestion(s)}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:border-[#1DB1A2] hover:text-[#1DB1A2] transition-all active:scale-95 shadow-sm"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="w-full max-w-sm animate-in zoom-in-95">
                <div className="bg-white rounded-2xl border-2 border-[#1DB1A2]/20 shadow-lg overflow-hidden">
                  <div className="bg-[#1DB1A2] p-4 text-center">
                    <p className="text-[9px] font-black text-white/70 uppercase tracking-widest">Prescription For</p>
                    <h3 className="text-lg font-black text-white uppercase">{patientName}</h3>
                  </div>
                  <div className="p-4 space-y-2 max-h-[160px] overflow-y-auto">
                    {medicationList.map(m => (
                      <div key={m} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-600 text-[11px]">{m}</span>
                        <span className="font-black text-[#AA4A3A] text-xs">{dosages[m]}</span>
                      </div>
                    ))}
                    {remarks && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                             <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Advice</p>
                             <p className="text-[11px] text-slate-700 italic">"{remarks}"</p>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-white shrink-0 rounded-b-2xl z-10">
          <button 
            className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeStep === 0 ? 'invisible' : 'text-slate-400 hover:text-[#AA4A3A]'}`} 
            onClick={() => setActiveStep(s => s - 1)}
          >
            ← Back
          </button>
          <button 
            className="px-8 py-3 rounded-xl bg-[#1DB1A2] text-white font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl transition-all disabled:opacity-30 active:scale-95" 
            onClick={activeStep === steps.length - 1 ? () => setPreviewOpen(true) : () => setActiveStep(s => s + 1)} 
            disabled={!canNext() || loading}
          >
            {activeStep === steps.length - 1 ? 'Review Final' : 'Next Step →'}
          </button>
        </footer>
      </div>

      <Modal open={previewOpen} title="Send Prescription" onClose={() => setPreviewOpen(false)} onConfirm={confirmCreate}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#AA4A3A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineClipboardCheck className="text-3xl text-[#AA4A3A]" />
          </div>
          <h4 className="text-sm font-black text-slate-800 uppercase mb-2">Finalize Record</h4>
          <p className="text-xs text-slate-500 mb-6">Transmit prescription to <span className="text-[#AA4A3A] font-black">{patientName}</span>?</p>
          <button onClick={confirmCreate} className="w-full py-3 bg-[#AA4A3A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Confirm & Send</button>
        </div>
      </Modal>

      {isSuccess && (
        <div className="absolute inset-0 bg-white/95 z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
          <HiOutlineCheckCircle className="text-7xl text-[#1DB1A2] mb-4 animate-bounce" />
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Successfully Synced</h2>
        </div>
      )}
    </div>
  );
}