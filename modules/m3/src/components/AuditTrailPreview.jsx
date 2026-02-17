// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function AuditTrailPreview({ patientId, refreshKey }) {
//   const [items, setItems] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchAuditLogs = async () => {
//       if (!patientId) return;
      
//       try {
//         setLoading(true);
//         // GET request to fetch live audit history
//         const response = await axios.get(`http://localhost:8020/ehr/api/ehr/patient-ehr`, {
//           params: { patientId: patientId }
//         });
        
//         setItems(response.data.auditHistory || []);
//       } catch (error) {
//         console.error("Failed to fetch audit logs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAuditLogs();
    
//     // DEPENDENCIES: 
//     // [] makes it run on page load.
//     // [refreshKey] makes it run whenever a new result is added.
//   }, [patientId, refreshKey]); 

//   const recent = items.slice(0, 5);
//   const hasMore = items.length > 5;

//   const getActionColor = (action) => {
//     const act = (action || "").toLowerCase();
//     if (act.includes('delete')) return "text-rose-600";
//     if (act.includes('update') || act.includes('add')) return "text-amber-600";
//     return "text-blue-600";
//   };

//   const LogRow = ({ row, idx }) => (
//     <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
//       <td className="px-8 py-3 font-bold text-slate-700 text-xs">{row.user}</td>
//       <td className="px-8 py-3">
//         <span className={`text-[11px] font-black uppercase tracking-tighter ${getActionColor(row.action)}`}>
//           {row.action}
//         </span>
//       </td>
//       <td className="px-8 py-3 text-center text-[10px] font-bold text-slate-500">
//         {row.time ? new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
//       </td>
//       <td className="px-8 py-3 text-right text-xs text-slate-500 italic">
//         {row.logEntry || 'System event'}
//       </td>
//     </tr>
//   );

//   return (
//     <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col w-full mt-4">
//       <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
//         <div className="flex items-center gap-2">
//           <div className="w-1.5 h-4 bg-slate-800 rounded-full"></div>
//           <h3 className="font-black text-slate-800 text-sm uppercase">Activity Audit</h3>
//         </div>
//         {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <tbody className="divide-y divide-slate-50">
//             {recent.map((row, idx) => <LogRow key={idx} row={row} />)}
//             {!loading && items.length === 0 && (
//               <tr><td colSpan="4" className="text-center py-10 text-slate-400 italic text-xs">No records found.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {hasMore && (
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="p-3 text-[11px] font-black text-blue-600 uppercase border-t border-slate-100 hover:bg-slate-50"
//         >
//           View Full Audit ({items.length}) →
//         </button>
//       )}

//       {/* Full Audit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
//           <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl overflow-hidden flex flex-col">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="font-black">Full Security Audit</h2>
//               <button onClick={() => setIsModalOpen(false)}>✕</button>
//             </div>
//             <div className="overflow-y-auto flex-1">
//               <table className="w-full text-left">
//                 <tbody>{items.map((row, idx) => <LogRow key={idx} row={row} />)}</tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function AuditTrailPreview({ patientId, refreshKey }) {
//   const [items, setItems] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchAuditLogs = async () => {
//       if (!patientId) return;
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:8020/ehr/api/ehr/patient-ehr`, {
//           params: { patientId: patientId }
//         });
//         setItems(response.data.auditHistory || []);
//       } catch (error) {
//         console.error("Failed to fetch audit logs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAuditLogs();
//   }, [patientId, refreshKey]);

//   const recent = items.slice(0, 5);
//   const hasMore = items.length > 5;

//   const getActionColor = (action) => {
//     const act = (action || "").toLowerCase();
//     if (act.includes('delete')) return "bg-rose-50 text-rose-600 border-rose-100";
//     if (act.includes('update') || act.includes('add')) return "bg-amber-50 text-amber-600 border-amber-100";
//     return "bg-blue-50 text-blue-600 border-blue-100";
//   };

//   const LogRow = ({ row, idx }) => (
//     <tr key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
//       <td className="px-4 md:px-8 py-4">
//         <div className="font-bold text-slate-800 text-xs md:text-sm">{row.user}</div>
//         <div className="hidden xs:block text-[9px] font-bold text-slate-400 uppercase tracking-tight">Authorized User</div>
//       </td>
//       <td className="px-4 md:px-8 py-4">
//         <span className={`px-2 py-0.5 rounded-full border text-[9px] md:text-[12px] font-black uppercase tracking-tight ${getActionColor(row.action)}`}>
//           {row.action}
//         </span>
//       </td>
//       <td className="hidden sm:table-cell px-4 md:px-8 py-4 text-center text-[16px] font-bold text-black-500 font-mono">
//         {row.time ? new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
//       </td>
//       <td className="px-4 md:px-8 py-4 text-right">
//         <div className="text-sm text-black-600 italic line-clamp-1">{row.logEntry || 'System event'}</div>
//         <div className="sm:hidden text-[9px] font-mono text-slate-400">
//            {row.time ? new Date(row.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
//         </div>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="border border-slate-200 mx-2 md:mx-8 my-4 card shadow-sm rounded-2xl flex flex-col h-full bg-white overflow-hidden">
      
//       {/* Header */}
//       <div className="px-4 md:px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
//         <div className="flex items-center gap-3">
//           <div className="w-1.5 h-5 bg-slate-900 rounded-full"></div>
//           <div>
//             <h3 className="font-black text-slate-900 text-xs md:text-sm uppercase tracking-tight">Activity Audit</h3>
//             <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Security Tracking</p>
//           </div>
//         </div>
//         {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
//       </div>

//       {/* Table Body */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <tbody className="divide-y divide-slate-50">
//             {recent.map((row, idx) => <LogRow key={idx} row={row} />)}
//             {!loading && items.length === 0 && (
//               <tr><td colSpan="4" className="text-center py-12 text-slate-400 italic text-xs">No activity logs recorded.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer / View Full History */}
//       {hasMore && (
//         <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-5 flex justify-center items-center">
//           <button 
//             onClick={() => setIsModalOpen(true)} 
//             className="
//               group flex items-center gap-3 py-2.5 px-6 
//               bg-white border border-slate-200 rounded-full
//               text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-widest 
//               hover:border-blue-400 hover:text-blue-600 hover:shadow-sm
//               transition-all duration-200 active:scale-95 cursor-pointer
//             "
//           >
//             <span>View Security Log</span>
//             <span className="bg-slate-100 group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-600 px-2 py-0.5 rounded-md text-[10px] border border-slate-200 group-hover:border-blue-100 transition-colors">
//               {items.length}
//             </span>
//             <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
//           </button>
//         </div>
//       )}

//       {/* Full Audit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 md:p-8 bg-slate-900/60 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-5xl h-full max-h-[95vh] md:max-h-[90vh] rounded-2xl md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
//             <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
//               <div>
//                 <h2 className="text-base md:text-xl font-black text-slate-900 tracking-tight">Full Security Audit</h2>
//                 <p className="text-[10px] font-bold text-sky-800 uppercase tracking-widest">Access & Modification Log</p>
//               </div>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="w-8 h-8 md:w-10 md:h-10 rounded-full cursor-pointer bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all border border-slate-200"
//               >✕</button>
//             </div>
            
//             <div className="overflow-y-auto flex-1 p-2 md:p-4 bg-slate-50/30">
//               <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//                 <table className="w-full text-left">
//                   <thead className="bg-slate-50/80 border-b border-slate-100">
//                     <tr>
//                       <th className="px-4 md:px-8 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">User</th>
//                       <th className="px-4 md:px-8 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
//                       <th className="hidden sm:table-cell px-4 md:px-8 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Time</th>
//                       <th className="px-4 md:px-8 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Detail</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {items.map((row, idx) => <LogRow key={idx} row={row} />)}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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