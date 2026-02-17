
// import React, { useState } from "react";

// export default function HeaderBar({ patient }) {
//   // Syncing local state with patient data provided by parent
//   const [status, setStatus] = useState(patient.status || "");
//   const [progress, setProgress] = useState(patient.progress || "In-progress");

//   // Clinical Status Color Logic
//   const getStatusConfig = (status) => {
//     switch (status) {
//       case "Inpatient": return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20";
//       case "Active": return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
//       case "Outpatient": return "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20";
//       case "Discharged": return "bg-slate-100 text-slate-600 border-slate-300 ring-slate-500/10";
//       case "Inactive": return "bg-slate-50 text-slate-400 border-slate-200 opacity-75 ring-transparent";
//       default: return "bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/10";
//     }
//   };

//   // Progress Color Logic
//   const getProgressConfig = (val) => {
//     return val === "Recovered" 
//       ? "bg-emerald-600 text-white border-emerald-700 ring-emerald-500/20" 
//       : "bg-blue-600 text-white border-blue-700 ring-blue-500/20"; 
//   };

//   return (
//     <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-wrap items-center justify-between gap-6 sticky top-0 z-50 shadow-sm">
      
//       {/* PATIENT IDENTITY SECTION */}
//       <div className="flex items-center gap-5">
//         <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-slate-200">
//           {(patient.name || patient.fullName || "P").charAt(0)}
//         </div>

//         <div className="space-y-1">
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//               {patient.name || patient.fullName}
//             </h1>
//             <span className="px-2 py-0.5 bg-slate-100 text-slate-500 font-mono text-[10px] font-bold rounded border border-slate-200 uppercase tracking-tighter">
//               ID: {patient.id || patient.patientId}
//             </span>
//           </div>

//           <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//             <div className="flex items-center gap-1.5">
//               <span className="text-gray-950">DOB:</span>
//               {patient.dateOfBirth || patient.dob}
//             </div>
//             <span className="text-slate-200">|</span>
            
//             <div className="flex items-center gap-1.5">
//               <span className="text-gray-950">GENDER:</span>
//               {patient.gender || patient.sex}
//             </div>
//             <span className="text-slate-200">|</span>
            
//             <div className="flex items-center gap-1.5">
//               <span className="text-gray-950">BLOOD:</span>
//               <span className="text-rose-600 font-black">
//                 {patient.bloodType || patient.bloodGroup}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* STATUS SECTION ONLY */}
//       <div className="flex items-center gap-6">
//         {/* Admission Status */}
//         <div className="flex flex-col items-end gap-1">
//           <span className="text-[9px] font-black text-gray-950 uppercase tracking-[0.2em] pr-1">Clinical Admission</span>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getStatusConfig(status)}`}
//           >
//             <option value="">Select Status</option>
//             <option value="Inpatient">Inpatient</option>
//             <option value="Outpatient">Outpatient</option>
//             <option value="Active">Active</option>
//             <option value="Discharged">Discharged</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>

//         {/* Progress Status */}
//         <div className="flex flex-col items-end gap-1">
//           <span className="text-[9px] font-black text-gray-950 uppercase tracking-[0.2em] pr-1">Progress Status</span>
//           <select
//             value={progress}
//             onChange={(e) => setProgress(e.target.value)}
//             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getProgressConfig(progress)}`}
//           >
//             <option value="In-progress">In-progress</option>
//             <option value="Recovered">Recovered</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";

// // Assuming onUpdate is passed from parent to handle the actual API logic
// export default function HeaderBar({ patient, onUpdate }) {
//   const [status, setStatus] = useState(patient.status || "");
//   const [progress, setProgress] = useState(patient.progress || "In-progress");

//   // Clinical Status Color Logic
//   const getStatusConfig = (status) => {
//     switch (status) {
//       case "Inpatient": return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20";
//       case "Active": return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
//       case "Outpatient": return "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20";
//       case "Discharged": return "bg-slate-100 text-slate-950 border-slate-300 ring-slate-500/10";
//       default: return "bg-slate-100 text-slate-900 border-slate-200 ring-slate-500/10";
//     }
//   };

//   // Progress Color Logic
//   const getProgressConfig = (val) => {
//     return val === "Recovered" 
//       ? "bg-emerald-600 text-white border-emerald-700 ring-emerald-500/20" 
//       : "bg-blue-600 text-white border-blue-700 ring-blue-500/20"; 
//   };

//   // AUTOSAVE HANDLERS
//   const handleStatusChange = (newStatus) => {
//     setStatus(newStatus);
//     // Trigger immediate save to parent/API
//     if (onUpdate) onUpdate({ ...patient, status: newStatus });
//   };

//   const handleProgressChange = (newProgress) => {
//     setProgress(newProgress);
//     // Trigger immediate save to parent/API
//     if (onUpdate) onUpdate({ ...patient, progress: newProgress });
//   };

//   return (
//     <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-wrap items-center justify-between gap-6 sticky top-0 z-50 shadow-sm">
      
//       {/* PATIENT IDENTITY SECTION */}
//       <div className="flex items-center gap-5">
//         <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-slate-200">
//           {(patient.name || patient.fullName || "P").charAt(0)}
//         </div>

//         <div className="space-y-1">
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//               {patient.name || patient.fullName}
//             </h1>
//             <span className="px-2 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded border border-slate-900 uppercase tracking-tighter shadow-sm">
//               ID: {patient.id || patient.patientId}
//             </span>
//           </div>

//           <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-wider">
//             <div className="flex items-center gap-1.5">
//               <span className="text-slate-950">DOB:</span>
//               <span className="text-slate-700">{patient.dateOfBirth || patient.dob}</span>
//             </div>
//             <span className="text-slate-300 font-normal">|</span>
            
//             <div className="flex items-center gap-1.5">
//               <span className="text-slate-950">GENDER:</span>
//               <span className="text-slate-700">{patient.gender || patient.sex}</span>
//             </div>
//             <span className="text-slate-300 font-normal">|</span>
            
//             <div className="flex items-center gap-1.5">
//               <span className="text-slate-950">BLOOD:</span>
//               <span className="text-rose-600 font-black">
//                 {patient.bloodType || patient.bloodGroup}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* STATUS SECTION - AUTOSAVING */}
//       <div className="flex items-center gap-6">
//         <div className="flex flex-col items-end gap-1">
//           <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.2em] pr-1">Clinical Admission</span>
//           <select
//             value={status}
//             onChange={(e) => handleStatusChange(e.target.value)}
//             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getStatusConfig(status)}`}
//           >
//             <option value="">Select Status</option>
//             <option value="Inpatient">Inpatient</option>
//             <option value="Outpatient">Outpatient</option>
//             <option value="Active">Active</option>
//             <option value="Discharged">Discharged</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>

//         <div className="flex flex-col items-end gap-1">
//           <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.2em] pr-1">Progress Status</span>
//           <select
//             value={progress}
//             onChange={(e) => handleProgressChange(e.target.value)}
//             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getProgressConfig(progress)}`}
//           >
//             <option value="In-progress">In-progress</option>
//             <option value="Recovered">Recovered</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useState } from "react";
// import axios from "axios";

// export default function HeaderBar({ patient }) {
//   const [status, setStatus] = useState(patient.status || patient.patientStatus || "ACTIVE");
//   const [progress, setProgress] = useState(patient.progress || patient.outcome || "ON_TREATMENT");
//   const [isUpdating, setIsUpdating] = useState(false);

//   const getStatusConfig = (status) => {
//     switch (status) {
//       case "ACTIVE": return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
//       case "INPATIENT": return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20";
//       case "OUTPATIENT": return "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20";
//       case "DISCHARGED": return "bg-slate-100 text-slate-950 border-slate-300 ring-slate-500/10";
//       case "INACTIVE": return "bg-slate-100 text-slate-900 border-slate-200 ring-slate-500/10";
//       default: return "bg-slate-100 text-slate-900 border-slate-200 ring-slate-500/10";
//     }
//   };

//   const getProgressConfig = (val) => {
//     return val === "RECOVERED" 
//       ? "bg-emerald-600 text-white border-emerald-700 ring-emerald-500/20" 
//       : "bg-blue-600 text-white border-blue-700 ring-blue-500/20"; 
//   };

//   /**
//    * UPDATED: Uses update-clinical API to persist patient status and outcome changes
//    * Endpoint: PUT /api/ehr/update-clinical
//    * Required fields: patientId, doctorId
//    * Optional fields: patientStatus (enum), outcome (enum)
//    */
//   const persistStatusUpdate = async (updatedFields) => {
//     try {
//       setIsUpdating(true);
      
//       // Get doctorId from localStorage
//       const doctorUserId = localStorage.getItem("doctorUserId");
//       const doctorId = doctorUserId ? Number(JSON.parse(doctorUserId)) : 1;
      
//       // Ensure patientId is a number
//       const patientId = Number(patient.id || patient.patientId);
      
//       // Prepare payload according to UpdateClinicalDto
//       const payload = {
//         patientId: patientId,
//         doctorId: doctorId,
//         recordId: patient.recordId || null,
//       };

//       // Only include the field being updated
//       if (updatedFields.status !== undefined) {
//         payload.patientStatus = updatedFields.status;
//       }
//       if (updatedFields.outcome !== undefined) {
//         payload.outcome = updatedFields.outcome;
//       }
      
//       // API Gateway URL for update-clinical endpoint
//       await axios.put("http://localhost:8020/ehr/api/ehr/update-clinical", payload);
      
//     } catch (error) {
//       console.error("Clinical update failed:", error);
      
//       // Check for specific error about missing records
//       if (error.response?.data?.includes?.("No records found")) {
//         alert("⚠️ Cannot update outcome: This patient has no medical records yet. Please create a diagnosis first.");
//       }
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleStatusChange = (newStatus) => {
//     setStatus(newStatus);
//     persistStatusUpdate({ status: newStatus });
//   };

//   const handleProgressChange = (newProgress) => {
//     setProgress(newProgress);
//     persistStatusUpdate({ outcome: newProgress });
//   };

//   return (
//     <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-wrap items-center justify-between gap-6 sticky top-0 z-50 shadow-sm">
      
//       {/* PATIENT IDENTITY SECTION */}
//       <div className="flex items-center gap-5">
//         <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-slate-200">
//           {(patient.name || patient.fullName || "P").charAt(0)}
//         </div>

//         <div className="space-y-1">
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//               {patient.name || patient.fullName}
//             </h1>
//             <span className="px-2 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded border border-slate-900 uppercase tracking-tighter shadow-sm flex items-center gap-2">
//               ID: {patient.id || patient.patientId}
//               {isUpdating && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>}
//             </span>
//           </div>

//           <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-wider">
//             <div className="flex items-center gap-1.5">
//               <span className="text-slate-950">DOB:</span>
//               <span className="text-slate-700">{patient.dateOfBirth || patient.dob}</span>
//             </div>
//             <span className="text-slate-300 font-normal">|</span>
            
//             <div className="flex items-center gap-1.5">
//               <span className="text-slate-950">GENDER:</span>
//               <span className="text-slate-700">{patient.gender || patient.sex}</span>
//             </div>
//             <span className="text-slate-300 font-normal">|</span>
            
//             <div className="flex items-center gap-1.5">
//               <span className="text-slate-950">BLOOD:</span>
//               <span className="text-rose-600 font-black">
//                 {patient.bloodType || patient.bloodGroup}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* STATUS SECTION - AUTOSAVING */}
//       <div className="flex items-center gap-6">
//         <div className="flex flex-col items-end gap-1">
//           <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.2em] pr-1">Patient Status</span>
//           <select
//             value={status}
//             disabled={isUpdating}
//             onChange={(e) => handleStatusChange(e.target.value)}
//             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getStatusConfig(status)} disabled:opacity-50 disabled:cursor-not-allowed`}
//           >
//             <option value="">Select Status</option>
//             <option value="ACTIVE">Active</option>
//             <option value="INPATIENT">Inpatient</option>
//             <option value="OUTPATIENT">Outpatient</option>
//             <option value="DISCHARGED">Discharged</option>
//             <option value="INACTIVE">Inactive</option>
//           </select>
//         </div>

//         <div className="flex flex-col items-end gap-1">
//           <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.2em] pr-1">Outcome</span>
//           <select
//             value={progress}
//             disabled={isUpdating}
//             onChange={(e) => handleProgressChange(e.target.value)}
//             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getProgressConfig(progress)} disabled:opacity-50 disabled:cursor-not-allowed`}
//           >
//             <option value="ON_TREATMENT">On Treatment</option>
//             <option value="RECOVERED">Recovered</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import axios from "axios";

// export default function HeaderBar({ patient }) {
//   const [status, setStatus] = useState(patient.status || patient.patientStatus || "ACTIVE");
//   const [progress, setProgress] = useState(patient.progress || patient.outcome || "ON_TREATMENT");
//   const [isUpdating, setIsUpdating] = useState(false);

//   const getStatusConfig = (status) => {
//     switch (status) {
//       case "ACTIVE": return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
//       case "INPATIENT": return "bg-teal-50 text-teal-700 border-teal-200 ring-teal-500/20";
//       case "OUTPATIENT": return "bg-cyan-50 text-cyan-700 border-cyan-200 ring-cyan-500/20";
//       case "DISCHARGED": return "bg-slate-100 text-slate-950 border-slate-300 ring-slate-500/10";
//       case "INACTIVE": return "bg-slate-100 text-slate-900 border-slate-200 ring-slate-500/10";
//       default: return "bg-slate-100 text-slate-900 border-slate-200 ring-slate-500/10";
//     }
//   };

//   const getProgressConfig = (val) => {
//     return val === "RECOVERED" 
//       ? "bg-emerald-600 text-white border-emerald-700 ring-emerald-500/20" 
//       : "bg-teal-600 text-white border-teal-700 ring-teal-500/20"; 
//   };

//   /**
//    * UPDATED: Uses update-clinical API to persist patient status and outcome changes
//    * Endpoint: PUT /api/ehr/update-clinical
//    * Required fields: patientId, doctorId
//    * Optional fields: patientStatus (enum), outcome (enum)
//    */
//   const persistStatusUpdate = async (updatedFields) => {
//     try {
//       setIsUpdating(true);
      
//       // Get doctorId from localStorage
//       const doctorUserId = localStorage.getItem("doctorUserId");
//       const doctorId = doctorUserId ? Number(JSON.parse(doctorUserId)) : 1;
      
//       // Ensure patientId is a number
//       const patientId = Number(patient.id || patient.patientId);
      
//       // Prepare payload according to UpdateClinicalDto
//       const payload = {
//         patientId: patientId,
//         doctorId: doctorId,
//         recordId: patient.recordId || null,
//       };

//       // Only include the field being updated
//       if (updatedFields.status !== undefined) {
//         payload.patientStatus = updatedFields.status;
//       }
//       if (updatedFields.outcome !== undefined) {
//         payload.outcome = updatedFields.outcome;
//       }
      
//       // API Gateway URL for update-clinical endpoint
//       await axios.put("http://localhost:8020/ehr/api/ehr/update-clinical", payload);
      
//     } catch (error) {
//       console.error("Clinical update failed:", error);
      
//       // Check for specific error about missing records
//       if (error.response?.data?.includes?.("No records found")) {
//         alert("⚠️ Cannot update outcome: This patient has no medical records yet. Please create a diagnosis first.");
//       }
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleStatusChange = (newStatus) => {
//     setStatus(newStatus);
//     persistStatusUpdate({ status: newStatus });
//   };

//   const handleProgressChange = (newProgress) => {
//     setProgress(newProgress);
//     persistStatusUpdate({ outcome: newProgress });
//   };

//   return (
//     <div className="bg-white border-b border-emerald-200 px-6 py-5 flex flex-wrap items-center justify-between gap-6 sticky top-0 z-50 shadow-sm">
      
//       {/* PATIENT IDENTITY SECTION */}
//       <div className="flex items-center gap-5">
//         <div className="h-14 w-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-200">
//           {(patient.name || patient.fullName || "P").charAt(0)}
//         </div>

//         <div className="space-y-1">
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
//               {patient.name || patient.fullName}
//             </h1>
//             <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[10px] font-bold rounded border border-emerald-600 uppercase tracking-tighter shadow-sm flex items-center gap-2">
//               ID: {patient.id || patient.patientId}
//               {isUpdating && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>}
//             </span>
//           </div>

//           <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-wider">
//             <div className="flex items-center gap-1.5">
//               <span className="text-slate-950">DOB:</span>
//               <span className="text-slate-700">{patient.dateOfBirth || patient.dob}</span>
//             </div>
//             <span className="text-slate-300 font-normal">|</span>
            
//             <div className="flex items-center gap-1.5">
//               <span className="text-slate-950">GENDER:</span>
//               <span className="text-slate-700">{patient.gender || patient.sex}</span>
//             </div>
//             <span className="text-slate-300 font-normal">|</span>
            
//             <div className="flex items-center gap-1.5">
//               <span className="text-slate-950">BLOOD:</span>
//               <span className="text-rose-600 font-black">
//                 {patient.bloodType || patient.bloodGroup}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* STATUS SECTION - AUTOSAVING */}
//       <div className="flex items-center gap-6">
//         <div className="flex flex-col items-end gap-1">
//           <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.2em] pr-1">Patient Status</span>
//           <select
//             value={status}
//             disabled={isUpdating}
//             onChange={(e) => handleStatusChange(e.target.value)}
//             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getStatusConfig(status)} disabled:opacity-50 disabled:cursor-not-allowed`}
//           >
//             <option value="">Select Status</option>
//             <option value="ACTIVE">Active</option>
//             <option value="INPATIENT">Inpatient</option>
//             <option value="OUTPATIENT">Outpatient</option>
//             <option value="DISCHARGED">Discharged</option>
//             <option value="INACTIVE">Inactive</option>
//           </select>
//         </div>

//         <div className="flex flex-col items-end gap-1">
//           <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.2em] pr-1">Outcome</span>
//           <select
//             value={progress}
//             disabled={isUpdating}
//             onChange={(e) => handleProgressChange(e.target.value)}
//             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getProgressConfig(progress)} disabled:opacity-50 disabled:cursor-not-allowed`}
//           >
//             <option value="ON_TREATMENT">On Treatment</option>
//             <option value="RECOVERED">Recovered</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";

export default function HeaderBar({ patient }) {
  const [status, setStatus] = useState(patient.status || patient.patientStatus || "ACTIVE");
  const [progress, setProgress] = useState(patient.progress || patient.outcome || "ON_TREATMENT");
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case "ACTIVE": return "bg-[#1DB1A2]/10 text-[#1DB1A2] border-[#1DB1A2]/30 ring-[#1DB1A2]/20";
      case "INPATIENT": return "bg-[#1DB1A2]/20 text-[#1DB1A2] border-[#1DB1A2]/40 ring-[#1DB1A2]/20";
      case "OUTPATIENT": return "bg-[#1DB1A2]/15 text-[#1DB1A2] border-[#1DB1A2]/35 ring-[#1DB1A2]/20";
      case "DISCHARGED": return "bg-slate-100 text-slate-950 border-slate-300 ring-slate-500/10";
      case "INACTIVE": return "bg-slate-100 text-slate-900 border-slate-200 ring-slate-500/10";
      default: return "bg-slate-100 text-slate-900 border-slate-200 ring-slate-500/10";
    }
  };

  const getProgressConfig = (val) => {
    return val === "RECOVERED" 
      ? "bg-[#1DB1A2] text-white border-[#1DB1A2] ring-[#1DB1A2]/20" 
      : "bg-[#aa4a3a] text-white border-[#aa4a3a] ring-[#aa4a3a]/20"; 
  };

  /**
   * UPDATED: Uses update-clinical API to persist patient status and outcome changes
   * Endpoint: PUT /api/ehr/update-clinical
   * Required fields: patientId, doctorId
   * Optional fields: patientStatus (enum), outcome (enum)
   */
  const persistStatusUpdate = async (updatedFields) => {
    try {
      setIsUpdating(true);
      
      // Get doctorId from localStorage
      const doctorUserId = localStorage.getItem("doctorUserId");
      const doctorId = doctorUserId ? Number(JSON.parse(doctorUserId)) : 1;
      
      // Ensure patientId is a number
      const patientId = Number(patient.id || patient.patientId);
      
      // Prepare payload according to UpdateClinicalDto
      const payload = {
        patientId: patientId,
        doctorId: doctorId,
        recordId: patient.recordId || null,
      };

      // Only include the field being updated
      if (updatedFields.status !== undefined) {
        payload.patientStatus = updatedFields.status;
      }
      if (updatedFields.outcome !== undefined) {
        payload.outcome = updatedFields.outcome;
      }
      
      // API Gateway URL for update-clinical endpoint
      await axios.put("http://localhost:8020/ehr/api/ehr/update-clinical", payload);
      
    } catch (error) {
      console.error("Clinical update failed:", error);
      
      // Check for specific error about missing records
      if (error.response?.data?.includes?.("No records found")) {
        alert("⚠️ Cannot update outcome: This patient has no medical records yet. Please create a diagnosis first.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    persistStatusUpdate({ status: newStatus });
  };

  const handleProgressChange = (newProgress) => {
    setProgress(newProgress);
    persistStatusUpdate({ outcome: newProgress });
  };

  return (
    <div className="bg-white border-b border-[#1DB1A2]/30 px-6 py-5 flex flex-wrap items-center justify-between gap-6 sticky top-0 z-50 shadow-sm">
      
      {/* PATIENT IDENTITY SECTION */}
      <div className="flex items-center gap-5">
        <div className="h-14 w-14 rounded-2xl bg-[#1DB1A2] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#1DB1A2]/20">
          {(patient.name || patient.fullName || "P").charAt(0)}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {patient.name || patient.fullName}
            </h1>
            <span className="px-2 py-0.5 bg-[#1DB1A2] text-white font-mono text-[10px] font-bold rounded border border-[#1DB1A2] uppercase tracking-tighter shadow-sm flex items-center gap-2">
              ID: {patient.id || patient.patientId}
              {isUpdating && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-950">DOB:</span>
              <span className="text-slate-700">{patient.dateOfBirth || patient.dob}</span>
            </div>
            <span className="text-slate-300 font-normal">|</span>
            
            <div className="flex items-center gap-1.5">
              <span className="text-slate-950">GENDER:</span>
              <span className="text-slate-700">{patient.gender || patient.sex}</span>
            </div>
            <span className="text-slate-300 font-normal">|</span>
            
            <div className="flex items-center gap-1.5">
              <span className="text-slate-950">BLOOD:</span>
              <span className="text-[#aa4a3a] font-black">
                {patient.bloodType || patient.bloodGroup}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS SECTION - AUTOSAVING */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.2em] pr-1">Patient Status</span>
          <select
            value={status}
            disabled={isUpdating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getStatusConfig(status)} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INPATIENT">Inpatient</option>
            <option value="OUTPATIENT">Outpatient</option>
            <option value="DISCHARGED">Discharged</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.2em] pr-1">Outcome</span>
          <select
            value={progress}
            disabled={isUpdating}
            onChange={(e) => handleProgressChange(e.target.value)}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ring-4 cursor-pointer transition-all ${getProgressConfig(progress)} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="ON_TREATMENT">On Treatment</option>
            <option value="RECOVERED">Recovered</option>
          </select>
        </div>
      </div>
    </div>
  );
}