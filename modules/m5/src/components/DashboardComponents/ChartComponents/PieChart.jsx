import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PieChart({VIRTUAL,IN_PERSON}) {

  const total = VIRTUAL + IN_PERSON;
  
const data = {
  labels: ['In-Person', 'Virtual'],
  datasets: [
    {
      label: 'Appointment Distribution',
      data: [Math.ceil(((IN_PERSON/total)*100)),Math.floor((( VIRTUAL/total)*100))],
      backgroundColor: ['#1DB1A2', 'rgba(29, 177, 162, 0.18)'],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverOffset: 6,
      cutout: '40%', // 🍩 donut
    },
  ],
};


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#607489',
          usePointStyle: true,
          boxWidth: 10,
          padding: 12,
          font: { size: 12, weight: 500 },
        },
      },
      title: {
        display: true,
        text: 'Appointment Distribution',
        color: '#1f2a37',
        font: { size: 14, weight: 600 },
        padding: { top: 6, bottom: 8 },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.92)',
        titleColor: '#ffffff',
        bodyColor: '#e9eef7',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
      },
      // ✅ only addition to show labels without hover
      datalabels: {
        formatter: (value) => value, // counts only
        color: '#1f2a37',
        font: { size: 12, weight: 600 },
        anchor: 'center',
        align: 'center',
        clamp: true,
      },
    },
  };

  return (
    <div
      className="
        group relative rounded-xl border p-3 md:p-4
        shadow-sm transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 cursor-pointer
      "
      style={{
        backgroundImage: 'linear-gradient(180deg, #ffffff, #f6fbfc)',
        borderColor: '#dbe5ef',
        boxShadow: '0 4px 20px -4px rgba(33, 45, 63, 0.08)',
      }}
    >
      <span
        className="absolute left-0 top-0 h-[2px] w-full rounded-t-xl"
        style={{ backgroundColor: '#1DB1A2' }}
        aria-hidden="true"
      />
      <div className="overflow-x-auto">
        <div className="flex-none w-[400px] h-[400px]">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

