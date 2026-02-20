export const Reportgeneration = ({
  setPeriodType,
  setSelectedDate,
  periodType,
  selectedDate,
  handleGenerate,
  setReportSelectionModal,
}) => {
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) setReportSelectionModal((prev) => !prev);
        }}
      >
        {/* Modal panel */}
        <div
          className="relative w-full max-w-lg bg-white rounded-xl border
                     transition-all duration-200 ease-out
                     px-6 pt-6 pb-5"
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundImage: 'linear-gradient(180deg, #ffffff, #f6fbfc)',
            borderColor: '#dbe5ef',
            boxShadow: '0 8px 30px -12px rgba(33, 45, 63, 0.12), 0 0 36px rgba(29, 177, 162, 0.14)',
          }}
        >
          {/* Top Accent Line */}
          <span
            className="absolute left-0 top-0 w-full h-[3px] rounded-t-xl"
            style={{ backgroundColor: '#1DB1A2' }}
            aria-hidden="true"
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 id="report-modal-title" className="text-xl font-semibold text-slate-800">
              Generate Report
            </h2>
            <button
              className="inline-flex items-center justify-center cursor-pointer rounded-md p-2 hover:bg-gray-100 transition"
              style={{ color: '#58697f' }}
              onClick={() => setReportSelectionModal((prev) => !prev)}
              aria-label="Close modal"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1" style={{ color: '#58697f' }}>
                  Report Frequency
                </label>
                <select
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value)}
                  className="w-full rounded-lg px-3 cursor-pointer py-2 text-sm border outline-none transition focus:ring-2 focus:ring-[#1DB1A2]"
                  style={{ borderColor: '#dbe5ef', color: '#58697f' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#1DB1A2'}
                  onBlur={e => e.currentTarget.style.borderColor = '#dbe5ef'}
                >
                  <option value="">Select Period</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>

              {/* Dynamic Date Picker */}
              {periodType && (
                <div className="mb-6 cursor-pointer">
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#58697f' }}>
                    {periodType === 'MONTHLY'
                      ? 'Select Month'
                      : periodType === 'WEEKLY'
                      ? 'Select Week'
                      : 'Select Date'}
                  </label>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full cursor-pointer rounded-lg px-3 py-2 text-sm border outline-none transition focus:ring-2 focus:ring-[#1DB1A2]"
                    style={{ borderColor: '#dbe5ef', color: '#58697f' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#1DB1A2'}
                    onBlur={e => e.currentTarget.style.borderColor = '#dbe5ef'}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border transition-colors"
              style={{ borderColor: '#dbe5ef', color: '#58697f' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#F0745A'; e.currentTarget.style.borderColor = '#F0745A'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '#58697f'; e.currentTarget.style.borderColor = '#dbe5ef'; }}
              onClick={() => setReportSelectionModal((prev) => !prev)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer text-white transition-all active:scale-[0.97]"
              style={{
                backgroundColor: '#1DB1A2',
                boxShadow: '0 2px 8px -2px rgba(29, 177, 162, 0.35)',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#179e90'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1DB1A2'}
              onClick={handleGenerate}
              type="button"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
``
