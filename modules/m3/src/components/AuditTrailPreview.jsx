
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../../../../src/api/http'
export default function AuditTrailPreview({ patientId, refreshKey }) {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8020/ehr/api/ehr/patient-ehr`, {
          params: { patientId: patientId }
        });
        setItems(response.data.auditHistory || []);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditLogs();
  }, [patientId, refreshKey]);

  const recent = items.slice(0, 5);
  const hasMore = items.length > 5;

  const getActionColor = (action) => {
    const act = (action || "").toLowerCase();
    if (act.includes('delete')) return "text-rose-600";
    if (act.includes('update') || act.includes('add')) return "text-emerald-600";
    return "text-emerald-500";
  };

  const LogRow = ({ row, idx }) => (
    <tr key={idx} className="hover:bg-emerald-50/30 transition-colors border-b-2 border-emerald-50 last:border-0">
      <td className="px-8 py-4">
        <span className={`text-[11px] font-black uppercase tracking-widest ${getActionColor(row.action)}`}>
          {row.action}
        </span>
      </td>
      <td className="px-8 py-4 text-center text-xs font-black text-slate-900">
        {row.time ? new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
      </td>
      <td className="px-8 py-4 text-right text-xs text-slate-900 font-black italic">
        {row.logEntry || 'SYSTEM EVENT'}
      </td>
    </tr>
  );

  return (
    /* OUTER WRAPPER: Reduced px-2 to push content closer to the edges */
    <div className="w-full flex justify-center px-2 md:px-4">
      
      {/* COMPONENT CONTAINER: max-w-[98%] allows it to take up almost the full screen width */}
      <div className="bg-white border-2 border-emerald-100 rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 overflow-hidden flex flex-col w-full max-w-[98%] mt-6">
        
        {/* HEADER SECTION */}
        <div className="px-8 py-5 border-b-2 border-emerald-50 flex items-center justify-between bg-emerald-50/20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-emerald-600 rounded-full"></div>
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-tighter">Activity Audit</h3>
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Clinical Security Log</p>
            </div>
          </div>
          {loading && (
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        {/* TABLE SECTION */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y-2 divide-emerald-50">
              {recent.map((row, idx) => <LogRow key={idx} row={row} />)}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-16 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    No Activity Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER ACTION */}
        {hasMore && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-5 text-[11px] font-black text-emerald-700 uppercase tracking-widest border-t-2 border-emerald-50 hover:bg-emerald-50/50 transition-all active:bg-emerald-100"
          >
            View Full Audit History ({items.length} Events) →
          </button>
        )}

        {/* MODAL: Full History */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[95%] max-h-[90vh] rounded-[3rem] border-2 border-emerald-100 shadow-2xl overflow-hidden flex flex-col">
              <div className="p-8 border-b-2 border-emerald-50 flex justify-between items-center bg-white">
                <h2 className="font-black text-slate-900 uppercase tracking-tight text-xl">Full Security Audit</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-black border-2 border-emerald-100 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 md:p-10 bg-emerald-50/10">
                <div className="bg-white rounded-[2rem] border-2 border-emerald-50 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <tbody className="divide-y-2 divide-emerald-50">
                      {items.map((row, idx) => <LogRow key={idx} row={row} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}