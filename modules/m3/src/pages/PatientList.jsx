import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

export default function PatientList() {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState([])
  const navigate = useNavigate()

  // Fetch Patients from API Gateway
  useEffect(() => {
    const doctorId=localStorage.getItem("doctorUserId")
    const getPatients = async (id) => {
      try {
        const response = await axios.get("http://localhost:8020/ehr/api/ehr/dashboard", {
          params: { doctorId: id }
        });
        setRows(response.data)
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    getPatients(Number(JSON.parse(localStorage.getItem("doctorUserId"))));
  }, [])

  const filteredRows = useMemo(() => {
    if (!q.trim()) return rows
    const needle = q.toLowerCase()
    return rows.filter(p => (
      (p.fullName || '').toLowerCase().includes(needle) || 
      (p.patientId || '').toString().toLowerCase().includes(needle) || 
      (p.primaryDiagnosis || '').toLowerCase().includes(needle) 
    ))
  }, [q, rows])

  const getStatusStyles = (status) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border "
    switch (status) {
      case 'ACTIVE': 
        return base + "bg-[#1DB1A2]/10 text-[#1DB1A2] border-[#1DB1A2]/30"
      case 'INPATIENT': 
        return base + "bg-[#1DB1A2]/20 text-[#1DB1A2] border-[#1DB1A2]/40"
      case 'DISCHARGED': 
        return base + "bg-slate-100 text-slate-600 border-slate-300"
      default: 
        return base + "bg-slate-50 text-slate-500 border-slate-200"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 bg-gradient-to-br from-[#1DB1A2]/5 to-white min-h-screen">
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#1DB1A2]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-6 bg-[#1DB1A2] rounded-full"></div>
            <h1 className="text-2xl font-bold text-slate-800">Patient Directory</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Centralized Electronic Health Records • <span className="text-[#1DB1A2]">{rows.length} Total Records</span>
          </p>
        </div>

        
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-[#1DB1A2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          className="w-full bg-white border border-[#1DB1A2]/30 rounded-2xl pl-12 pr-4 py-4 text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:border-[#1DB1A2] focus:ring-4 focus:ring-[#1DB1A2]/10 transition-all shadow-sm" 
          placeholder="Search patient name, ID, or diagnosis" 
          value={q} 
          onChange={e => setQ(e.target.value)} 
        />
      </div>

      {/* PATIENT TABLE */}
      <div className="bg-white border border-[#1DB1A2]/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1DB1A2]/5 border-b border-[#1DB1A2]/20 text-slate-600">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em]">Patient Info</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em]">Demographics</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em]">Clinical Primary</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.15em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRows.map(r => (
                <tr key={r.patientId} className="hover:bg-[#1DB1A2]/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-[#1DB1A2] flex items-center justify-center text-white font-black text-sm shadow-md">
                        {(r.fullName || 'P').charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">{r.fullName}</div>
                        <div className="text-[13px] font-mono font-bold text-[#1DB1A2] uppercase mt-0.5">
                          ID: {r.patientId}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 text-slate-700">
                      <div className="flex items-center text-[13px]">
                        <span className="font-bold w-16">Gender:</span>
                        <span className="uppercase tracking-tight">{r.gender}</span>
                      </div>
                      <div className="flex items-center text-[13px]">
                        <span className="font-bold w-16">DOB:</span>
                        <span>{r.dateOfBirth}</span>
                      </div>
                      <div className="mt-0.5 flex items-center">
                        <span className="font-bold text-[13px] w-16">Blood:</span>
                        <span className="text-[9px] uppercase text-[#aa4a3a] bg-[#aa4a3a]/10 px-2 py-0.5 rounded border border-[#aa4a3a]/30 font-bold">
                          {r.bloodType}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className={getStatusStyles(r.status)}>
                      {r.status || 'N/A'}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-800 truncate max-w-[200px]">
                      {r.primaryDiagnosis || 'No Diagnosis'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">
                      Updated: {r.clinicalLastUpdated ? new Date(r.clinicalLastUpdated).toLocaleDateString('en-IN') : 'N/A'}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button 
                      className="cursor-pointer bg-[#1DB1A2] hover:bg-[#1DB1A2]/90 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-[#1DB1A2]/20" 
                      onClick={() => navigate(`/EHR/patient/${r.patientId}`, { state: { r } })}
                    >
                      Open File
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}