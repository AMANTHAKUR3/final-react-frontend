
import { useEffect } from 'react'

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop: Darkened with blur for focus */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Header: High visibility with specific typography */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
          <div>
            <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">
              {title}
            </h3>
            <div className="w-8 h-1 bg-blue-600 rounded-full mt-1"></div>
          </div>
          
          <button 
            className="group flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-90" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="text-lg font-bold">✕</span>
          </button>
        </div>

        
        <div className="p-5 md:p-8 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  )
}
