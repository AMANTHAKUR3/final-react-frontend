import React, { useEffect, useState, useMemo, useCallback } from 'react';
import StatusBadge from '../components/StatusBadge.jsx';
import pharmacy from '../assets/images/pharmacy.svg';
// import axios from 'axios';
import axios from '../../../../../src/api/http'

import {
  HiOutlineSearch,
  HiOutlineTrash,
  HiChevronDown,
  HiOutlineCube,
  HiOutlineInboxIn,
  HiUser,
  HiOutlineAnnotation
} from "react-icons/hi";

export default function PharmacyFulfillment() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);

  const getPrescriptions = useCallback(async (id) => {
    try {
      const response = await axios.get(`http://localhost:8020/Prescription/api/prescriptions?doctorId=${id}`);
      setPrescriptions(response.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    const doctorId = JSON.parse(localStorage.getItem("doctorUserId"));
    if (doctorId) getPrescriptions(Number(doctorId));
  }, [getPrescriptions]);

  const updateStatus = (id, newStatus) => {
    setPrescriptions(prev => prev.map(p => (p.id === id ? { ...p, status: newStatus } : p)));
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    try {
      await axios.delete(`http://localhost:8020/Prescription/api/prescriptions?id=${id}`);
      setPrescriptions(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert("Error.");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return prescriptions.filter(p => {
      const matchStatus = filter === 'All' || p.status?.toUpperCase() === filter.toUpperCase();
      const matchSearch = p.patientName?.toLowerCase().includes(q) || p.id.toString().includes(q);
      return matchStatus && matchSearch;
    });
  }, [prescriptions, filter, search]);

  return (
    <div className="relative h-[100dvh] w-full bg-slate-100/50 flex flex-col overflow-hidden font-sans">
      
      {/* HEADER: Centered at 70% */}
      <header className="shrink-0 pt-8 pb-4">
        <div className="w-full lg:w-[70%] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm hidden sm:block">
              <img src={pharmacy} alt="Pharmacy" className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">Fulfillment</h1>
              <p className="text-[9px] font-black text-[#1DB1A2] uppercase tracking-[0.3em] mt-1">Dispensing Queue</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Find Patient..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#1DB1A2] shadow-sm transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm shrink-0">
              {['All', 'Active', 'Done'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s === 'Done' ? 'Completed' : s)}
                  className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${
                    (filter === s || (filter === 'Completed' && s === 'Done'))
                      ? 'bg-[#1DB1A2] text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: Centered at 70% */}
      <main className="flex-1 overflow-hidden pb-10 px-4">
        <div className="w-full lg:w-[70%] h-full mx-auto bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
          
          {filtered.length > 0 ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-20 bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Meds & Dosage</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructions</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 align-top">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#1DB1A2]/10 flex items-center justify-center border border-[#1DB1A2]/20">
                              <HiUser className="text-xl text-[#1DB1A2]" />
                            </div>
                            <div>
                              <div className="font-black text-slate-800 text-sm uppercase tracking-tight leading-none mb-1">{p.patientName}</div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: #{p.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-6 align-top">
                          <div className="space-y-2">
                            {p.items?.map((item, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <HiOutlineCube className="text-[#1DB1A2]" size={14} />
                                <span className="text-[12px] font-bold text-slate-700">{item.medicineName}</span>
                                <span className="text-[9px] font-black text-[#AA4A3A] bg-[#AA4A3A]/5 px-2 py-0.5 rounded border border-[#AA4A3A]/10">{item.frequency || '1-0-1'}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-6 align-top max-w-[200px]">
                          {p.remarks && (
                            <div className="flex gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                              <HiOutlineAnnotation className="text-[#AA4A3A] shrink-0" size={14} />
                              <p className="text-[10px] text-slate-600 italic leading-tight">{p.remarks}</p>
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-6 text-center align-top">
                           <StatusBadge status={p.status} />
                        </td>

                        <td className="px-8 py-6 text-right align-top">
                          <div className="flex justify-end items-center gap-3">
                            <div className="relative">
                              <select 
                                value={p.status?.toUpperCase()}
                                onChange={e => updateStatus(p.id, e.target.value)}
                                className="appearance-none pl-4 pr-8 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[9px] font-black uppercase outline-none hover:border-[#1DB1A2] transition-all cursor-pointer"
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="COMPLETED">Done</option>
                              </select>
                              <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                            </div>
                            {p.status?.toUpperCase() === 'COMPLETED' && (
                              <button 
                                onClick={() => deleteRecord(p.id)} 
                                className="p-2 text-[#AA4A3A] hover:bg-[#AA4A3A]/10 rounded-lg transition-all"
                              >
                                <HiOutlineTrash size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW */}
              <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                {filtered.map(p => (
                  <div key={p.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1DB1A2]/10 flex items-center justify-center text-[#1DB1A2] font-bold border border-[#1DB1A2]/20"><HiUser size={20}/></div>
                        <div>
                          <div className="font-black text-slate-800 text-sm uppercase">{p.patientName}</div>
                          <div className="text-[9px] text-slate-400 font-bold">ID: #{p.id}</div>
                        </div>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="bg-slate-50/50 p-3 rounded-2xl space-y-2 border border-slate-100">
                       {p.items?.map((item, i) => (
                         <div key={i} className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                           <span>{item.medicineName}</span>
                           <span className="text-[#AA4A3A] font-black">{item.frequency}</span>
                         </div>
                       ))}
                    </div>
                    {p.remarks && (
                      <p className="text-[10px] text-slate-500 italic bg-amber-50/30 p-2 rounded-lg border-l-2 border-[#AA4A3A]">"{p.remarks}"</p>
                    )}
                    <div className="flex gap-2">
                       <div className="relative flex-1">
                          <select 
                            value={p.status?.toUpperCase()} 
                            onChange={e => updateStatus(p.id, e.target.value)}
                            className="w-full appearance-none pl-4 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="COMPLETED">Done</option>
                          </select>
                          <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" />
                       </div>
                       {p.status?.toUpperCase() === 'COMPLETED' && (
                         <button onClick={() => deleteRecord(p.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl border border-rose-100"><HiOutlineTrash size={18} /></button>
                       )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-slate-400">
              <HiOutlineInboxIn size={48} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Queue is Empty</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}