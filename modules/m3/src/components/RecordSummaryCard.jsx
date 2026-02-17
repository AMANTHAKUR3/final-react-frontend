// export default function RecordSummaryCard({ summary }){
//   return (
//     <div className="card p-4">
//       <div className="flex items-center justify-between">
//         <div>
//           {/* Removed recordId and updated the label to Last Updated */}
//           <div className="card-title text-slate-900 font-bold">Clinical Summary</div>
//           <div className="card-subtitle text-slate-500 text-xs">
//             Last Updated: {summary.updatedAt ? new Date(summary.updatedAt).toLocaleString('en-IN') : 'N/A'}
//           </div>
//         </div>
        
//         <div className="text-right">
//           <div className="text-sm">
//             <span className="font-medium text-slate-700">Primary Diagnosis:</span> 
//             <span className="ml-2 font-bold text-blue-600">{summary.primaryDiagnosis}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function RecordSummaryCard({ summary }){
//   return (
//     <div className="card p-4">
//       <div className="flex items-center justify-between">
//         <div>
//           {/* Removed recordId and updated the label to Last Updated */}
//           <div className="card-title text-slate-900 font-bold">Clinical Summary</div>
//           <div className="card-subtitle text-slate-500 text-xs">
//             Last Updated: {summary.updatedAt ? new Date(summary.updatedAt).toLocaleString('en-IN') : 'N/A'}
//           </div>
//         </div>
        
//         <div className="text-right">
//           <div className="text-sm">
//             <span className="font-medium text-slate-700">Primary Diagnosis:</span> 
//             <span className="ml-2 font-bold text-blue-600">{summary.primaryDiagnosis}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function RecordSummaryCard({ summary }){
//   return (
//     <div className="card p-4">
//       <div className="flex items-center justify-between">
//         <div>
//           {/* Removed recordId and updated the label to Last Updated */}
//           <div className="card-title text-slate-900 font-bold">Clinical Summary</div>
//           <div className="card-subtitle text-slate-500 text-xs">
//             Last Updated: {summary.updatedAt ? new Date(summary.updatedAt).toLocaleString('en-IN') : 'N/A'}
//           </div>
//         </div>
        
//         <div className="text-right">
//           <div className="text-sm">
//             <span className="font-medium text-slate-700">Primary Diagnosis:</span> 
//             <span className="ml-2 font-bold text-blue-600">{summary.primaryDiagnosis}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export default function RecordSummaryCard({ summary }){
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          {/* Removed recordId and updated the label to Last Updated */}
          <div className="card-title text-slate-900 font-bold">Clinical Summary</div>
          <div className="card-subtitle text-slate-500 text-xs">
            Last Updated: {summary.updatedAt ? new Date(summary.updatedAt).toLocaleString('en-IN') : 'N/A'}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm">
            <span className="font-medium text-slate-700">Primary Diagnosis:</span> 
            <span className="ml-2 font-bold text-blue-600">{summary.primaryDiagnosis}</span>
          </div>
        </div>
      </div>
    </div>
  )
}