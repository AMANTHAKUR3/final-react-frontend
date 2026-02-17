
// export default function FooterBar({ onBack, onPrint, onExportFHIR }){
//   return (
//     <div className="flex flex-wrap items-center justify-between py-4">
//       <div className="text-sm text-slate-500">© 2025 EHR Demo</div>
//       <div className="flex items-center gap-2">
//         <button className="btn btn-secondary" onClick={onBack}>Back to Patient List</button>
//         {/* <button className="btn btn-secondary" onClick={onPrint}>Print Summary</button> */}
//         <button className="btn btn-primary" onClick={onExportFHIR}>Export (JSON)</button>
//       </div>
//     </div>
//   )
// }


import { ArrowLeft, Download, Printer } from 'lucide-react'; // Optional: using Lucide for icons

export default function FooterBar({ onBack, onPrint, onExportFHIR }) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        
        {/* Left Side: Brand/Copyright */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-400 tracking-wide">
            © 2025 <span className="text-slate-600 font-semibold">EHR</span> system
          </span>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          <button 
            className="inline-flex  cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Back to Patient List
          </button>

          <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

          {/* Optional Print Button - Re-styled */}
          {/* <button 
            className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
            onClick={onPrint}
          >
            <Printer size={16} />
            Print
          </button>

          <button 
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition-all hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95"
            onClick={onExportFHIR}
          >
            <Download size={16} />
            Export FHIR JSON
          </button> */}
        </div>
      </div>
    </footer>
  );
}
