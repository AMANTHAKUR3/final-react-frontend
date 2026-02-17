import React, { useState } from 'react';

function AnalyticsFilter({
  defaultValues,
  onApply,
  onChange,
}) {
  const [filters, setFilters] = useState(defaultValues);

  const PERIOD_OPTIONS = [
    { value: '6m', label: 'Last 6 Months' },
    { value: '12m', label: 'Last 12 Months' },
    { value: '3m', label: 'Last 3 Months' },
    { value: '1m', label: 'Last 1 Month' },
  ];

  const PATIENT_OPTIONS = [
    { value: 'all', label: 'All Patients' },
    { value: 'in', label: 'In Patients' },
    { value: 'out', label: 'Out Patients' },
  ];

  const DEPARTMENT_OPTIONS = [
    { value: 'all', label: 'All Departments' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Gynecology', label: 'Gynecology' },
    { value: 'Oncology', label: 'Oncology' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Diagnostics', label: 'Diagnostics' },
  ];

  const METRIC_OPTIONS = [
    { value: 'all', label: 'All Metrics' },
    { value: 'recovery', label: 'Recovery' },
    { value: 'readmission', label: 'Readmission' },
  ];

  const handleChange = (name) => (e) => {
    const value = e.target.value;
    const next = { ...filters, [name]: value };
    setFilters(next);
    // Optional: Call onChange if parent wants to track live changes
    onChange?.({ name, value, allValues: next });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(filters);
    onApply(filters);
  };

  const handleReset = () => {
    // 1. Reset Local State
    setFilters(defaultValues);
    
    // 2. Notify Parent immediately to re-fetch data
    onApply?.(defaultValues);
    
    // 3. Optional change notification
    onChange?.({ name: 'reset', value: null, allValues: defaultValues });
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Analytics filters"
      className="
        relative
        bg-white
        p-5 md:p-6
        rounded-2xl
        shadow-sm
        ring-1 ring-[#1DB1A2]/15
        grid grid-cols-1 md:grid-cols-4 gap-4
      "
    >
      {/* Decorative top border using accent color */}
      <div className="absolute -top-0 left-0 right-0 h-1 rounded-t-2xl bg-[#1DB1A2]" aria-hidden="true" />

      {/* Period */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="period">
          Period
        </label>
        <select
          id="period"
          className="
            border border-[#1DB1A2]/30
            rounded-lg
            p-2.5
            text-sm
            bg-white
            shadow-inner
            focus:outline-none
            focus:ring-2 focus:ring-[#1DB1A2]
            focus:border-[#1DB1A2]
            hover:border-[#1DB1A2]/60
            cursor-pointer
            transition-colors
          "
          value={filters.period}
          onChange={handleChange('period')}
        >
          {PERIOD_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Patient Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="patientType">
          Patient Type
        </label>
        <select
          id="patientType"
          className="
            border border-[#1DB1A2]/30
            rounded-lg
            p-2.5
            text-sm
            bg-white
            shadow-inner
            focus:outline-none
            focus:ring-2 focus:ring-[#1DB1A2]
            focus:border-[#1DB1A2]
            hover:border-[#1DB1A2]/60
            cursor-pointer
            transition-colors
          "
          value={filters.patientType}
          onChange={handleChange('patientType')}
        >
          {PATIENT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Department */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="department">
          Department
        </label>
        <select
          id="department"
          className="
            border border-[#1DB1A2]/30
            rounded-lg
            p-2.5
            text-sm
            bg-white
            shadow-inner
            focus:outline-none
            focus:ring-2 focus:ring-[#1DB1A2]
            focus:border-[#1DB1A2]
            hover:border-[#1DB1A2]/60
            cursor-pointer
            transition-colors
          "
          value={filters.department}
          onChange={handleChange('department')}
        >
          {DEPARTMENT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Metric */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700" htmlFor="metric">
          Metric
        </label>
        <select
          id="metric"
          className="
            border border-[#1DB1A2]/30
            rounded-lg
            p-2.5
            text-sm
            bg-white
            shadow-inner
            focus:outline-none
            focus:ring-2 focus:ring-[#1DB1A2]
            focus:border-[#1DB1A2]
            hover:border-[#1DB1A2]/60
            cursor-pointer
            transition-colors
          "
          value={filters.metric}
          onChange={handleChange('metric')}
        >
          {METRIC_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="md:col-span-4 flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
        <button
          type="button"
          onClick={handleReset}
          className="
            inline-flex items-center justify-center
            border border-[#aa4a3a]
            text-[#aa4a3a]
            text-sm font-semibold
            px-5 py-2.5
            rounded-lg
            hover:bg-[#aa4a3a]/10
            active:bg-[#aa4a3a]/15
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#aa4a3a]
            transition-colors
            cursor-pointer
          "
        >
          Reset Filters
        </button>
        <button
          type="submit"
          className="
            inline-flex items-center justify-center
            bg-[#1DB1A2]
            text-white
            text-sm font-semibold
            px-8 py-2.5
            rounded-lg
            shadow-sm
            hover:bg-[#1DB1A2]/90
            active:bg-[#1DB1A2]/80
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB1A2]
            transition-colors
            cursor-pointer
          "
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}

export default AnalyticsFilter;