import React from 'react';

export default function TagInput({ suggestions = [], value = [], onChange, placeholder = 'Add medication...' }) {
  const [input, setInput] = React.useState('');
  const [filtered, setFiltered] = React.useState([]);

  const getLabel = (item) => (typeof item === 'object' ? item.medicineName || item.name : item);

  const addTag = (tag) => {
    const label = getLabel(tag);
    if (!label || value.includes(label)) return;
    onChange([...value, label]);
    setInput('');
    setFiltered([]);
  };

  const removeTag = (tag) => onChange(value.filter(t => t !== tag));

  const onInput = (v) => {
    setInput(v);
    if (!v) { setFiltered([]); return; }
    const f = suggestions.filter(s => {
      const label = getLabel(s);
      return label?.toLowerCase().includes(v.toLowerCase());
    }).slice(0, 5);
    setFiltered(f);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) addTag(input.trim());
    }
    if (e.key === 'Backspace' && !input && value.length) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center gap-2 p-3 min-h-[58px] w-full bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-[#2bbbad] transition-all">
        {value.map(tag => (
          <span key={tag} className="inline-flex items-center gap-2 px-3 py-1 bg-[#2bbbad] text-white rounded-lg font-bold text-xs">
            {tag}
            <button type="button" className="hover:text-teal-100 transition-colors" onClick={() => removeTag(tag)}>&times;</button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[150px] bg-transparent outline-none text-slate-700 text-sm font-medium placeholder:text-slate-400"
          value={input}
          onChange={e => onInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={value.length === 0 ? placeholder : "Add more..."}
        />
      </div>
      {filtered.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-2xl z-[100] overflow-hidden">
          {filtered.map((s) => (
            <button key={getLabel(s)} className="w-full p-4 text-left text-sm hover:bg-teal-50 font-bold border-b border-slate-50 last:border-none transition-colors" onClick={() => addTag(s)}>
              {getLabel(s)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}